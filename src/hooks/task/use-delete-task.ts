// src/hooks/task/use-delete-task.ts
import { deleteTask } from "@/actions/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * @fileoverview Hook para deletar uma tarefa usando Server Actions e React Query.
 */

/**
 * Interface que define o retorno de sucesso da Server Action `deleteTask`.
 * @interface DeleteTaskResult
 * @property {boolean} success - Indica se a operação foi bem-sucedida.
 * @property {string} message - Mensagem descritiva do resultado da operação.
 * @property {{ projectId: string }} deletedTask - O objeto da tarefa deletada.
 */
interface DeleteTaskResult {
	success: boolean;
	message?: string;
	deletedTask?: { projectId: string };
	errors?: Record<string, string[]>;
}

/**
 * Função de mutação que chama a Server Action `deleteTask`.
 *
 * @param {string} taskId - O ID da tarefa a ser deletada.
 * @returns {Promise<DeleteTaskResult>} O resultado da Server Action.
 * @throws {Error} Erro com a mensagem e detalhes do resultado da Server Action.
 */
const deleteTaskMutationFn = async (
	taskId: string,
): Promise<DeleteTaskResult> => {
	const result = await deleteTask(taskId);

	if (!result.success) {
		const error = new Error(result.message || "Erro ao deletar a tarefa.");
		if (result.errors) {
			(error as any).errors = result.errors;
		}
		throw error;
	}
	return result;
};

/**
 * Hook customizado para deletar uma tarefa.
 *
 * Gerencia o ciclo de vida da mutação, exibindo toasts e invalidando a query de tarefas do projeto.
 *
 * @returns {object} Objeto de mutação do React Query.
 */
export const useDeleteTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		/**
		 * Função que executa a mutação.
		 * @param {string} taskId - ID da tarefa a ser deletada.
		 */
		mutationFn: deleteTaskMutationFn,

		/**
		 * Callback para sucesso da mutação.
		 * @param {DeleteTaskResult} data - O resultado da Server Action.
		 */
		onSuccess: (data) => {
			toast.success(data.message || "Tarefa deletada com sucesso!", {
				autoClose: 3000,
				theme: "dark",
			});

			// Se a Server Action retornar o ID do projeto, invalidamos a query correspondente.
			const projectId = data.deletedTask?.projectId;
			if (projectId) {
				queryClient.invalidateQueries({
					queryKey: ["project", projectId, "tasks"],
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
