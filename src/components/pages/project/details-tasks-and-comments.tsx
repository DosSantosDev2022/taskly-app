"use client";

import {
	CommentDetailsPanel,
	TaskDetailsPanel,
} from "@/components/pages/project";
import { Card, CardContent } from "@/components/ui";
import {
	type CommentDetail,
	type TaskDetail,
	useProjectDetailsStore,
} from "@/store";

export function DetailsTasksAndComments() {
	// --- Extração de estados e ações do store Zustand ---
	// Seleciona o item atualmente ativo (tarefa ou comentário) no store.
	const selectedItem = useProjectDetailsStore((state) => state.selectedItem);

	// --- Renderização Condicional do Painel de Detalhes ---
	return (
		<div className="sticky top-24 space-y-6 border p-4 rounded-lg bg-card text-card-foreground shadow-sm">
			{/* Renderiza TaskDetailsPanel se o item selecionado for uma tarefa */}
			{selectedItem?.type === "task" && (
				<TaskDetailsPanel task={selectedItem as TaskDetail} />
			)}

			{/* Renderiza CommentDetailsPanel se o item selecionado for um comentário */}
			{selectedItem?.type === "comment" && (
				<CommentDetailsPanel comment={selectedItem as CommentDetail} />
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
