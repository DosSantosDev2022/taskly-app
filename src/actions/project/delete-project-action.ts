"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z, ZodError } from "zod";

const deleteProjectSchema = z.string().min(1, "O ID do projeto é obrigatório.");

/**
 * @function deleteTask
 * @description Server Action para deletar um projeto existente no banco de dados.
 * Valida o ID do projeto, executa a exclusão via Prisma e revalida o cache
 * da página do projeto.
 * @param {string} projectId - O ID único do projeto a ser deletado.
 * @returns {Promise<{ success: boolean; message?: string; errors?: Zod.inferFlattenedErrors<typeof deleteProjectSchema>['fieldErrors'] | { general?: string; projectId?: string }; deletedProject?: { projectId: string } }>}
 
 */
export async function deleteProjectAction(formData: FormData) {
	// Extrai o ID do projeto do FormData
	const projectId = formData.get("projectId") as string;

	//  Validação Simples do ID
	if (!projectId || typeof projectId !== "string") {
		console.error("Server Action: ID do projeto inválido ou ausente.");
		return { success: false, message: "ID do projeto inválido ou ausente." };
	}

	try {
		// Validação do ID do projeto
		const validation = deleteProjectSchema.safeParse(projectId);

		// Se a validação falhar, retorna um objeto de erro padronizado.
		if (!validation.success) {
			console.error(
				"Erro de validação ao deletar projeto:",
				z.treeifyError(validation.error),
			);
			return {
				success: false,
				message:
					"ID do projeto inválido. Não foi possível prosseguir com a exclusão.",
				errors: z.treeifyError(validation.error),
			};
		}

		// Se a validação for bem-sucedida, extrai o ID validado
		const validatedProjectId = validation.data;

		// 2. Exclusão do projeto no banco de dados via Prisma
		const deletedProject = await db.project.delete({
			where: {
				id: validatedProjectId,
			},
		});

		// Converte o campo 'price' para number ANTES de retornar
		const serializedDeletedProject = {
			...deletedProject,
			price: deletedProject.price.toNumber(), // Ou .toString() se preferir string
			// Garanta que outros campos como Date também sejam serializáveis se houver necessidade
			createdAt: deletedProject.createdAt.toISOString(),
			updatedAt: deletedProject.updatedAt.toISOString(),
			// Se houver deadlineDate, trate também
			deadlineDate: deletedProject.deadlineDate?.toISOString() || null,
		};

		// Revalida a rota da página do projeto pai para garantir atualização dos dados
		revalidatePath("/projects");
		// 4. Retorna sucesso
		return {
			success: true,
			deletedProject: serializedDeletedProject,
			message: "Projeto deletado com sucesso!",
		};
	} catch (error) {
		// 5. Tratamento de erros
		console.error("Erro ao deletar projeto:", error);

		// Tratamento específico para o erro "Registro não encontrado" do Prisma (P2025)
		if (
			error instanceof Error &&
			"code" in error &&
			(error as any).code === "P2025"
		) {
			return {
				success: false,
				message:
					"O projeto especificado não foi encontrado. Pode já ter sido removida.",
				errors: { taskId: "Projeto não encontrado." },
			};
		}

		// Tratamento para erros de validação Zod (geralmente já capturados por `safeParse`)
		if (error instanceof ZodError) {
			return {
				success: false,
				message: "Erro de validação dos dados fornecidos.",
				errors: z.treeifyError(error),
			};
		}

		// Tratamento para qualquer outro erro inesperado no servidor
		return {
			success: false,
			message:
				"Ocorreu um erro interno do servidor ao deletar o projeto. Por favor, tente novamente.",
			errors: { general: "Erro inesperado do servidor." },
		};
	}
}
