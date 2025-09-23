import type { Comment, Task, TaskStatus } from "@prisma/client";
import { create } from "zustand";

// --- Tipagens do Estado ---
/**
 * @interface TaskDetail
 * @description Define a estrutura detalhada de uma tarefa para o estado do store.
 */
export interface TaskDetail {
	type: "task";
	id: string;
	title: string;
	status: TaskStatus; // Status já formatado
	description: string | null;
	projectId: string;
}

/**
 * @interface CommentDetail
 * @description Define a estrutura detalhada de um comentário para o estado do store.
 */
export interface CommentDetail {
	type: "comment";
	id: string;
	projectId: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	content: string;
}

/**
 * @type SelectedItem
 * @description Tipo union para representar o item atualmente selecionado (tarefa ou comentário).
 */
export type SelectedItem = TaskDetail | CommentDetail;

/**
 * @interface ProjectDetailsState
 * @description Define a estrutura completa do estado e das ações do store.
 */
interface ProjectDetailsState {
	// O item selecionado no painel de detalhes (tarefa ou comentário)
	selectedItem: SelectedItem | null;

	// --- Ações do Store ---
	/**
	 * @method setSelectedItem
	 * @description Define o item atualmente selecionado no store.
	 * @param {SelectedItem | null} item - O item a ser selecionado, ou null para limpar.
	 */
	setSelectedItem: (item: SelectedItem | null) => void;

	/**
	 * @method selectTask
	 * @description Define uma tarefa como o item selecionado, formatando seus dados.
	 * @param {Task} task - O objeto da tarefa vindo do Prisma.
	 */
	selectTask: (task: Task) => void;

	/**
	 * @method selectComment
	 * @description Define um comentário como o item selecionado, formatando seus dados.
	 * @param {Comment} comment - O objeto do comentário vindo do Prisma.
	 */
	selectComment: (comment: Comment) => void;

	/**
	 * @method clearSelection
	 * @description Limpa qualquer item selecionado.
	 */
	clearSelection: () => void;

	/**
	 * @method updateSelectedTaskStatus
	 * @description Atualiza o status da tarefa selecionada.
	 * @param {Task["status"]} newPrismaStatus - O novo status da tarefa no formato Prisma ENUM.
	 */
	updateSelectedTaskStatus: (newPrismaStatus: Task["status"]) => void;

	/**
	 * @method updateSelectedTaskDetails
	 * @description Atualiza o título e a descrição da tarefa selecionada.
	 * @param {Object} updatedTask - Objeto com o novo título e descrição.
	 * @param {string} updatedTask.title - Novo título da tarefa.
	 * @param {string | null} updatedTask.description - Nova descrição da tarefa.
	 */
	updateSelectedTaskDetails: (updatedTask: {
		title: string;
		description: string | null;
	}) => void;

	/**
	 * @method updateSelectedCommentContent
	 * @description Atualiza o conteúdo do comentário selecionado.
	 * @param {Object} updatedContent - Objeto com o novo conteúdo.
	 * @param {string} updatedContent.content - Novo conteúdo do comentário.
	 */
	updateSelectedCommentContent: (updatedContent: { content: string }) => void;
}

// --- Criação do Store Zustand ---
export const useProjectDetailsStore = create<ProjectDetailsState>((set) => ({
	// --- Estado Inicial ---
	selectedItem: null,

	// --- Implementação das Ações ---
	setSelectedItem: (item) => set({ selectedItem: item }),

	selectTask: (task) =>
		set({
			// Define o item principal selecionado como uma tarefa
			selectedItem: {
				type: "task",
				id: task.id,
				title: task.title,
				status: task.status, // Formata o status para a UI
				description: task.description,
				projectId: task.projectId,
			},
		}),

	selectComment: (comment) =>
		set({
			// Define o item principal selecionado como um comentário
			selectedItem: {
				type: "comment",
				id: comment.id,
				projectId: comment.projectId,
				createdAt: comment.createdAt, // Mantém como Date para corresponder ao tipo
				updatedAt: comment.updatedAt,
				userId: comment.userId,
				content: comment.content,
			},
		}),

	clearSelection: () => set({ selectedItem: null }),

	updateSelectedTaskStatus: (newPrismaStatus) => {
		set((state) => {
			// Verifica se o item selecionado é uma tarefa antes de atualizar
			if (state.selectedItem?.type === "task") {
				const newFormattedStatus = newPrismaStatus; // Formata o novo status

				return {
					selectedItem: {
						...state.selectedItem,
						status: newFormattedStatus, // Atualiza o status no item principal
					},
				};
			}
			return state; // Retorna o estado inalterado se não for uma tarefa
		});
	},

	updateSelectedTaskDetails: (updatedDetails) =>
		set((state) => {
			// Verifica se o item selecionado é uma tarefa antes de atualizar
			if (state.selectedItem?.type === "task") {
				return {
					selectedItem: {
						...state.selectedItem,
						title: updatedDetails.title,
						description: updatedDetails.description,
					},
				};
			}
			return state; // Retorna o estado inalterado se não for uma tarefa
		}),

	updateSelectedCommentContent: (updatedContent) =>
		set((state) => {
			// Verifica se o item selecionado é um comentário antes de atualizar
			if (state.selectedItem?.type === "comment") {
				return {
					selectedItem: {
						...state.selectedItem,
						content: updatedContent.content, // Atualiza o conteúdo no item principal
					},
				};
			}
			return state; // Retorna o estado inalterado se não for um comentário
		}),
}));
