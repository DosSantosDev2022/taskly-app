import { ProjectStatus, type Task } from "@prisma/client";

function normalizeStatusString(statusString: string): string {
	// Converte para maiúsculas e substitui espaços por underscores
	return statusString.toUpperCase().replace(/\s/g, "_");
}

/**
 * @param status O status da tarefa (ex: "Pendente", "Em Andamento", "Concluída").
 * @returns Uma string contendo classes Tailwind CSS para cor de fundo e texto.
 */

export function getStatusStyles(status: string): string {
	const normalizedStatus = normalizeStatusString(status); // Normaliza o status

	switch (normalizedStatus) {
		case "PENDENTE":
			return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
		case "EM_ANDAMENTO":
			return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
		case "CONCLUÍDA":
			return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
		default:
			return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
	}
}

/**
 * @param status O status da tarefa (ex: "Pendente", "Em Andamento", "Concluída").
 * @returns Uma string com o texto amigável do status.
 */
export function getStatusLabel(status: string): string {
	const normalizedStatus = normalizeStatusString(status); // Normaliza o status

	switch (normalizedStatus) {
		case "PENDENTE":
			return "Pendente";
		case "EM_ANDAMENTO":
			return "Em Andamento";
		case "CONCLUÍDA":
			return "Concluída";
		default:
			return "Desconhecido";
	}
}

export const formatStatus = (status: Task["status"]) => {
	switch (status) {
		case "PENDING":
			return "PENDENTE";
		case "IN_PROGRESS":
			return "EM_ANDAMENTO";
		case "COMPLETED":
			return "CONCLUÍDA";
		default:
			return status;
	}
};

export function getStatusLabelProject(status: ProjectStatus): string {
	switch (
		status // Já recebendo ProjectStatus, então não precisa normalizar novamente
	) {
		case "PENDING":
			return "Pendente";
		case "IN_PROGRESS":
			return "Em Andamento";
		case "COMPLETED":
			return "Concluído";
		default:
			return "Desconhecido"; // Caso algum status novo seja adicionado no futuro e não mapeado
	}
}

export function getStatusProjectStyles(status: ProjectStatus): string {
	switch (
		status // Já recebendo ProjectStatus, então não precisa normalizar novamente
	) {
		case "PENDING":
			return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
		case "IN_PROGRESS":
			return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
		case "COMPLETED":
			return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
		default:
			return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
	}
}

export type ProjectStatusType =
	(typeof ProjectStatus)[keyof typeof ProjectStatus];

export const projectStatusArray: ProjectStatusType[] =
	Object.values(ProjectStatus);
