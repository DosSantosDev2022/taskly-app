"use server";

import { db } from "@/lib/prisma";
import { ProjectStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * @file Server Action para alternar o status de um projeto.
 * @module toggleProjectStatus
 */

// --- Tipos e Interfaces ---

/**
 * @typedef {Object} ToggleProjectStatusState
 * @property {boolean} success - Indica se a operação foi bem-sucedida.
 * @property {string} [message] - Mensagem de sucesso ou de erro geral.
 * @property {Object.<string, string[]>} [errors] - Objeto contendo erros de validação por campo.
 */
interface ToggleProjectStatusState {
	success: boolean;
	message?: string;
	errors?: {
		projectId?: string[];
		currentStatus?: string[];
		// Adicione outros campos se a validação se tornar mais complexa
		_form?: string[]; // Erros gerais do formulário, não específicos de um campo
	};
}

// --- Schemas de Validação ---

/**
 * @constant {Zod.Schema} ToggleProjectStatusSchema - Schema de validação para os dados de entrada da Server Action.
 * Utiliza Zod para garantir que `projectId` é um ID válido e `currentStatus` é um status de projeto reconhecido.
 */
const ToggleProjectStatusSchema = z.object({
	projectId: z
		.string()
		.trim()
		.min(1, { message: "O ID do projeto é obrigatório." }),
	// Valida que o currentStatus é um dos valores do enum ProjectStatus
	currentStatus: z.enum(ProjectStatus, {
		message: "Status do projeto inválido. Selecione um status válido.",
	}),
});

// --- Função Principal (Server Action) ---

/**
 * Alterna o status de um projeto entre PENDING, IN_PROGRESS e COMPLETED.
 *
 * @function toggleProjectStatus
 * @param {string} projectId - O ID único do projeto a ser atualizado.
 * @param {ProjectStatus} currentStatus - O status atual do projeto.
 * @returns {Promise<ToggleProjectStatusState>} Um objeto indicando o sucesso da operação,
 * uma mensagem e/ou erros de validação ou do servidor.
 */
export async function toggleProjectStatusAction(
	projectId: string,
	currentStatus: ProjectStatus,
): Promise<ToggleProjectStatusState> {
	// 1. Validação dos dados de entrada com Zod
	const validation = ToggleProjectStatusSchema.safeParse({
		projectId,
		currentStatus,
	});

	if (!validation.success) {
		// Mapeia os erros do Zod para o formato de retorno padronizado
		const fieldErrors: { [key: string]: string[] } = {};
		validation.error.issues.forEach((issue) => {
			// Ajuste para lidar com o issue.path como string[]
			const path = issue.path.join("."); // Converte path de array para string
			if (path) {
				if (!fieldErrors[path]) {
					fieldErrors[path] = [];
				}
				fieldErrors[path].push(issue.message);
			}
		});

		return {
			success: false,
			errors: fieldErrors,
			message: "Falha na validação dos dados.",
		};
	}

	const {
		projectId: validatedProjectId,
		currentStatus: validatedCurrentStatus,
	} = validation.data;

	// 2. Lógica para determinar o próximo status (mantida a lógica original)
	let newStatus: ProjectStatus;
	switch (validatedCurrentStatus) {
		case "PENDING":
			newStatus = "IN_PROGRESS";
			break;
		case "IN_PROGRESS":
			newStatus = "COMPLETED";
			break;
		case "COMPLETED":
			newStatus = "PENDING"; // Volta para PENDING conforme o comportamento original
			break;
		default:
			// Este caso é teoricamente inatingível devido à validação Zod de nativeEnum,
			// mas é mantido como fallback defensivo.
			newStatus = "PENDING";
	}

	try {
		// 3. Interação com o Banco de Dados (Prisma)
		const updatedProject = await db.project.update({
			where: { id: validatedProjectId },
			data: {
				status: newStatus,
				updatedAt: new Date(), // Adiciona ou atualiza o timestamp de `updatedAt`
			},
			// Otimização: Retorna apenas os campos necessários (ID e novo status)
			select: {
				id: true,
				status: true,
			},
		});

		// Revalida o caminho da página para mostrar o status atualizado.
		revalidatePath(`/projects/project/${validatedProjectId}`);
		revalidatePath("/projects");

		// 5. Retorno de sucesso padronizado
		return {
			success: true,
			message: `Status do projeto "${updatedProject.id}" atualizado para "${newStatus}".`,
		};
	} catch (error) {
		console.error("Erro ao alternar status do projeto:", error);

		// 6. Tratamento de erros específicos do Prisma
		if (error instanceof Error) {
			// Exemplo de tratamento de erro Prisma específico
			if ("code" in error && error.code === "P2025") {
				// P2025: An operation failed because it depends on one or more records that were required but not found.
				return {
					success: false,
					errors: { projectId: ["Projeto não encontrado ou já foi excluído."] },
					message: "Projeto não encontrado.",
				};
			}
			// Outros erros Prisma podem ser tratados aqui (ex: P2003 para foreign key)

			// Retorno para erros genéricos do servidor
			return {
				success: false,
				errors: {
					_form: [
						"Ocorreu um erro inesperado ao atualizar o status do projeto.",
					],
				},
				message: "Falha interna do servidor.",
			};
		}

		// Fallback para erros não esperados
		return {
			success: false,
			errors: { _form: ["Ocorreu um erro desconhecido."] },
			message: "Falha inesperada.",
		};
	}
}
