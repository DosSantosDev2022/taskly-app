// --- Hook Customizado para a Lógica da Tarefa ---

import { toggleTaskStatus } from "@/actions/task";
import { TaskDetail, useProjectDetailsStore } from "@/store";
import { getTaskStatusLabel } from "@/utils";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { useDeleteTask } from "./use-delete-task";

/**
 * Hook personalizado para gerenciar o estado e a lógica de um painel de detalhes de tarefa.
 * Ele lida com as operações de atualização de status, exclusão e edição,
 * incluindo a exibição de modais e diálogos de confirmação.
 *
 * @param {TaskDetail} task - O objeto de detalhes da tarefa selecionada.
 * @returns {object} Um objeto contendo estados e funções de manipulação para o componente.
 * @property {boolean} isUpdatingStatus - Indica se a transição de atualização de status está pendente.
 * @property {boolean} showConfirmDialog - Controla a visibilidade do diálogo de confirmação de exclusão.
 * @property {boolean} showEditModal - Controla a visibilidade do modal de edição.
 * @property {boolean} isDeleting - Indica se a operação de exclusão está em andamento.
 * @property {Function} handleStatusClick - Manipulador para alternar o status da tarefa.
 * @property {Function} handleInitiateDelete - Inicia o processo de exclusão (mostra o diálogo).
 * @property {Function} handleConfirmDelete - Confirma a exclusão e executa a mutação.
 * @property {Function} handleCancelDelete - Cancela a exclusão (esconde o diálogo).
 * @property {Function} handleOpenEditModal - Abre o modal de edição.
 * @property {Function} handleCloseEditModal - Fecha o modal de edição.
 * @property {Function} handleTaskEdited - Atualiza os detalhes da tarefa no estado global e fecha o modal.
 * @property {Function} convertFriendlyStatusToPrisma - Helper para converter o status amigável para o formato do Prisma.
 * @property {Function} clearSelection - Limpa a seleção da tarefa no estado global.
 */
export function useTaskDetailsPanel(task: TaskDetail) {
	const [isUpdatingStatus, startStatusUpdateTransition] = useTransition();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

	const clearSelection = useProjectDetailsStore(
		(state) => state.clearSelection,
	);
	const updateSelectedTaskStatus = useProjectDetailsStore(
		(state) => state.updateSelectedTaskStatus,
	);
	const updateSelectedTaskDetails = useProjectDetailsStore(
		(state) => state.updateSelectedTaskDetails,
	);
	const { mutate: deleteTaskMutation, isPending: isDeleting } = useDeleteTask();

	// Handler para a mudança de status.
	const handleStatusClick = () => {
		if (!task.id || !task.projectId) {
			toast.error("Dados insuficientes para atualizar o status da tarefa.", {
				autoClose: 3000,
				theme: "dark",
			});
			return;
		}
		const currentPrismaStatus = getTaskStatusLabel(task.status);
		if (!currentPrismaStatus) {
			toast.error("Status da tarefa não reconhecido para atualização.", {
				autoClose: 3000,
				theme: "dark",
			});
			return;
		}

		const formData = new FormData();
		formData.append("taskId", task.id);
		formData.append("currentStatus", currentPrismaStatus);
		formData.append("projectId", task.projectId);

		startStatusUpdateTransition(async () => {
			const result = await toggleTaskStatus(formData);
			if (result.success) {
				toast.success("Status atualizado!", { autoClose: 3000, theme: "dark" });
				if (result.updatedTask?.status) {
					updateSelectedTaskStatus(result.updatedTask.status);
				}
			} else {
				console.error("Erro ao atualizar status:", result.errors);
				toast.error(result.message || "Erro ao atualizar status da tarefa.", {
					autoClose: 3000,
					theme: "dark",
				});
			}
		});
	};

	// Handlers para o fluxo de exclusão.
	const handleInitiateDelete = () => setShowConfirmDialog(true);
	const handleConfirmDelete = () => {
		setShowConfirmDialog(false);
		deleteTaskMutation(task.id, { onSuccess: () => clearSelection() });
	};
	const handleCancelDelete = () => setShowConfirmDialog(false);

	// Handlers para o fluxo de edição.
	const handleOpenEditModal = () => setShowEditModal(true);
	const handleCloseEditModal = () => setShowEditModal(false);
	const handleTaskEdited = (updatedDetails: {
		title: string;
		description: string | null;
	}) => {
		updateSelectedTaskDetails(updatedDetails);
		handleCloseEditModal();
	};

	// Retorna todos os estados e handlers para o componente principal.
	return {
		isUpdatingStatus,
		showConfirmDialog,
		showEditModal,
		isDeleting,
		handleStatusClick,
		handleInitiateDelete,
		handleConfirmDelete,
		handleCancelDelete,
		handleOpenEditModal,
		handleCloseEditModal,
		handleTaskEdited,
		clearSelection,
	};
}
