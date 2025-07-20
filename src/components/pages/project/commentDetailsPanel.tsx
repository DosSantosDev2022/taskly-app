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
import { formatDate } from "@/utils";
import type { Comment } from "@prisma/client";
import { Edit, Trash, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { EditCommentForm } from "./editCommentForm";

interface CommentDetailsPanelProps {
	comment: Comment;
	onClose: () => void;
	onCommentDeleted: () => void;
	onCommentEdited: () => void;
}

export function CommentDetailsPanel({
	comment,
	onClose,
	onCommentDeleted,
	onCommentEdited,
}: CommentDetailsPanelProps) {
	const [isDeleting, startDeleteTransition] = useTransition();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

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

	const handleOpenEditModal = () => {
		setShowEditModal(true);
	};

	const handleCloseEditModal = () => {
		setShowEditModal(false);
	};

	const handleCommentEdited = () => {
		onCommentEdited();
		handleCloseEditModal();
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="w-full">Detalhes do Comentário</CardTitle>
				<div className="flex items-center justify-end gap-2 w-full p-1">
					{/* Botão editar */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="rounded-full w-7 h-7 p-1 hover:scale-95"
								onClick={handleOpenEditModal}
								variant={"secondary"} // Ou outra variante que você prefira
							>
								<Edit className="h-4 w-4" /> {/* Ícone de edição */}
							</Button>
						</TooltipTrigger>
						<TooltipContent>Editar</TooltipContent>
					</Tooltip>
					{/* botão excluir */}
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
					{/* botão fechar */}
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
					<span className="font-bold mb-1">
						Comentado em:
						<span className="ml-1 text-sm font-normal text-muted-foreground">{`${formatDate(comment.createdAt)}`}</span>
					</span>
				</div>
				<div>
					<span className="font-bold mb-1">Conteúdo:</span>
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

			{showEditModal && (
				<EditCommentForm
					comment={comment}
					isOpen={showEditModal}
					onClose={handleCloseEditModal}
					onCommentEdited={onCommentEdited}
				/>
			)}
		</Card>
	);
}
