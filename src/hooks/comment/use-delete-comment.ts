// src/hooks/comment/use-delete-comment.ts
import { deleteCommentAction } from "@/actions/comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * @fileoverview Hook para deletar um comentário usando Server Actions e React Query.
 */

// --- Tipagem do Retorno da Server Action ---
/**
 * @interface DeleteCommentResult
 * @description Define a estrutura do retorno da Server Action `deleteCommentAction`.
 */
interface DeleteCommentResult {
	success: boolean;
	message?: string;
	deletedComment?: { projectId: string };
	errors?: Record<string, string[]>;
}

// --- Função de Mutação ---
/**
 * @function deleteCommentMutationFn
 * @description Função wrapper que chama a Server Action `deleteCommentAction`.
 * Lança um erro se a operação não for bem-sucedida para que o React Query possa
 * capturá-lo e acionar o callback `onError`.
 *
 * @param {string} commentId - O ID do comentário a ser deletado.
 * @returns {Promise<DeleteCommentResult>} O resultado da Server Action.
 * @throws {Error} Um erro com a mensagem e detalhes do resultado da Server Action.
 */
const deleteCommentMutationFn = async (
	commentId: string,
): Promise<DeleteCommentResult> => {
	const result = await deleteCommentAction(commentId);

	if (!result.success) {
		const error = new Error(result.message || "Erro ao deletar o comentário.");
		if (result.errors) {
			(error as any).errors = result.errors;
		}
		throw error;
	}

	return result;
};

// --- Hook Principal ---
/**
 * @hook useDeleteComment
 * @description Hook customizado para gerenciar a exclusão de um comentário.
 * Ele lida com o ciclo de vida da mutação, feedback visual (toasts) e a
 * invalidação do cache de comentários para garantir que a UI seja atualizada.
 *
 * @returns {object} Um objeto de mutação do React Query com funções e estados úteis.
 */
export const useDeleteComment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCommentMutationFn,

		// --- Callbacks do Ciclo de Vida da Mutação ---

		/**
		 * @param {DeleteCommentResult} data - O resultado da mutação em caso de sucesso.
		 * @param {string} commentId - O ID do comentário que foi deletado.
		 */
		onSuccess: (data) => {
			toast.success(data.message || "Comentário deletado com sucesso!", {
				autoClose: 3000,
				theme: "dark",
			});

			// Se a Server Action retornar o ID do projeto, invalidamos a query correspondente.
			const projectId = data.deletedComment?.projectId;
			if (projectId) {
				// ⭐️ Invalida a query de comentários do projeto específico para forçar o refetch.
				queryClient.invalidateQueries({
					queryKey: ["project", projectId, "comments"],
				});
			}
		},

		/**
		 * @param {Error} error - O objeto de erro capturado em caso de falha na mutação.
		 */
		onError: (error) => {
			toast.error(error.message || "Ocorreu um erro!", {
				autoClose: 3000,
				theme: "dark",
			});
		},
	});
};
