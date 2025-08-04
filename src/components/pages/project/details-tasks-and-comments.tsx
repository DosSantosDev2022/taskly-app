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
				/>
			)}

			{/* Renderiza CommentDetailsPanel se o item selecionado for um comentário */}
			{selectedItem?.type === "comment" && (
				<CommentDetailsPanel
					// Faz um type assertion explícito para CommentDetail.
					comment={selectedItem as CommentDetail}
					onClose={clearSelection}
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
