// src/app/projects/[id]/_components/TaskDetailsPanel.tsx
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
import { Trash, ClipboardList } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { ConfirmationDialog } from "@/components/global";
import { getStatusLabel, getStatusStyles } from "@/utils"; // Supondo que essas utils já lidam com o ProjectStatus
import { toggleTaskStatus } from "@/actions/task/toggleTaskStatus"; // Sua Server Action para status da tarefa
import type { ProjectStatus } from "@prisma/client";

// Definindo os tipos para a tarefa, conforme o que vem do seu store
interface TaskDetail {
	id: string;
	projectId: string;
	title: string;
	description: string | null;
	status: "Pendente" | "Em Andamento" | "Concluída"; // Status como string amigável do store
	// Adicione outras propriedades da tarefa se existirem (ex: deadline, assignedTo, etc.)
}

interface TaskDetailsPanelProps {
	task: TaskDetail;
	onClose: () => void;
	onTaskDeleted: () => void; // Callback para notificar o pai que a tarefa foi deletada
	onUpdateStatus: (newPrismaStatus: ProjectStatus) => void;
}

export function TaskDetailsPanel({
	task,
	onClose,
	onTaskDeleted,
	onUpdateStatus,
}: TaskDetailsPanelProps) {
	const [isDeleting, startDeleteTransition] = useTransition();
	const [isUpdatingStatus, startStatusUpdateTransition] = useTransition();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	// Lógica para alternar o status da tarefa
	const handleStatusClick = () => {
		if (!task.id || !task.status || !task.projectId) {
			toast.error("Dados insuficientes para atualizar o status da tarefa.", {
				autoClose: 3000,
				theme: "dark",
			});
			return;
		}

		// Convertendo o status amigável de volta para o formato ENUM do Prisma
		let currentPrismaStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
		switch (task.status) {
			case "Pendente":
				currentPrismaStatus = "PENDING";
				break;
			case "Em Andamento":
				currentPrismaStatus = "IN_PROGRESS";
				break;
			case "Concluída":
				currentPrismaStatus = "COMPLETED";
				break;
			default:
				toast.error("Status da tarefa não reconhecido para atualização.", {
					autoClose: 3000,
					theme: "dark",
				});
				return;
		}

		// Preparar FormData para passar para a Server Action
		const formData = new FormData();
		formData.append("taskId", task.id);
		formData.append("currentStatus", currentPrismaStatus);
		formData.append("projectId", task.projectId);

		startStatusUpdateTransition(async () => {
			const result = await toggleTaskStatus(formData);

			if (result.success) {
				toast.success("Status atualizado!", { autoClose: 3000, theme: "dark" });
				if (result.updatedTask?.status) {
					onUpdateStatus(result.updatedTask.status); // Passe o status NOVO, já no formato Prisma ENUM
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

	// Lógica para deletar a tarefa
	const handleInitiateDelete = () => {
		setShowConfirmDialog(true);
	};

	const handleConfirmDelete = async () => {
		setShowConfirmDialog(false);
		startDeleteTransition(async () => {
			// Importe deleteTask, se não estiver importado
			const { deleteTask } = await import("@/actions/task/deleteTask"); // Importe dinamicamente se quiser otimizar
			const result = await deleteTask(task.id);

			if (result.success) {
				toast.success("Tarefa deletada com sucesso!", {
					autoClose: 3000,
					theme: "dark",
				});
				onTaskDeleted(); // Notifica o componente pai para limpar a seleção
			} else {
				console.error("Erro ao deletar tarefa:", result.errors);
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
				<CardTitle className="w-full">Detalhes da Tarefa</CardTitle>
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
								onClick={onClose} // Usa o callback do pai para fechar
								className="rounded-full w-7 h-7 p-1 hover:scale-95"
							>
								<X className="h-3 w-3" />
								<span className="sr-only">Fechar</span> {/* Acessibilidade */}
							</Button>
						</TooltipTrigger>
						<TooltipContent>Fechar</TooltipContent>
					</Tooltip>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<h3 className="text-base font-semibold flex items-center gap-1">
					<ClipboardList />
					{task.title}
				</h3>
				<div className="space-x-1">
					<span className="font-bold text-sm">Status: </span>
					{task.status && (
						<span
							className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer
                ${getStatusStyles(task.status)}
                ${isUpdatingStatus ? "opacity-50 pointer-events-none" : ""}
              `}
							onClick={handleStatusClick}
						>
							{isUpdatingStatus
								? "Atualizando..."
								: getStatusLabel(task.status)}
						</span>
					)}
				</div>
				<div className="">
					<p className="font-bold mb-1 text-sm">Descrição:</p>
					<p className="text-muted-foreground">
						{task.description || "Nenhuma descrição."}
					</p>
				</div>
			</CardContent>

			<ConfirmationDialog
				isOpen={showConfirmDialog}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				title="Deletar Tarefa"
				description="Tem certeza que deseja deletar esta tarefa? Esta ação não pode ser desfeita e a tarefa será removida permanentemente."
				confirmText="Sim, Deletar"
				cancelText="Não, Cancelar"
			/>
		</Card>
	);
}
