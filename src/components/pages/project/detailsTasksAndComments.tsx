"use client";
import { Card, CardContent } from "@/components/ui";
import { useProjectDetailsStore } from "@/store";
import { TaskDetailsPanel } from "./taskDetailsPanel";
import { CommentDetailsPanel } from "./commentDetailsPanel";

export function DetailsTasksAndComments() {
	const selectedItem = useProjectDetailsStore((state) => state.selectedItem);

	const clearSelection = useProjectDetailsStore(
		(state) => state.clearSelection,
	);
	const updateSelectedTaskStatus = useProjectDetailsStore(
		(state) => state.updateSelectedTaskStatus,
	);

	const updateSelectedTaskDetails = useProjectDetailsStore(
		(state) => state.updateSelectedTaskDetails,
	);

	const updateSelectedCommentContent = useProjectDetailsStore(
		(state) => state.updateSelectedCommentContent,
	);

	const handleTaskUpdated = (updatedTaskDetails: {
		title: string;
		description: string | null;
	}) => {
		// Chama a ação do Zustand para atualizar os detalhes da tarefa selecionada
		updateSelectedTaskDetails(updatedTaskDetails);
	};

	// Função para lidar com a atualização de conteúdo do comentário
	const handleCommentContentUpdated = (updatedContent: { content: string }) => {
		updateSelectedCommentContent(updatedContent);
	};

	return (
		<div className="sticky top-24 space-y-6 border p-4 rounded-lg bg-card text-card-foreground shadow-sm">
			{selectedItem?.type === "task" && (
				<TaskDetailsPanel
					task={selectedItem as any}
					onClose={clearSelection}
					onTaskDeleted={clearSelection} // Limpa a seleção após deletar
					onUpdateStatus={updateSelectedTaskStatus}
					onTaskUpdated={handleTaskUpdated}
				/>
			)}

			{selectedItem?.type === "comment" && (
				<CommentDetailsPanel
					comment={selectedItem as any}
					onClose={clearSelection}
					onCommentDeleted={clearSelection}
					onCommentEdited={handleCommentContentUpdated}
				/>
			)}

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
