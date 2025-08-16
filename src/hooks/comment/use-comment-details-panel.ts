// --- Hook Customizado para a Lógica do Comentário ---

import { CommentDetail, useProjectDetailsStore } from "@/store";
import { useState } from "react";
import { useDeleteComment } from "./use-delete-comment";

// Este hook encapsula toda a lógica de estado e os handlers de evento.
export function useCommentDetailsPanel(comment: CommentDetail) {
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

	const updateSelectedCommentContent = useProjectDetailsStore(
		(state) => state.updateSelectedCommentContent,
	);
	const clearSelection = useProjectDetailsStore(
		(state) => state.clearSelection,
	);

	const { mutate, isPending: isDeleting } = useDeleteComment();

	// Handlers para o fluxo de exclusão.
	const handleInitiateDelete = () => setShowConfirmDialog(true);
	const handleConfirmDelete = () => {
		setShowConfirmDialog(false);
		mutate(comment.id, {
			onSuccess: () => {
				clearSelection();
			},
		});
	};
	const handleCancelDelete = () => setShowConfirmDialog(false);

	// Handlers para o fluxo de edição.
	const handleOpenEditModal = () => setShowEditModal(true);
	const handleCloseEditModal = () => setShowEditModal(false);
	const handleCommentContentUpdated = (updatedContent: { content: string }) => {
		updateSelectedCommentContent(updatedContent);
		handleCloseEditModal();
	};

	// Retorna todos os estados e handlers para o componente principal.
	return {
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
	};
}
