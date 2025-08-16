"use client";

import { ConfirmationDialog } from "@/components/global";
import { EditCommentForm } from "@/components/pages/project";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui";
import { useCommentDetailsPanel } from "@/hooks/comment";
import { CommentDetail } from "@/store";
import { formatDate } from "@/utils";
import { Edit, Trash, X } from "lucide-react";

interface CommentDetailsPanelProps {
	comment: CommentDetail; // O objeto de comentário completo vindo do Prisma
}

export function CommentDetailsPanel({ comment }: CommentDetailsPanelProps) {
	const {
		showConfirmDialog,
		showEditModal,
		isDeleting,
		handleInitiateDelete,
		handleConfirmDelete,
		handleCancelDelete,
		handleOpenEditModal,
		handleCloseEditModal,
		handleCommentContentUpdated,
		clearSelection,
	} = useCommentDetailsPanel(comment);

	// --- Renderização do Componente ---
	return (
		<Card className="shadow-lg rounded-lg">
			<CardHeader className="flex flex-row items-start justify-between p-4 border-b">
				{/* Título e data do comentário */}
				<div className="flex flex-col">
					<CardTitle className="text-xl font-bold">
						Detalhes do Comentário
					</CardTitle>
					<span className="text-sm font-normal text-muted-foreground mt-1">
						Comentado em: {formatDate(comment.createdAt)}
					</span>
				</div>

				{/* Botões de ação, alinhados à direita */}
				<div className="flex items-center gap-2">
					{/* Botão para editar */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="rounded-full w-8 h-8 p-0"
								onClick={handleOpenEditModal}
								variant="secondary"
							>
								<Edit className="h-4 w-4" aria-label="Editar Comentário" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Editar</TooltipContent>
					</Tooltip>

					{/* Botão para deletar */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="rounded-full w-8 h-8 p-0"
								onClick={handleInitiateDelete}
								variant="destructive"
								disabled={isDeleting}
							>
								<Trash className="h-4 w-4" aria-label="Deletar Comentário" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Deletar</TooltipContent>
					</Tooltip>

					{/* Botão para fechar */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								onClick={clearSelection}
								className="rounded-full w-8 h-8 p-0"
							>
								<X className="h-4 w-4" aria-label="Fechar Painel" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Fechar</TooltipContent>
					</Tooltip>
				</div>
			</CardHeader>

			<CardContent className="p-4">
				<div className="bg-muted p-4 rounded-md overflow-y-auto max-h-96 scrollbar-custom">
					<p className="text-sm text-foreground break-words whitespace-pre-wrap">
						{comment.content}
					</p>
				</div>
			</CardContent>

			{/* Diálogos e Modals */}
			<ConfirmationDialog
				isOpen={showConfirmDialog}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				title="Deletar Comentário"
				description="Tem certeza que deseja deletar este comentário? Esta ação não pode ser desfeita e o comentário será removido permanentemente."
				confirmText="Sim, Deletar"
				cancelText="Não, Cancelar"
			/>
			{showEditModal && (
				<EditCommentForm
					comment={comment}
					isOpen={showEditModal}
					onClose={handleCloseEditModal}
					onCommentEdited={handleCommentContentUpdated}
				/>
			)}
		</Card>
	);
}
