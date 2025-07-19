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

	return (
		<div className="sticky top-24 space-y-6 border p-4 rounded-lg bg-card text-card-foreground shadow-sm">
			{selectedItem?.type === "task" && (
				<TaskDetailsPanel
					task={selectedItem as any}
					onClose={clearSelection}
					onTaskDeleted={clearSelection} // Limpa a seleção após deletar
					onUpdateStatus={updateSelectedTaskStatus}
				/>
			)}

			{selectedItem?.type === "comment" && (
				<CommentDetailsPanel
					comment={selectedItem as any}
					onClose={clearSelection}
					onCommentDeleted={clearSelection}
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
