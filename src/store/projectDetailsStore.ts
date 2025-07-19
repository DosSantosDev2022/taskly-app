// src/store/projectDetailsStore.ts
import { create } from "zustand";
import type { Task, Comment } from "@prisma/client"; // Importe os tipos do Prisma

// Helper para formatar o status da tarefa (já existente, mantido para consistência)
const formatStatus = (status: Task["status"]) => {
	switch (status) {
		case "PENDING":
			return "Pendente";
		case "IN_PROGRESS":
			return "Em Andamento";
		case "COMPLETED":
			return "Concluída";
		default:
			return status; // Retorna o status original se for desconhecido
	}
};

// Helper para converter o status formatado de volta para o formato Prisma (NOVO)
const unformatStatus = (
	formattedStatus: string,
): Task["status"] | undefined => {
	switch (formattedStatus) {
		case "Pendente":
			return "PENDING";
		case "Em Andamento":
			return "IN_PROGRESS";
		case "Concluída":
			return "COMPLETED";
		default:
			return undefined; // Retorna undefined ou joga um erro para status desconhecido
	}
};

// Tipos para o estado do store
// Garanta que o projectId está incluído se for uma tarefa
export type SelectedItem = {
	type: "task" | "comment";
	id: string;
	title?: string; // Para tasks
	status?: string; // Para tasks (será o status FORMATADO)
	description?: string | null; // Para tasks
	projectId?: string;
	content?: string; // Para comments
};

interface ProjectDetailsState {
	selectedItem: SelectedItem | null;
	selectedTask: SelectedItem | null;
	selectedComment: SelectedItem | null;

	setSelectedItem: (item: SelectedItem | null) => void;
	selectTask: (task: Task) => void;
	selectComment: (comment: Comment) => void;
	clearSelection: () => void;
	// --- NOVA AÇÃO ---
	updateSelectedTaskStatus: (newPrismaStatus: Task["status"]) => void;
}

export const useProjectDetailsStore = create<ProjectDetailsState>(
	(set, get) => ({
		selectedItem: null,
		selectedTask: null, // Pode ser removido se não for usado diretamente, simplificando
		selectedComment: null, // Pode ser removido se não for usado diretamente, simplificando

		setSelectedItem: (item) => set({ selectedItem: item }),

		selectTask: (task) =>
			set({
				selectedItem: {
					type: "task",
					id: task.id,
					title: task.title,
					status: formatStatus(task.status),
					description: task.description,
					projectId: task.projectId,
				},
				selectedTask: {
					type: "task",
					id: task.id,
					title: task.title,
					status: formatStatus(task.status),
					description: task.description,
					projectId: task.projectId,
				},
				selectedComment: null,
			}),

		selectComment: (comment) =>
			set({
				selectedItem: {
					type: "comment",
					id: comment.id,
					content: comment.content,
				},
				selectedComment: {
					type: "comment",
					id: comment.id,
					content: comment.content,
				},
				selectedTask: null,
			}),

		clearSelection: () =>
			set({ selectedItem: null, selectedTask: null, selectedComment: null }),

		updateSelectedTaskStatus: (newPrismaStatus) => {
			set((state) => {
				// Verifica se há um selectedItem e se ele é uma task
				if (state.selectedItem && state.selectedItem.type === "task") {
					// Converte o novo status do Prisma para o formato que o UI espera
					const newFormattedStatus = formatStatus(newPrismaStatus);

					return {
						selectedItem: {
							...state.selectedItem,
							status: newFormattedStatus, // Atualiza o status formatado
						},
						selectedTask: state.selectedTask
							? {
									...state.selectedTask,
									status: newFormattedStatus,
								}
							: null,
					};
				}
				return state;
			});
		},
	}),
);
