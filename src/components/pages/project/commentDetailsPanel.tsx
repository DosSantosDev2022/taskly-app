// src/app/projects/[id]/_components/CommentDetailsPanel.tsx
"use client";

import { deleteComment } from "@/actions/comment/deleteComment";
import { ConfirmationDialog } from "@/components/global";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	Button,
	TooltipTrigger,
	TooltipContent,
	Tooltip,
} from "@/components/ui";
import { Trash, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

interface CommentDetail {
	id: string;
	content: string;
}

interface CommentDetailsPanelProps {
	comment: CommentDetail;
	onClose: () => void;
	onCommentDeleted: () => void;
}

export function CommentDetailsPanel({
	comment,
	onClose,
	onCommentDeleted,
}: CommentDetailsPanelProps) {
	const [isDeleting, startDeleteTransition] = useTransition();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	// Lógica para deletar o comentário
	const handleInitiateDelete = () => {
		setShowConfirmDialog(true);
	};

	const handleConfirmDelete = async () => {
		setShowConfirmDialog(false);
		startDeleteTransition(async () => {
			// Importe deleteTask, se não estiver importado
			const result = await deleteComment(comment.id);

			if (result.success) {
				toast.success("Comentário deletada com sucesso!", {
					autoClose: 3000,
					theme: "dark",
				});
				onCommentDeleted(); // Notifica o componente pai para limpar a seleção
			} else {
				console.error("Erro ao deletar comentário:", result.errors);
				toast.error(result.message || "Erro ao deletar tarefa!", {
					autoClose: 3000,
					theme: "dark",
				});
			}
		});
	};

	const handleCancelDelete = () => {
		setShowConfirmDialog(false);
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="w-full">Detalhes do Comentário</CardTitle>
				<div className="flex items-center justify-end gap-2 w-full p-1">
					<Tooltip>
						<TooltipTrigger asChild>
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
						<TooltipTrigger asChild>
							<Button
								variant={"outline"}
								onClick={onClose}
								className="rounded-full w-7 h-7 p-1 hover:scale-95"
							>
								<X className="h-3 w-3" />
								<span className="sr-only">Fechar</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>Fechar</TooltipContent>
					</Tooltip>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<p className="font-bold mb-1">Conteúdo:</p>
					<p className="text-muted-foreground">{comment.content}</p>
				</div>
			</CardContent>

			<ConfirmationDialog
				isOpen={showConfirmDialog}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				title="Deletar Comentário"
				description="Tem certeza que deseja deletar este comentário? Esta ação não pode ser desfeita e o comentário será removida permanentemente."
				confirmText="Sim, Deletar"
			/>
		</Card>
	);
}
