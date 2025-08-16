// --- Hook Customizado para a Lógica do Comentário ---

import { CommentDetail, useProjectDetailsStore } from "@/store";
import { useState } from "react";
import { useDeleteComment } from "./use-delete-comment";

/**
 * Hook personalizado para gerenciar o estado e a lógica de um painel de detalhes de comentário.
 * Ele lida com as operações de exclusão e edição, incluindo a exibição de modais e diálogos de confirmação.
 *
 * @param {CommentDetail} comment - O objeto de detalhes do comentário selecionado.
 * @returns {object} - Um objeto contendo estados e funções de manipulação para o componente.
 * @property {boolean} showConfirmDialog - Estado que controla a visibilidade do diálogo de confirmação de exclusão.
 * @property {boolean} showEditModal - Estado que controla a visibilidade do modal de edição.
 * @property {boolean} isDeleting - Indica se a operação de exclusão está em andamento.
 * @property {Function} handleInitiateDelete - Função para iniciar o processo de exclusão (mostra o diálogo).
 * @property {Function} handleConfirmDelete - Função para confirmar a exclusão e executar a mutação.
 * @property {Function} handleCancelDelete - Função para cancelar a exclusão (esconde o diálogo).
 * @property {Function} handleOpenEditModal - Função para abrir o modal de edição.
 * @property {Function} handleCloseEditModal - Função para fechar o modal de edição.
 * @property {Function} handleCommentContentUpdated - Função para atualizar o conteúdo do comentário no estado global e fechar o modal.
 * @property {Function} clearSelection - Função para limpar a seleção do comentário no estado global.
 */
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
