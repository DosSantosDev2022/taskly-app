// src/components/pages/project-table.tsx
"use client";

import { useState, useTransition, type JSX } from "react";
import Link from "next/link";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Trash2, Eye } from "lucide-react"; // Usaremos Eye para "ver detalhes"
import { ConfirmationDialog } from "@/components/global"; // Assumindo que você tem um componente de diálogo
// import { EditProjectForm } from "./forms/editProjectForm"; // Se você tiver um modal de edição de projeto
import { deleteProject } from "@/actions/project/deleteProject"; // Assumindo que você terá uma Server Action de exclusão
import { toast } from "react-toastify"; // Para notificações

// Importa o tipo Project do Prisma Client
import type { Project, ProjectStatus } from "@prisma/client";

import type { ProjectForClient } from "@/actions/project/getProject";
import { formatDate, getStatusLabelProject } from "@/utils";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

interface ProjectTableProps {
	projects: ProjectForClient[];
}

const ProjectTable = ({ projects }: ProjectTableProps): JSX.Element => {
	// --- Estados Locais e Transições ---
	const [isDeleting, startDeleteTransition] = useTransition();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	// const [showEditModal, setShowEditModal] = useState(false); // Descomente se tiver modal de edição

	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
		null,
	);
	const [selectedProjectName, setSelectedProjectName] = useState<string | null>(
		null,
	);
	// const [projectToEdit, setProjectToEdit] = useState<Project | null>(null); // Descomente se tiver modal de edição

	// --- Handlers de Ações ---

	const handleInitiateDelete = (projectId: string, projectName: string) => {
		setSelectedProjectId(projectId);
		setSelectedProjectName(projectName);
		setShowConfirmDialog(true);
	};

	const handleConfirmDelete = async () => {
		if (!selectedProjectId) {
			toast.error("Nenhum projeto selecionado para exclusão.", {
				autoClose: 3000,
				theme: "dark",
			});
			setShowConfirmDialog(false);
			return;
		}

		setShowConfirmDialog(false);
		startDeleteTransition(async () => {
			const formData = new FormData();
			formData.append("projectId", selectedProjectId);

			const result = await deleteProject(formData); // Chame sua Server Action de exclusão de projeto

			if (result.success) {
				toast.success(
					`Projeto "${selectedProjectName}" deletado com sucesso!`,
					{ autoClose: 3000, theme: "dark" },
				);
				setSelectedProjectId(null);
				setSelectedProjectName(null);
				// O Next.js deve revalidar o cache e buscar a lista atualizada automaticamente
				// se a sua Server Action de delete usar `revalidatePath` ou `revalidateTag`.
			} else {
				console.error("Erro ao deletar projeto:", result.errors);
				toast.error(result.message || "Erro ao deletar projeto!", {
					autoClose: 3000,
					theme: "dark",
				});
			}
		});
	};

	const handleCancelDelete = () => {
		setShowConfirmDialog(false);
	};

	// Descomente se tiver modal de edição de projeto
	// const handleInitiateEdit = (project: Project) => {
	//   setProjectToEdit(project);
	//   setShowEditModal(true);
	// };

	// const handleCloseEditModal = () => {
	//   setShowEditModal(false);
	//   setProjectToEdit(null);
	// };

	const getStatusVariant = (status: ProjectStatus) => {
		switch (status) {
			case "COMPLETED":
				return "default";
			case "IN_PROGRESS":
				return "secondary";
			case "PENDING":
				return "destructive";
			default:
				return "secondary";
		}
	};

	return (
		<div className="rounded-md border overflow-x-auto max-h-[600px] scrollbar-custom ">
			<Table className="min-w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="min-w-[150px]">Nome</TableHead>
						<TableHead className="min-w-[100px]">Tipo</TableHead>
						<TableHead className="min-w-[180px]">Descrição</TableHead>
						<TableHead className="text-center min-w-[100px]">Status</TableHead>
						<TableHead className="min-w-[120px]">Criação</TableHead>
						<TableHead className="min-w-[120px]">Prazo</TableHead>
						<TableHead className="text-center w-[120px]">Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{projects.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={7}
								className="h-24 text-center text-muted-foreground"
							>
								Nenhum projeto encontrado.
							</TableCell>
						</TableRow>
					) : (
						projects.map((project) => (
							<TableRow key={project.id}>
								<TableCell className="font-medium">{project.name}</TableCell>
								<TableCell>{capitalizeFirstLetter(project.type)}</TableCell>
								<TableCell className="text-sm text-muted-foreground line-clamp-1 truncate max-w-[240px]">
									{project.description || "N/A"}
								</TableCell>
								<TableCell className="text-center">
									<Badge variant={getStatusVariant(project.status)}>
										{getStatusLabelProject(project.status)}
									</Badge>
								</TableCell>
								<TableCell className="whitespace-nowrap">
									{formatDate(project.createdAt)}
								</TableCell>
								<TableCell className="whitespace-nowrap">
									{project.deadlineDate
										? formatDate(project.deadlineDate)
										: "N/A"}
								</TableCell>
								<TableCell className="text-center flex justify-center items-center h-full gap-2">
									{/* Botão de Ver Detalhes */}
									<Tooltip>
										<TooltipTrigger asChild>
											<Button variant="ghost" size="icon" asChild>
												<Link
													href={`/projects/project/${project.id}`}
													aria-label={`Ver detalhes de ${project.name}`}
												>
													<Eye className="h-4 w-4" />
												</Link>
											</Button>
										</TooltipTrigger>
										<TooltipContent>Ver Detalhes</TooltipContent>
									</Tooltip>
									{/* Botão de Excluir */}
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												aria-label={`Deletar projeto ${project.name}`}
												onClick={() =>
													handleInitiateDelete(project.id, project.name)
												}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Deletar</TooltipContent>
									</Tooltip>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			{/* Diálogo de confirmação para exclusão */}
			<ConfirmationDialog
				isOpen={showConfirmDialog}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				title="Deletar Projeto"
				description={
					selectedProjectName
						? `Tem certeza que deseja deletar o projeto "${selectedProjectName}"? Esta ação não pode ser desfeita e o projeto será removido permanentemente.`
						: "Tem certeza que deseja deletar este projeto? Esta ação não pode ser desfeita e o projeto será removido permanentemente."
				}
				confirmText="Sim, Deletar"
				cancelText="Não, Cancelar"
			/>
		</div>
	);
};

export { ProjectTable };
