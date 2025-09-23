// src/utils/status-utils.ts (ou outro arquivo de utilitários)

import { ProjectStatus, TaskStatus } from "@prisma/client";

// Funções para STATUS DE TAREFAS
//---------------------------------------------------------

/**
 * Retorna o rótulo amigável para um status de tarefa.
 */
export function getTaskStatusLabel(status: TaskStatus): string {
	switch (status) {
		case "PENDING":
			return "Pendente";
		case "IN_PROGRESS":
			return "Em Andamento";
		case "COMPLETED":
			return "Concluída";
		default:
			return "Desconhecido";
	}
}

/**
 * Retorna a variante de estilo para um status de tarefa.
 */
export function getTaskStatusVariant(status: TaskStatus) {
	switch (status) {
		case "COMPLETED":
			return "success";
		case "IN_PROGRESS":
			return "warning";
		case "PENDING":
			return "danger";
		default:
			return "secondary";
	}
}

// Funções para STATUS DE PROJETOS
//---------------------------------------------------------

/**
 * Retorna o rótulo amigável para um status de projeto.
 */
export function getProjectStatusLabel(status: ProjectStatus): string {
	switch (status) {
		case "PENDING":
			return "Pendente";
		case "IN_PROGRESS":
			return "Em Andamento";
		case "COMPLETED":
			return "Concluído";
		default:
			return "Desconhecido";
	}
}

/**
 * Retorna a variante de estilo para um status de projeto.
 */
export function getProjectStatusVariant(status: ProjectStatus) {
	switch (status) {
		case "COMPLETED":
			return "success";
		case "IN_PROGRESS":
			return "warning";
		case "PENDING":
			return "danger";
		default:
			return "secondary";
	}
}
