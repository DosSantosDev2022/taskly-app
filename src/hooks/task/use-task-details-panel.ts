import { ProjectStatus } from "@prisma/client";
// --- Hook Customizado para a Lógica da Tarefa ---

import { toggleTaskStatus } from "@/actions/task";
import { TaskDetail, useProjectDetailsStore } from "@/store";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { useDeleteTask } from "./use-delete-task";

// Este hook encapsula toda a lógica de estado e os handlers de evento.
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

	// Helper para converter o status.
	const convertFriendlyStatusToPrisma = (
		friendlyStatus: "Pendente" | "Em Andamento" | "Concluída",
	): ProjectStatus | null => {
		switch (friendlyStatus) {
			case "Pendente":
				return "PENDING";
			case "Em Andamento":
				return "IN_PROGRESS";
			case "Concluída":
				return "COMPLETED";
			default:
				return null;
		}
	};

	// Handler para a mudança de status.
	const handleStatusClick = () => {
		if (!task.id || !task.projectId) {
			toast.error("Dados insuficientes para atualizar o status da tarefa.", {
				autoClose: 3000,
				theme: "dark",
			});
			return;
		}
		const currentPrismaStatus = convertFriendlyStatusToPrisma(task.status);
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
		convertFriendlyStatusToPrisma,
		clearSelection,
	};
}
