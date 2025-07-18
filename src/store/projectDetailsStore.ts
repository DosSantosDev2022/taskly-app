// src/store/projectDetailsStore.ts
import { create } from "zustand";
import type { Task, Comment } from "@prisma/client"; // Importe os tipos do Prisma

// Tipos para o estado do store
export type SelectedItem = {
	type: "task" | "comment";
	id: string;
	title?: string; // Para tasks
	status?: string; // Para tasks
	description?: string | null; // Para tasks
	content?: string; // Para comments
};

interface ProjectDetailsState {
	selectedItem: SelectedItem | null;
	setSelectedItem: (item: SelectedItem | null) => void;
	selectedTask: SelectedItem | null;
	selectedComment: SelectedItem | null;
	selectTask: (task: Task) => void;
	selectComment: (comment: Comment) => void;
	clearSelection: () => void;
}

// Helper para formatar o status da tarefa
const formatStatus = (status: Task["status"]) => {
	switch (status) {
		case "PENDING":
			return "Pendente";
		case "IN_PROGRESS":
			return "Em Andamento";
		case "COMPLETED":
			return "Concluída";
		default:
			return status;
	}
};

export const useProjectDetailsStore = create<ProjectDetailsState>((set) => ({
	selectedItem: null,
	selectedTask: null,
	selectedComment: null,

	setSelectedItem: (item) => set({ selectedItem: item }),

	selectTask: (task) =>
		set({
			selectedItem: {
				type: "task",
				id: task.id,
				title: task.title,
				status: formatStatus(task.status),
				description: task.description,
			},
			selectedTask: {
				// Mantenha um estado separado para fácil acesso se preferir
				type: "task",
				id: task.id,
				title: task.title,
				status: formatStatus(task.status),
				description: task.description,
			},
			selectedComment: null, // Garante que apenas um tipo seja selecionado por vez
		}),

	selectComment: (comment) =>
		set({
			selectedItem: {
				type: "comment",
				id: comment.id,
				content: comment.content,
			},
			selectedComment: {
				// Mantenha um estado separado para fácil acesso se preferir
				type: "comment",
				id: comment.id,
				content: comment.content,
			},
			selectedTask: null, // Garante que apenas um tipo seja selecionado por vez
		}),

	clearSelection: () =>
		set({ selectedItem: null, selectedTask: null, selectedComment: null }),
}));
