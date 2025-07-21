"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z, ZodError } from "zod";

// --- Definição do Tipo de Status da Tarefa ---
/**
 * @typedef {'PENDING' | 'IN_PROGRESS' | 'COMPLETED'} TaskStatus
 * @description Tipo literal que define os possíveis estados de uma tarefa.
 */
type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

// --- Definição do Schema de Validação com Zod ---
/**
 * @const updateTaskStatusSchema
 * @description Schema de validação Zod para os dados de entrada necessários
 * para alternar o status de uma tarefa. Garante que os IDs e o status
 * atual sejam válidos.
 */
const updateTaskStatusSchema = z.object({
	taskId: z.string().min(1, "O ID da tarefa é obrigatório."),
	currentStatus: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"], {
		message: "Status da tarefa inválido.",
	}),
	projectId: z
		.string()
		.min(1, "O ID do projeto é obrigatório para revalidação."),
});

/**
 * @function getNextStatus
 * @description Função utilitária para determinar o próximo status no ciclo de vida da tarefa.
 *
 * @param {TaskStatus} currentStatus - O status atual da tarefa.
 * @returns {TaskStatus} O próximo status na sequência.
 */
const getNextStatus = (currentStatus: TaskStatus): TaskStatus => {
	switch (currentStatus) {
		case "PENDING":
			return "IN_PROGRESS";
		case "IN_PROGRESS":
			return "COMPLETED";
		case "COMPLETED":
			return "PENDING";
		default:
			// Isso nunca deveria ser alcançado devido à validação Zod, mas é uma salvaguarda.
			throw new Error("Status da tarefa desconhecido.");
	}
};

/**
 * @function toggleTaskStatus
 * @description Server Action para alternar o status de uma tarefa.
 * Recebe os dados do formulário, valida-os, determina o próximo status
 * no ciclo e atualiza a tarefa no banco de dados. Revalida o cache
 * da rota do projeto para refletir a mudança.
 *
 * @param {FormData} formData - Os dados do formulário contendo taskId, currentStatus e projectId.
 * @returns {Promise<{ success: boolean; message?: string; errors?: Zod.inferFlattenedErrors<typeof updateTaskStatusSchema>['fieldErrors'] | { general?: string; taskId?: string } }>}
 * Objeto com o status da operação (sucesso/falha), uma mensagem e, em caso de falha, erros de validação ou do servidor.
 */
export async function toggleTaskStatus(formData: FormData) {
	// Coleta os dados do FormData
	const taskId = formData.get("taskId") as string;
	const currentStatus = formData.get("currentStatus") as TaskStatus;
	const projectId = formData.get("projectId") as string;

	try {
		// 1. Validação dos dados de entrada com Zod
		const validation = updateTaskStatusSchema.safeParse({
			taskId,
			currentStatus,
			projectId,
		});

		if (!validation.success) {
			console.error(
				"Erro de validação ao atualizar status da tarefa:",
				validation.error.flatten().fieldErrors,
			);
			return {
				success: false,
				message: "Dados de entrada inválidos para atualizar o status.",
				errors: validation.error.flatten().fieldErrors,
			};
		}

		const {
			taskId: validatedTaskId,
			currentStatus: validatedCurrentStatus,
			projectId: validatedProjectId,
		} = validation.data;

		// 2. Determina o próximo status
		const nextStatus = getNextStatus(validatedCurrentStatus);

		// 3. Atualiza o status da tarefa no banco de dados
		const updatedTask = await db.task.update({
			where: { id: validatedTaskId },
			data: {
				status: nextStatus,
				updatedAt: new Date(), // Atualiza o timestamp de modificação
			},
			select: {
				id: true, // Apenas o ID da tarefa é necessário para o retorno, se precisar
				projectId: true, // Já que o projectId é o mesmo que o validatedProjectId
			},
		});

		// 4. Revalida o cache da página do projeto para refletir a mudança na UI
		revalidatePath(`/projects/${validatedProjectId}`);

		// 5. Retorna sucesso
		return {
			success: true,
			message: `Status da tarefa atualizado para '${nextStatus}' com sucesso!`,
			updatedTask: {
				id: updatedTask.id, // Retorna apenas os dados essenciais se o frontend precisar
				status: nextStatus,
			},
		};
	} catch (error) {
		// 6. Tratamento de erros
		console.error("Erro ao atualizar status da tarefa:", error);

		// Tratamento específico para o erro "Registro não encontrado" do Prisma (P2025)
		if (
			error instanceof Error &&
			"code" in error &&
			(error as any).code === "P2025"
		) {
			return {
				success: false,
				message: "A tarefa que você tentou atualizar não foi encontrada.",
				errors: { taskId: "Tarefa não encontrada." },
			};
		}

		// Tratamento para erros de validação Zod (se por algum motivo escaparem do safeParse inicial)
		if (error instanceof ZodError) {
			return {
				success: false,
				message: "Erro de validação dos dados fornecidos.",
				errors: error.flatten().fieldErrors,
			};
		}

		// Tratamento para qualquer outro erro inesperado no servidor
		return {
			success: false,
			message:
				"Ocorreu um erro interno do servidor ao atualizar o status da tarefa. Por favor, tente novamente.",
			errors: { general: "Erro inesperado do servidor." },
		};
	}
}
