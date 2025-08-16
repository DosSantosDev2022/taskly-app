// src/actions/comment.ts
"use server";

import { deleteCommentSchema } from "@/@types/zod";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

/**
 * Resultado da ação de deletar um comentário.
 * @interface DeleteCommentResult
 * @property {boolean} success - Indica se a ação foi bem-sucedida.
 * @property {string} [message] - Uma mensagem descritiva sobre o resultado da ação.
 * @property {{ projectId: string }} [deletedComment] - Um objeto contendo o ID do projeto do comentário deletado.
 * @property {Record<string, string[]>} [errors] - Um objeto contendo erros de validação ou de lógica de negócio, mapeando campos para arrays de mensagens de erro.
 */
export interface DeleteCommentResult {
	success: boolean;
	message?: string;
	deletedComment?: { projectId: string };
	errors?: Record<string, string[]>;
}

/**
 * Deleta um comentário específico do banco de dados.
 * Esta é uma Server Action que valida o ID do comentário, o remove do banco de dados
 * e revalida o cache das rotas relacionadas.
 * @param {string} commentId - O ID do comentário a ser deletado.
 * @returns {Promise<DeleteCommentResult>} - O resultado da operação, incluindo o status de sucesso, mensagens, e dados do comentário deletado.
 */
export async function deleteCommentAction(
	commentId: string,
): Promise<DeleteCommentResult> {
	try {
		// Valida o ID do comentário usando o schema Zod
		const validation = deleteCommentSchema.safeParse(commentId);
		// Se a validação falhar, retorna os erros
		if (!validation.success) {
			console.error(
				"Erro de validação ao deletar comentário:",
				validation.error.flatten().fieldErrors,
			);
			return {
				success: false,
				message:
					"ID do comentário inválido. Não foi possível prosseguir com a exclusão.",
				errors: Object.fromEntries(
					Object.entries(validation.error.flatten().fieldErrors).map(
						([key, value]) => [key, Array.isArray(value) ? value : [value]],
					),
				),
			};
		}

		// Se a validação for bem-sucedida, extrai o ID do comentário
		const validatedCommentId = validation.data;
		// Deleta o comentário do banco de dados
		const deletedComment = await db.comment.delete({
			where: {
				id: validatedCommentId,
			},
			select: {
				projectId: true,
			},
		});

		// Revalida as rotas para atualizar os dados em cache
		revalidatePath(`/projects/${deletedComment.projectId}`);
		revalidatePath(`/projects/project/${deletedComment.projectId}`);
		// Retorna o resultado com sucesso e os dados do comentário deletado
		return {
			success: true,
			deletedComment: deletedComment,
			message: "Comentário deletado com sucesso!",
		};
	} catch (error) {
		console.error("Erro ao deletar comentário:", error);

		if (
			error instanceof Error &&
			"code" in error &&
			(error as any).code === "P2025"
		) {
			return {
				success: false,
				message:
					"O comentário especificado não foi encontrado. Pode já ter sido removido.",
				errors: { commentId: ["Comentário não encontrado."] },
			};
		}

		if (error instanceof ZodError) {
			return {
				success: false,
				message: "Erro de validação dos dados fornecidos.",
				errors: error.flatten().fieldErrors,
			};
		}

		return {
			success: false,
			message:
				"Ocorreu um erro interno do servidor ao deletar o comentário. Por favor, tente novamente.",
			errors: { general: ["Erro inesperado do servidor."] },
		};
	}
}
