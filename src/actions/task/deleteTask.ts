"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z, ZodError } from "zod";

// --- Definição do Schema de Validação com Zod ---
/**
 * @const deleteTaskSchema
 * @description Schema de validação Zod para o ID da tarefa a ser deletada.
 * Garante que o ID seja uma string não vazia.
 */
const deleteTaskSchema = z.string().min(1, "O ID da tarefa é obrigatório.");

/**
 * @function deleteTask
 * @description Server Action para deletar uma tarefa existente no banco de dados.
 * Valida o ID da tarefa, executa a exclusão via Prisma e revalida o cache
 * da página do projeto associado à tarefa.
 *
 * @param {string} taskId - O ID único da tarefa a ser deletada.
 * @returns {Promise<{ success: boolean; message?: string; errors?: Zod.inferFlattenedErrors<typeof deleteTaskSchema>['fieldErrors'] | { general?: string; taskId?: string }; deletedTask?: { projectId: string } }>}
 * Um objeto com o status da operação, uma mensagem, erros (se houver) e, em caso de sucesso, o ID do projeto da tarefa deletada.
 */
export async function deleteTask(taskId: string) {
	try {
		// 1. Validação do ID da tarefa
		const validation = deleteTaskSchema.safeParse(taskId);

		// Se a validação falhar, retorna um objeto de erro padronizado.
		if (!validation.success) {
			console.error(
				"Erro de validação ao deletar tarefa:",
				validation.error.flatten().fieldErrors,
			);
			return {
				success: false,
				message:
					"ID da tarefa inválido. Não foi possível prosseguir com a exclusão.",
				errors: validation.error.flatten().fieldErrors,
			};
		}

		const validatedTaskId = validation.data;

		// 2. Exclusão da tarefa no banco de dados via Prisma
		const deletedTask = await db.task.delete({
			where: {
				id: validatedTaskId,
			},
			select: {
				projectId: true, // Seleciona apenas o `projectId` para uso na revalidação do cache
			},
		});

		// 3. Revalidação do cache
		// Revalida a rota da página do projeto pai para garantir que a lista de tarefas
		// seja atualizada e a tarefa deletada não apareça mais.
		revalidatePath(`/projects/${deletedTask.projectId}`);

		// 4. Retorna sucesso
		return {
			success: true,
			deletedTask: deletedTask, // Opcional: retornar o objeto deletado pode ser útil para o frontend.
			message: "Tarefa deletada com sucesso!",
		};
	} catch (error) {
		// 5. Tratamento de erros
		console.error("Erro ao deletar tarefa:", error);

		// Tratamento específico para o erro "Registro não encontrado" do Prisma (P2025)
		if (
			error instanceof Error &&
			"code" in error &&
			(error as any).code === "P2025"
		) {
			return {
				success: false,
				message:
					"A tarefa especificada não foi encontrada. Pode já ter sido removida.",
				errors: { taskId: "Tarefa não encontrada." },
			};
		}

		// Tratamento para erros de validação Zod (geralmente já capturados por `safeParse`)
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
				"Ocorreu um erro interno do servidor ao deletar a tarefa. Por favor, tente novamente.",
			errors: { general: "Erro inesperado do servidor." },
		};
	}
}
