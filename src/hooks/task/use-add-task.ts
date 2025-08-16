// src/hooks/use-add-task.ts
import { type CreateTaskInput } from "@/@types/zod";
import { addTaskAction } from "@/actions/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * @fileoverview Hook para adicionar uma nova tarefa usando Server Actions e React Query.
 */

/**
 * Função de mutação que chama a Server Action `addTaskAction` para criar uma nova tarefa.
 *
 * Esta função é responsável por:
 * 1. Chamar a Server Action com os dados da tarefa.
 * 2. Tratar o retorno da Server Action, lançando um erro se a operação falhar.
 * 3. Retornar os dados da nova tarefa em caso de sucesso.
 *
 * @param {CreateTaskInput} taskData - Os dados da nova tarefa a ser criada, validados pelo Zod.
 * @returns {Promise<Object>} Uma promessa que resolve com o objeto da nova tarefa.
 * @throws {Error} Se a Server Action retornar um erro, uma exceção é lançada com a mensagem do erro.
 */
const addTask = async (taskData: CreateTaskInput) => {
	// Chama a Server Action diretamente para adicionar a tarefa.
	const result = await addTaskAction(taskData);

	// Verifica o resultado da Server Action.
	if (!result.success) {
		// Se a Server Action falhou, lança uma exceção com a mensagem de erro para que o React Query a capture.
		throw new Error(result.message || "Erro ao adicionar a tarefa.");
	}

	// Retorna os dados da nova tarefa em caso de sucesso.
	return result.newTask;
};

/**
 * Um hook customizado que utiliza `useMutation` do React Query para gerenciar
 * o ciclo de vida da criação de uma nova tarefa.
 *
 * Este hook fornece as seguintes funcionalidades:
 * - Gerencia o estado de loading, erro e sucesso da mutação.
 * - Exibe toasts de sucesso ou erro usando `react-toastify`.
 * - Invalida a query do projeto após o sucesso, garantindo que a lista de tarefas seja atualizada automaticamente.
 *
 * @returns {object} O objeto retornado por `useMutation`, incluindo `mutate`, `isPending`, `isError`, etc.
 */
export const useAddTask = () => {
	// Obtém o cliente do React Query para interagir com o cache.
	const queryClient = useQueryClient();

	return useMutation({
		/**
		 * A função que será executada quando a mutação for chamada.
		 * @param {CreateTaskInput} taskData - Os dados da nova tarefa.
		 */
		mutationFn: addTask,
		/**
		 * Callback executado em caso de sucesso da mutação.
		 * @param {object} newTask - Os dados da nova tarefa retornada pela função de mutação.
		 */
		onSuccess: (newTask) => {
			// Exibe uma notificação de sucesso.
			toast.success("Tarefa adicionada com sucesso!", {
				autoClose: 3000,
				theme: "dark",
			});

			// Invalida a query do projeto para recarregar as tarefas.
			// A chave da query é ["project", projectId].
			// Isso força o React Query a fazer um novo fetch dos dados.
			queryClient.invalidateQueries({
				queryKey: ["project", newTask?.projectId],
			});
		},
		/**
		 * Callback executado em caso de erro da mutação.
		 * @param {Error} error - O objeto de erro capturado.
		 */
		onError: (error) => {
			// Exibe uma notificação de erro com a mensagem da exceção.
			toast.error(error.message || "Ocorreu um erro!", {
				autoClose: 3000,
				theme: "dark",
			});
		},
	});
};
