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
import { Trash, ClipboardList, Edit, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { ConfirmationDialog } from "@/components/global";
import { getStatusLabel, getStatusStyles } from "@/utils";
import { toggleTaskStatus } from "@/actions/task/toggleTaskStatus";
import { deleteTask } from "@/actions/task/deleteTask";
import type { ProjectStatus as PrismaProjectStatus } from "@prisma/client";
import { EditTaskModal } from "@/components/pages";

// --- Tipagens ---
/**
 * @interface TaskDetail
 * @description Define a estrutura detalhada de uma tarefa conforme é consumida pelo componente.
 * Corresponde ao tipo 'TaskDetail' definido no store.
 */
interface TaskDetail {
	id: string;
	projectId: string;
	title: string;
	description: string | null;
	status: "Pendente" | "Em Andamento" | "Concluída"; // Status já formatado do store
	// Adicione outras propriedades da tarefa se existirem e forem necessárias aqui.
}

/**
 * @interface TaskDetailsPanelProps
 * @description Propriedades esperadas pelo componente TaskDetailsPanel.
 */
interface TaskDetailsPanelProps {
	task: TaskDetail; // Os detalhes da tarefa a serem exibidos/gerenciados
	onClose: () => void; // Callback para fechar o painel de detalhes
	onTaskDeleted: () => void; // Callback acionado após a exclusão bem-sucedida da tarefa
	onUpdateStatus: (newPrismaStatus: PrismaProjectStatus) => void; // Callback acionado após a atualização do status
	onTaskUpdated: (updatedTaskDetails: {
		title: string;
		description: string | null;
	}) => void; // Callback acionado após a edição dos detalhes da tarefa
}

/**
 * @component TaskDetailsPanel
 * @description Componente que exibe os detalhes de uma tarefa, incluindo status,
 * descrição e botões para editar ou deletar a tarefa.
 */
export function TaskDetailsPanel({
	task,
	onClose,
	onTaskDeleted,
	onUpdateStatus,
	onTaskUpdated,
}: TaskDetailsPanelProps) {
	// --- Estados Locais e Transições ---
	const [isDeleting, startDeleteTransition] = useTransition(); // Para gerenciar o estado de deleção
	const [isUpdatingStatus, startStatusUpdateTransition] = useTransition(); // Para gerenciar o estado de atualização de status
	const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Controla a visibilidade do diálogo de confirmação
	const [showEditModal, setShowEditModal] = useState(false); // Controla a visibilidade do modal de edição

	// --- Helpers Internos ---
	/**
	 * @function convertFriendlyStatusToPrisma
	 * @description Converte o status amigável (UI) de volta para o formato ENUM do Prisma.
	 * @param {"Pendente" | "Em Andamento" | "Concluída"} friendlyStatus - Status da tarefa no formato amigável.
	 * @returns {PrismaProjectStatus | null} O status no formato Prisma, ou null se não for reconhecido.
	 */
	const convertFriendlyStatusToPrisma = (
		friendlyStatus: "Pendente" | "Em Andamento" | "Concluída",
	): PrismaProjectStatus | null => {
		switch (friendlyStatus) {
			case "Pendente":
				return "PENDING";
			case "Em Andamento":
				return "IN_PROGRESS";
			case "Concluída":
				return "COMPLETED";
			default:
				// Caso um status inesperado, retorna null ou lança um erro, dependendo da necessidade de tratamento
				return null;
		}
	};

	// --- Handlers de Ações ---

	/**
	 * @function handleStatusClick
	 * @description Lida com o clique no status da tarefa para alterná-lo.
	 * Converte o status, chama a Server Action e atualiza o store via callback.
	 */
	const handleStatusClick = () => {
		// Validação inicial dos dados da tarefa
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

		// Cria FormData para a Server Action
		const formData = new FormData();
		formData.append("taskId", task.id);
		formData.append("currentStatus", currentPrismaStatus);
		formData.append("projectId", task.projectId);

		// Inicia a transição de atualização de status
		startStatusUpdateTransition(async () => {
			const result = await toggleTaskStatus(formData);

			if (result.success) {
				toast.success("Status atualizado!", { autoClose: 3000, theme: "dark" });
				// Se a atualização foi bem-sucedida e o novo status está disponível
				if (result.updatedTask?.status) {
					onUpdateStatus(result.updatedTask.status); // Notifica o componente pai/store
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

	/**
	 * @function handleInitiateDelete
	 * @description Abre o diálogo de confirmação para deletar a tarefa.
	 */
	const handleInitiateDelete = () => {
		setShowConfirmDialog(true);
	};

	/**
	 * @function handleConfirmDelete
	 * @description Executa a ação de deletar a tarefa após a confirmação.
	 * Exibe toasts de sucesso/erro e aciona o callback de exclusão.
	 */
	const handleConfirmDelete = async () => {
		setShowConfirmDialog(false); // Fecha o diálogo de confirmação
		startDeleteTransition(async () => {
			const result = await deleteTask(task.id); // Chama a Server Action de exclusão

			if (result.success) {
				toast.success("Tarefa deletada com sucesso!", {
					autoClose: 3000,
					theme: "dark",
				});
				onTaskDeleted(); // Aciona o callback para atualizar o estado pai (e.g., limpar seleção)
			} else {
				console.error("Erro ao deletar tarefa:", result.errors);
				toast.error(result.message || "Erro ao deletar tarefa!", {
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
	 * @description Abre o modal de edição da tarefa.
	 */
	const handleOpenEditModal = () => {
		setShowEditModal(true);
	};

	/**
	 * @function handleCloseEditModal
	 * @description Fecha o modal de edição da tarefa.
	 */
	const handleCloseEditModal = () => {
		setShowEditModal(false);
	};

	/**
	 * @function handleTaskEdited
	 * @description Callback acionado pelo EditTaskModal após a edição bem-sucedida.
	 * Passa os detalhes atualizados para o componente pai e fecha o modal.
	 * @param {Object} updatedDetails - Objeto com o novo título e descrição da tarefa.
	 */
	const handleTaskEdited = (updatedDetails: {
		title: string;
		description: string | null;
	}) => {
		onTaskUpdated(updatedDetails); // Notifica o componente pai sobre a atualização
		handleCloseEditModal(); // Fecha o modal de edição
	};

	// --- Renderização do Componente ---
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="w-full">Detalhes da Tarefa</CardTitle>
				<div className="flex items-center justify-end gap-2 w-full p-1">
					{/* Botão para editar a tarefa */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="rounded-full w-7 h-7 p-1 hover:scale-95"
								onClick={handleOpenEditModal}
								variant={"secondary"}
							>
								<Edit className="h-4 w-4" aria-label="Editar Tarefa" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Editar</TooltipContent>
					</Tooltip>

					{/* Botão para excluir a tarefa */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="rounded-full w-7 h-7 p-1 hover:scale-95"
								onClick={handleInitiateDelete}
								variant={"destructive"}
								disabled={isDeleting}
							>
								<Trash aria-label="Deletar Tarefa" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Deletar</TooltipContent>
					</Tooltip>

					{/* Botão para fechar o painel */}
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
				{/* Título da Tarefa */}
				<h3 className="text-base font-semibold flex items-center gap-1">
					<ClipboardList className="h-5 w-5 text-primary" />
					{task.title}
				</h3>

				{/* Status da Tarefa */}
				<div className="space-x-1">
					<span className="font-bold text-sm">Status: </span>
					{task.status && (
						// biome-ignore lint/a11y/useFocusableInteractive: <explanation>
						// biome-ignore lint/a11y/useSemanticElements: <explanation>
						<span
							className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200 ease-in-out
                ${getStatusStyles(task.status)}
                ${isUpdatingStatus ? "opacity-50 pointer-events-none" : ""}
              `}
							onClick={handleStatusClick}
							role="button" // Indica que o span é interativo
							aria-live="polite" // Anuncia mudanças para leitores de tela
							aria-label={`Mudar status da tarefa para ${
								task.status === "Pendente"
									? "Em Andamento"
									: task.status === "Em Andamento"
										? "Concluída"
										: "Pendente"
							}`}
						>
							{isUpdatingStatus
								? "Atualizando..."
								: getStatusLabel(task.status)}
						</span>
					)}
				</div>

				{/* Descrição da Tarefa */}
				<div className="flex flex-col">
					{" "}
					{/* Use flex-col para o label e o parágrafo */}
					<p className="font-bold mb-1 text-sm">Descrição:</p>
					<p className="text-muted-foreground break-words whitespace-pre-wrap">
						{task.description || "Nenhuma descrição."}
					</p>
				</div>
			</CardContent>

			{/* Diálogo de Confirmação de Exclusão */}
			<ConfirmationDialog
				isOpen={showConfirmDialog}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				title="Deletar Tarefa"
				description="Tem certeza que deseja deletar esta tarefa? Esta ação não pode ser desfeita e a tarefa será removida permanentemente."
				confirmText="Sim, Deletar"
				cancelText="Não, Cancelar"
			/>

			{/* Modal de Edição da Tarefa */}
			{showEditModal && (
				<EditTaskModal
					isOpen={showEditModal}
					onClose={handleCloseEditModal}
					task={task}
					onTaskUpdated={handleTaskEdited}
				/>
			)}
		</Card>
	);
}
