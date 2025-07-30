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
import { EditCommentForm } from "@/components/pages/project";
import { useProjectDetailsStore } from "@/store";

// --- Tipagem das Props ---
/**
 * @interface CommentDetailsPanelProps
 * @description Propriedades esperadas pelo componente CommentDetailsPanel.
 */
interface CommentDetailsPanelProps {
	comment: Comment; // O objeto de comentário completo vindo do Prisma
	onClose: () => void; // Callback para fechar o painel de detalhes
}

/**
 * @component CommentDetailsPanel
 * @description Exibe os detalhes de um comentário, permitindo edição e exclusão.
 */
export function CommentDetailsPanel({
	comment,
	onClose,
}: CommentDetailsPanelProps) {
	// --- Estados Locais e Transições ---
	const [isDeleting, startDeleteTransition] = useTransition(); // Estado para gerenciar a transição de exclusão
	const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Estado para controlar a visibilidade do diálogo de confirmação
	const [showEditModal, setShowEditModal] = useState(false); // Estado para controlar a visibilidade do modal de edição

	const updateSelectedCommentContent = useProjectDetailsStore(
		(state) => state.updateSelectedCommentContent,
	);
	const clearSelection = useProjectDetailsStore(
		(state) => state.clearSelection,
	);

	// --- Handlers de Ações ---

	/**
	 * @function handleInitiateDelete
	 * @description Abre o diálogo de confirmação para deletar o comentário.
	 */
	const handleInitiateDelete = () => {
		setShowConfirmDialog(true);
	};

	/**
	 * @function handleConfirmDelete
	 * @description Executa a ação de deletar o comentário após a confirmação.
	 * Exibe toasts de sucesso/erro e aciona o callback de exclusão.
	 */
	const handleConfirmDelete = async () => {
		setShowConfirmDialog(false); // Fecha o diálogo de confirmação
		startDeleteTransition(async () => {
			const result = await deleteComment(comment.id); // Chama a Server Action de exclusão

			if (result.success) {
				toast.success("Comentário deletado com sucesso!", {
					autoClose: 3000,
					theme: "dark",
				});
				clearSelection(); // Aciona o callback para atualizar o estado pai (e.g., limpar seleção)
			} else {
				console.error("Erro ao deletar comentário:", result.errors);
				toast.error(result.message || "Erro ao deletar comentário!", {
					autoClose: 3000,
					theme: "dark",
				});
			}
		});
	};

	/**
	 * @function handleCancelDelete
	 * @description Cancela a operação de exclusão, fechando o diálogo de confirmação.
	 */
	const handleCancelDelete = () => {
		setShowConfirmDialog(false);
	};

	/**
	 * @function handleOpenEditModal
	 * @description Abre o modal de edição do comentário.
	 */
	const handleOpenEditModal = () => {
		setShowEditModal(true);
	};

	/**
	 * @function handleCloseEditModal
	 * @description Fecha o modal de edição do comentário.
	 */
	const handleCloseEditModal = () => {
		setShowEditModal(false);
	};

	/**
	 * @function handleCommentContentUpdated
	 * @description Callback acionado pelo EditCommentForm após a edição bem-sucedida.
	 * Passa o conteúdo atualizado para o componente pai e fecha o modal.
	 * @param {Object} updatedContent - Objeto com o novo conteúdo do comentário.
	 */
	const handleCommentContentUpdated = (updatedContent: { content: string }) => {
		updateSelectedCommentContent(updatedContent); // Notifica o componente pai sobre a atualização
		handleCloseEditModal(); // Fecha o modal de edição
	};

	// --- Renderização do Componente ---
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="w-full">Detalhes do Comentário</CardTitle>
				<div className="flex items-center justify-end gap-2 w-full p-1">
					{/* Botão para editar o comentário */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="rounded-full w-7 h-7 p-1 hover:scale-95"
								onClick={handleOpenEditModal}
								variant={"secondary"}
							>
								<Edit className="h-4 w-4" aria-label="Editar Comentário" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Editar</TooltipContent>
					</Tooltip>

					{/* Botão para excluir o comentário */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="rounded-full w-7 h-7 p-1 hover:scale-95"
								onClick={handleInitiateDelete}
								variant={"destructive"}
								disabled={isDeleting}
							>
								<Trash aria-label="Deletar Comentário" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Deletar</TooltipContent>
					</Tooltip>

					{/* Botão para fechar o painel de detalhes */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant={"outline"}
								onClick={onClose}
								className="rounded-full w-7 h-7 p-1 hover:scale-95"
							>
								<X className="h-3 w-3" aria-label="Fechar Painel" />
								<span className="sr-only">Fechar</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>Fechar</TooltipContent>
					</Tooltip>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Informações de data do comentário */}
				<div>
					<span className="font-bold mb-1">
						Comentado em:
						<span className="ml-1 text-sm font-normal text-muted-foreground">
							{`${formatDate(comment.createdAt)}`}
						</span>
					</span>
				</div>

				{/* Conteúdo do comentário com quebra de linha */}
				<div className="flex flex-col">
					{" "}
					{/* Use flex-col para o label e o parágrafo */}
					<span className="font-bold mb-1">Conteúdo:</span>
					<p className="text-muted-foreground break-words whitespace-pre-wrap">
						{comment.content}
					</p>
				</div>
			</CardContent>

			{/* Diálogo de confirmação para exclusão */}
			<ConfirmationDialog
				isOpen={showConfirmDialog}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				title="Deletar Comentário"
				description="Tem certeza que deseja deletar este comentário? Esta ação não pode ser desfeita e o comentário será removido permanentemente."
				confirmText="Sim, Deletar"
				cancelText="Não, Cancelar"
			/>

			{/* Modal de edição do comentário */}
			{showEditModal && (
				<EditCommentForm
					comment={comment}
					isOpen={showEditModal}
					onClose={handleCloseEditModal} // Importante passar o onClose aqui para o modal se fechar!
					onCommentEdited={handleCommentContentUpdated}
				/>
			)}
		</Card>
	);
}
