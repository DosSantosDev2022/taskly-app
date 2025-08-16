// src/hooks/comment/use-add-comment.ts
import { CreateCommentInput } from "@/@types/zod";
import { addCommentAction, type AddCommentResult } from "@/actions/comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * @fileoverview Hook para adicionar um novo comentário usando Server Actions e React Query.
 */

/**
 * Função de mutação que chama a Server Action `addCommentAction`.
 * @param {{ newComment: CreateCommentInput }} data - Objeto com os dados do formulário.
 * @returns {Promise<AddCommentResult>} O resultado da Server Action.
 * @throws {Error} Erro com a mensagem e detalhes do resultado da Server Action.
 */
const addCommentMutationFn = async (newComment: CreateCommentInput) => {
	const result = await addCommentAction(newComment);

	if (!result.success) {
		throw new Error(result.message || "Erro ao adicionar comentário.");
	}
	return result;
};

/**
 * Hook customizado para adicionar um novo comentário.
 *
 * Gerencia o ciclo de vida da mutação, exibindo toasts e invalidando a query de comentários.
 *
 * @returns {object} Objeto de mutação do React Query.
 */
export const useAddComment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		/**
		 * Função que executa a mutação.
		 * @param {CreateCommentInput} newComment - Dados do formulário para o comentário.
		 */
		mutationFn: addCommentMutationFn,
		/**
		 * Callback para sucesso da mutação.
		 * @param {AddCommentResult} data - O resultado da Server Action.
		 */
		onSuccess: (data) => {
			toast.success(data.message || "Comentário adicionado com sucesso!", {
				autoClose: 3000,
				theme: "dark",
			});

			// Acessamos o projectId do objeto `data` retornado pela mutação.
			const projectId = data.newComment?.projectId;
			if (projectId) {
				queryClient.invalidateQueries({
					queryKey: ["project", projectId, "comments"],
				});
			}
		},
		/**
		 * Callback para erro da mutação.
		 * @param {Error} error - O objeto de erro da mutação.
		 */
		onError: (error) => {
			toast.error(error.message || "Ocorreu um erro!", {
				autoClose: 3000,
				theme: "dark",
			});
		},
	});
};
