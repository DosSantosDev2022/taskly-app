// src/hooks/task/use-update-task.ts
import { Task } from "@/@types/project-types";
import { type CreateTaskInput } from "@/@types/zod";
import { updateTask as updateTaskAction } from "@/actions/task"; // Sua Server Action de edição
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Função de mutação que chama a Server Action de atualização.
// Ela recebe um objeto com o ID da tarefa e os novos dados.
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

	// ✅ Garanta que `updatedTask` existe antes de retorná-lo.
	// Isso resolve o erro de tipagem.
	if (!result.updatedTask) {
		throw new Error("Dados da tarefa atualizada não encontrados.");
	}

	// ✅ Retorna APENAS o objeto `updatedTask` em caso de sucesso.
	return result.updatedTask;
};

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
