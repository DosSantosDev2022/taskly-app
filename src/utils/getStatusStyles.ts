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
