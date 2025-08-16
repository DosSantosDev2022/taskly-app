import type { Task } from "@prisma/client";

/**
 * Calcula o progresso de um conjunto de tarefas com base no número de tarefas concluídas.
 *
 * @param {Task[]} [tasks=[]] - Um array de objetos de tarefa. Se não for fornecido ou estiver vazio, o progresso é 0.
 * @returns {number} O progresso total em porcentagem (0-100), arredondado para o número inteiro mais próximo.
 */
export function getTaskProgress(tasks: Task[] = []): number {
	if (!tasks || tasks.length === 0) return 0;

	const total = tasks.length;
	const completed = tasks.filter((task) => task.status === "COMPLETED").length;

	return Math.round((completed / total) * 100);
}
