"use client";
import { deleteProject } from "@/actions/project/deleteProject";
import { ConfirmationDialog } from "@/components/global";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui";
import type { ProjectForClient } from "@/actions/project/getProject";
import { formatDate } from "@/utils";
import { FolderKanban, Trash, View } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

export const ProjectCard = ({ project }: { project: ProjectForClient }) => {
	const [isDeleting, startDeleteTransition] = useTransition();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Controla a visibilidade do diálogo de confirmação

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
			const result = await deleteProject(project.id); // Chama a Server Action de exclusão

			if (result.success) {
				toast.success("Projeto deletado com sucesso!", {
					autoClose: 3000,
					theme: "dark",
				});
			} else {
				console.error("Erro ao deletar projetoa:", result.errors);
				toast.error(result.message || "Erro ao deletar projeto!", {
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

	return (
		<>
			<Card className="flex flex-col h-full">
				<CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
					<div className="flex items-center gap-2">
						<div className="p-1.5 bg-muted rounded-md ml-auto">
							<FolderKanban className="h-5 w-5" />
						</div>
						<CardTitle>{project.name}</CardTitle>
					</div>
					{/* Ações */}
					<div className="flex items-center">
						{/* Ver detalhes */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button size={"icon"} variant={"ghost"}>
									<Link href={`/projects/project/${project.id}`}>
										<View />
									</Link>
								</Button>
							</TooltipTrigger>
							<TooltipContent>Ver mais</TooltipContent>
						</Tooltip>

						{/* Excluir projeto */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									onClick={handleInitiateDelete}
									size={"icon"}
									variant={"ghost"}
								>
									<Trash />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Excluír</TooltipContent>
						</Tooltip>
					</div>
				</CardHeader>
				<CardContent className="flex-grow space-y-2.5">
					<p className="text-sm text-muted-foreground">
						Tipo:{" "}
						<span className="font-medium text-foreground">{project.type}</span>
					</p>
					<div>
						<CardDescription className="line-clamp-4">
							{project.description}
						</CardDescription>
					</div>
				</CardContent>
				<CardFooter className="justify-start gap-4">
					<span className="font-medium text-foreground">
						Data de criação:
						<span className="text-muted-foreground ml-1">
							{formatDate(project.createdAt)}
						</span>
					</span>

					<span className="font-medium text-foreground">
						Data de prazo:
						<span className="text-muted-foreground ml-1">
							{formatDate(project.deadlineDate || "")}
						</span>
					</span>
				</CardFooter>
			</Card>

			{/* Diálogo de Confirmação de Exclusão */}
			<ConfirmationDialog
				isOpen={showConfirmDialog}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				title="Deletar Projeto"
				description="Tem certeza que deseja deletar este projeto? Esta ação não pode ser desfeita e o projeto será removido permanentemente."
				confirmText="Sim, Deletar"
				cancelText="Não, Cancelar"
			/>
		</>
	);
};
