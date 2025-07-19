// src/app/projects/[id]/_components/DetailsTasksAndComments.tsx
"use client";

import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	Button,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui";
import { X, Trash } from "lucide-react";
import { useProjectDetailsStore } from "@/store";
import { deleteTask } from "@/actions/task/deleteTask";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { ConfirmationDialog } from "@/components/global";

export function DetailsTasksAndComments() {
	const [isDeleting, startTransition] = useTransition();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	// Lê o estado do store
	const selectedItem = useProjectDetailsStore((state) => state.selectedItem);
	const clearSelection = useProjectDetailsStore(
		(state) => state.clearSelection,
	);

	const taskId = selectedItem?.id;

	// Função chamada quando o botão de Lixeira é clicado
	const handleInitiateDelete = () => {
		setShowConfirmDialog(true); // Abre o modal de confirmação
	};

	const handleConfirmDelete = () => {
		setShowConfirmDialog(false); // Fecha o modal
		if (!taskId) {
			toast.error("Não foi possível obter o ID da tarefa para deletar", {
				autoClose: 3000,
				theme: "dark",
			});
			return;
		}
		// Inicia a transição para deletar
		startTransition(async () => {
			const result = await deleteTask(taskId || "");

			if (result.success) {
				toast.success("Tarefa deletada com sucesso!", {
					autoClose: 3000,
					theme: "dark",
				});
				clearSelection();
				// Não é preciso fazer nada com o formulário aqui, pois a revalidação vai atualizar a lista.
			} else {
				console.error("Erro ao deletar tarefa:", result.errors);
				toast.error("Erro ao deletar tarefa!", {
					autoClose: 3000,
					theme: "dark",
				});
			}
		});
	};

	// Função chamada quando o usuário cancela a exclusão no modal
	const handleCancelDelete = () => {
		setShowConfirmDialog(false); // Fecha o modal
	};

	return (
		<div className="sticky top-24 space-y-6 border p-4 rounded-lg bg-card text-card-foreground shadow-sm">
			{selectedItem?.type === "task" && (
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="w-full">Detalhes da Tarefa</CardTitle>
						<div className="flex items-center justify-end gap-2 w-full p-1 border">
							<Tooltip>
								<TooltipTrigger>
									<Button
										className="rounded-full w-7 h-7 p-1 hover:scale-95"
										onClick={handleInitiateDelete}
										variant={"destructive"}
										disabled={isDeleting}
									>
										<Trash />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Deletar</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger>
									<Button
										variant={"ghost"}
										onClick={clearSelection} // Usa a ação do store para limpar
										className="rounded-full w-7 h-7 p-1 hover:scale-95"
									>
										<X />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Fechar</TooltipContent>
							</Tooltip>
						</div>
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

			<ConfirmationDialog
				isOpen={showConfirmDialog}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				title="Deletar Tarefa"
				description="Tem certeza que deseja deletar esta tarefa? Esta ação não pode ser desfeita e a tarefa será removida permanentemente."
				confirmText="Sim, Deletar"
				cancelText="Não, Cancelar"
			/>
		</div>
	);
}
