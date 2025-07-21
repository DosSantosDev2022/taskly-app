"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z, ZodError } from "zod";

// --- Definição do Schema de Validação com Zod ---
/**
 * @const deleteCommentSchema
 * @description Schema de validação Zod para o ID do comentário a ser deletado.
 * Garante que o ID seja uma string não vazia.
 */
const deleteCommentSchema = z
	.string()
	.min(1, "O ID do comentário é obrigatório.");

/**
 * @function deleteComment
 * @description Server Action para deletar um comentário existente no banco de dados.
 * Valida o ID do comentário, executa a exclusão via Prisma e revalida o cache
 * da página do projeto associado ao comentário.
 *
 * @param {string} commentId - O ID único do comentário a ser deletado.
 * @returns {Promise<{ success: boolean; message?: string; errors?: Zod.inferFlattenedErrors<typeof deleteCommentSchema>['fieldErrors'] | { general?: string; commentId?: string }; deletedComment?: { projectId: string } }>}
 * Um objeto com o status da operação, uma mensagem, erros (se houver) e, em caso de sucesso, o ID do projeto do comentário deletado.
 */
export async function deleteComment(commentId: string) {
	try {
		// 1. Validação do ID do comentário
		// O nome da variável de entrada foi ajustado de `taskId` para `commentId` para clareza e consistência.
		const validation = deleteCommentSchema.safeParse(commentId);

		// Se a validação falhar, retorna um objeto de erro padronizado.
		if (!validation.success) {
			console.error(
				"Erro de validação ao deletar comentário:",
				validation.error.flatten().fieldErrors,
			);
			return {
				success: false,
				message:
					"ID do comentário inválido. Não foi possível prosseguir com a exclusão.",
				errors: validation.error.flatten().fieldErrors,
			};
		}

		const validatedCommentId = validation.data;

		// 2. Exclusão do comentário no banco de dados via Prisma
		const deletedComment = await db.comment.delete({
			where: {
				id: validatedCommentId,
			},
			select: {
				projectId: true, // Seleciona apenas o `projectId` para uso na revalidação do cache
			},
		});

		// 3. Revalidação do cache
		// Revalida a rota da página do projeto pai para garantir que a lista de comentários
		// seja atualizada e o comentário deletado não apareça mais.
		revalidatePath(`/projects/${deletedComment.projectId}`);

		// 4. Retorna sucesso
		return {
			success: true,
			deletedComment: deletedComment, // Opcional: retornar o objeto deletado pode ser útil para o frontend.
			message: "Comentário deletado com sucesso!",
		};
	} catch (error) {
		// 5. Tratamento de erros
		console.error("Erro ao deletar comentário:", error);

		// Tratamento específico para o erro "Registro não encontrado" do Prisma (P2025)
		if (
			error instanceof Error &&
			"code" in error &&
			(error as any).code === "P2025"
		) {
			return {
				success: false,
				message:
					"O comentário especificado não foi encontrado. Pode já ter sido removido.",
				errors: { commentId: "Comentário não encontrado." }, // Nome do campo ajustado
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
				"Ocorreu um erro interno do servidor ao deletar o comentário. Por favor, tente novamente.",
			errors: { general: "Erro inesperado do servidor." },
		};
	}
}
