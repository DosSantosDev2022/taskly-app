"use client";

import { ConfirmationDialog } from "@/components/global";
import { TiptapContentRenderer } from "@/components/global/tipTap/tiptap-content-renderer";
import { EditTaskModal } from "@/components/pages/project";
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
import { useTaskDetailsPanel } from "@/hooks/task";
import { TaskDetail } from "@/store";
import { getStatusLabel, getStatusStyles } from "@/utils";
import type { ProjectStatus as PrismaProjectStatus } from "@prisma/client";
import { ClipboardList, Edit, Trash, X } from "lucide-react";

interface TaskDetailsPanelProps {
	task: TaskDetail;
}

export function TaskDetailsPanel({ task }: TaskDetailsPanelProps) {
	const {
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
	} = useTaskDetailsPanel(task); // Chama o hook customizado

	// --- Renderização do Componente ---
	return (
		<Card className="shadow-lg rounded-lg">
			<CardHeader className="flex flex-row items-center justify-between p-4 border-b">
				{/* Título e status do comentário */}
				<div className="flex-grow">
					<CardTitle className="flex items-center gap-2 text-xl font-bold">
						<ClipboardList className="h-6 w-6 text-primary" />
						Detalhes da Tarefa
					</CardTitle>
					<div className="flex items-center mt-2">
						<span className="font-bold text-sm mr-2">Status:</span>
						{task.status && (
							<span
								className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200 ease-in-out
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
								<Edit className="h-4 w-4" aria-label="Editar Tarefa" />
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
								<Trash className="h-4 w-4" aria-label="Deletar Tarefa" />
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

			<CardContent className="p-4 space-y-4">
				{/* Título da Tarefa aprimorado */}
				<div>
					<h3 className="text-base font-bold text-foreground">Título:</h3>
					<p className="text-muted-foreground mt-1">{task.title}</p>
				</div>

				{/* Descrição da Tarefa em destaque */}
				<div>
					<h3 className="text-base font-bold text-foreground">Descrição:</h3>
					<div className="bg-muted p-4 rounded-md mt-1">
						<TiptapContentRenderer content={task.description || ""} />
					</div>
				</div>
			</CardContent>

			{/* Diálogos e Modals */}
			<ConfirmationDialog
				isOpen={showConfirmDialog}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				title="Deletar Tarefa"
				description="Tem certeza que deseja deletar esta tarefa? Esta ação não pode ser desfeita e a tarefa será removida permanentemente."
				confirmText="Sim, Deletar"
				cancelText="Não, Cancelar"
			/>
			{showEditModal && (
				<EditTaskModal
					isOpen={showEditModal}
					onClose={handleCloseEditModal}
					task={{
						...task,
						status: convertFriendlyStatusToPrisma(
							task.status,
						) as PrismaProjectStatus,
					}}
					onTaskUpdated={handleTaskEdited}
				/>
			)}
		</Card>
	);
}
