"use client";

import { Card, CardContent } from "@/components/ui";
import {
	type CommentDetail,
	type TaskDetail,
	useProjectDetailsStore,
} from "@/store/projectDetailsStore";
import { TaskDetailsPanel } from "./taskDetailsPanel";
import { CommentDetailsPanel } from "./commentDetailsPanel";

/**
 * @component DetailsTasksAndComments
 * @description Componente principal que exibe os detalhes de uma tarefa ou comentário selecionado.
 * Gerencia o estado de seleção através do Zustand.
 */
export function DetailsTasksAndComments() {
	// --- Extração de estados e ações do store Zustand ---
	// Seleciona o item atualmente ativo (tarefa ou comentário) no store.
	const selectedItem = useProjectDetailsStore((state) => state.selectedItem);
	// Ação para limpar qualquer item selecionado.
	const clearSelection = useProjectDetailsStore(
		(state) => state.clearSelection,
	);
	// Ação para atualizar o status de uma tarefa selecionada.
	const updateSelectedTaskStatus = useProjectDetailsStore(
		(state) => state.updateSelectedTaskStatus,
	);
	// Ação para atualizar os detalhes (título, descrição) de uma tarefa selecionada.
	const updateSelectedTaskDetails = useProjectDetailsStore(
		(state) => state.updateSelectedTaskDetails,
	);
	// Ação para atualizar o conteúdo de um comentário selecionado.
	const updateSelectedCommentContent = useProjectDetailsStore(
		(state) => state.updateSelectedCommentContent,
	);

	// --- Handlers para callbacks dos componentes filhos ---

	/**
	 * @function handleTaskUpdated
	 * @description Lida com a atualização dos detalhes de uma tarefa.
	 * Chama a ação do store para refletir as mudanças na UI.
	 * @param {Object} updatedTaskDetails - Objeto contendo o novo título e descrição da tarefa.
	 */
	const handleTaskUpdated = (updatedTaskDetails: {
		title: string;
		description: string | null;
	}) => {
		updateSelectedTaskDetails(updatedTaskDetails);
	};

	/**
	 * @function handleCommentContentUpdated
	 * @description Lida com a atualização do conteúdo de um comentário.
	 * Chama a ação do store para refletir as mudanças na UI.
	 * @param {Object} updatedContent - Objeto contendo o novo conteúdo do comentário.
	 */
	const handleCommentContentUpdated = (updatedContent: { content: string }) => {
		updateSelectedCommentContent(updatedContent);
	};

	// --- Renderização Condicional do Painel de Detalhes ---
	return (
		<div className="sticky top-24 space-y-6 border p-4 rounded-lg bg-card text-card-foreground shadow-sm">
			{/* Renderiza TaskDetailsPanel se o item selecionado for uma tarefa */}
			{selectedItem?.type === "task" && (
				<TaskDetailsPanel
					// Faz um type assertion explícito para TaskDetail, garantindo que o tipo esteja correto.
					// Isso é seguro porque já verificamos selectedItem?.type === "task".
					task={selectedItem as TaskDetail}
					onClose={clearSelection}
					onTaskDeleted={clearSelection} // Limpa a seleção após deletar
					onUpdateStatus={updateSelectedTaskStatus}
					onTaskUpdated={handleTaskUpdated}
				/>
			)}

			{/* Renderiza CommentDetailsPanel se o item selecionado for um comentário */}
			{selectedItem?.type === "comment" && (
				<CommentDetailsPanel
					// Faz um type assertion explícito para CommentDetail.
					comment={selectedItem as CommentDetail}
					onClose={clearSelection}
					onCommentDeleted={clearSelection}
					onCommentEdited={handleCommentContentUpdated}
				/>
			)}

			{/* Exibe uma mensagem se nenhum item estiver selecionado */}
			{!selectedItem && (
				<Card>
					<CardContent className="py-8 text-center text-muted-foreground">
						Clique em uma tarefa ou comentário para ver os detalhes.
					</CardContent>
				</Card>
			)}
		</div>
	);
}
