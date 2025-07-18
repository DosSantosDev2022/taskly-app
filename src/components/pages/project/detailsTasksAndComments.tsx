// src/app/projects/[id]/_components/DetailsTasksAndComments.tsx
"use client";

import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	Button,
} from "@/components/ui";
import { X } from "lucide-react";
import { useProjectDetailsStore } from "@/store";

export function DetailsTasksAndComments() {
	// Lê o estado do store
	const selectedItem = useProjectDetailsStore((state) => state.selectedItem);
	const clearSelection = useProjectDetailsStore(
		(state) => state.clearSelection,
	);

	return (
		<div className="sticky top-24 space-y-6 border p-4 rounded-lg bg-card text-card-foreground shadow-sm">
			{selectedItem?.type === "task" && (
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Detalhes da Tarefa</CardTitle>
						<Button
							onClick={clearSelection} // Usa a ação do store para limpar
							className="p-1 rounded-full hover:scale-95"
						>
							<X className="h-3 w-3" />
						</Button>
					</CardHeader>
					<CardContent className="space-y-4">
						<h3 className="text-xl font-semibold">{selectedItem.title}</h3>
						<p>
							<span className="font-bold">Status: </span>
							{selectedItem.status}
						</p>
						<div>
							<p className="font-bold mb-1">Descrição:</p>
							<p className="text-muted-foreground">
								{selectedItem.description || "Nenhuma descrição."}
							</p>
						</div>
					</CardContent>
				</Card>
			)}

			{selectedItem?.type === "comment" && (
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Detalhes do Comentário</CardTitle>
						<Button
							onClick={clearSelection} // Usa a ação do store para limpar
							className="p-1 rounded-full hover:scale-95"
						>
							<X className="h-3 w-3" />
						</Button>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="font-bold mb-1">Conteúdo:</p>
							<p className="text-muted-foreground">{selectedItem.content}</p>
						</div>
					</CardContent>
				</Card>
			)}

			{!selectedItem && ( // Condição para exibir a mensagem inicial
				<Card>
					<CardContent className="py-8 text-center text-muted-foreground">
						Clique em uma tarefa ou comentário para ver os detalhes.
					</CardContent>
				</Card>
			)}
		</div>
	);
}
