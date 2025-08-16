// src/hooks/task/use-update-task.ts
import { Task } from "@/@types/project-types";
import { type CreateTaskInput } from "@/@types/zod";
import { updateTask as updateTaskAction } from "@/actions/task"; // Sua Server Action de edição
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * @function updateTask
 * @description Atualiza uma tarefa existente no banco de dados.
 * @param {string} taskId - O ID da tarefa a ser atualizada.
 * @param {CreateTaskInput} taskData - Os dados da tarefa a serem atualizados.
 * @returns {Promise<UpdateTaskResult>} Retorna um objeto indicando o sucesso ou falha da operação.
 */
const updateTask = async ({
	taskId,
	taskData,
}: {
	taskId: string;
	taskData: CreateTaskInput;
}) => {
	const result = await updateTaskAction(taskId, taskData);

	// Se a operação não for bem-sucedida, lança uma exceção.
	if (!result.success) {
		throw new Error(result.message || "Erro ao atualizar a tarefa.");
	}

	if (!result.updatedTask) {
		throw new Error("Dados da tarefa atualizada não encontrados.");
	}

	return result.updatedTask;
};

/**
 * @hook useUpdateTask
 * @description Hook customizado que gerencia a mutação de atualização de uma tarefa.
 * Utiliza o TanStack Query para gerenciar o estado, feedback visual (toasts) e a invalidação
 * do cache após a atualização bem-sucedida.
 * @returns {object} Um objeto de mutação do React Query com funções e estados úteis.
 */
export const useUpdateTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateTask,
		onSuccess: (updatedTask) => {
			// O `updatedTask` é o dado retornado pela sua função `updateTask`
			toast.success("Tarefa atualizada com sucesso!", {
				autoClose: 3000,
				theme: "dark",
			});

			// Invalida a query do projeto para recarregar as tasks e o progresso
			queryClient.invalidateQueries({
				queryKey: ["project", (updatedTask as Task).projectId],
			});
		},
		onError: (error) => {
			// O `error` agora é a exceção lançada pela sua função de mutação.
			toast.error(error.message || "Ocorreu um erro ao atualizar a tarefa.", {
				autoClose: 3000,
				theme: "dark",
			});
		},
	});
};
