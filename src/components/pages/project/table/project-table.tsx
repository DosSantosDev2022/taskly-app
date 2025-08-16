// src/components/pages/projects/ProjectTable.tsx
"use client";

import { ConfirmationDialog, PaginationComponent } from "@/components/global";
import {
	Badge,
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui";
import { useDeleteProjectMutation, useProjectsQuery } from "@/hooks/project";
import { useProjectStore } from "@/store/use-project-store";
import {
	capitalizeFirstLetter,
	formatDate,
	getStatusLabelProject,
} from "@/utils";
import { stripHtmlTags } from "@/utils/html-parser";
import type { ProjectStatus } from "@prisma/client";
import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, type JSX } from "react";
import { ProjectsTableSkeleton } from "./project-skeleton-table";

const ProjectTable = (): JSX.Element => {
	const { pageSize } = useProjectStore();
	// Hook customizado para buscar e gerenciar os dados
	const { data, isFetching, isLoading, isError, error } = useProjectsQuery();
	//  Hook customizado para deletar projeto com React Query
	const deleteMutation = useDeleteProjectMutation();
	// Acesso direto aos dados do hook
	const projects = data?.projects || [];
	const totalProjects = data?.totalProjects || 0;
	const totalPages = Math.ceil(totalProjects / pageSize);
	// Estado para controle do diálogo de confirmação
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	// Estado para armazenar o projeto selecionado para exclusão
	const [selectedProject, setSelectedProject] = useState<{
		id: string;
		name: string;
	} | null>(null);

	// Função para iniciar o processo de exclusão
	// Recebe o ID e o nome do projeto para exibir no diálogo de confirmação
	const handleInitiateDelete = (projectId: string, projectName: string) => {
		setSelectedProject({ id: projectId, name: projectName });
		setShowConfirmDialog(true);
	};

	// Função para confirmar a exclusão do projeto
	// Chama a mutação de exclusão e fecha o diálogo
	const handleConfirmDelete = async () => {
		if (!selectedProject) return;
		setShowConfirmDialog(false);
		await deleteMutation.mutateAsync(selectedProject.id);
	};

	// Função para cancelar a exclusão
	// Apenas fecha o diálogo e limpa o projeto selecionado
	const handleCancelDelete = () => {
		setShowConfirmDialog(false);
		setSelectedProject(null);
	};

	// Função para obter o rótulo do status do projeto
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

	if (isError) {
		return (
			<div className="text-center p-8 border border-dashed rounded-lg text-destructive">
				<p className="text-lg font-medium">Erro ao carregar os projetos.</p>
				<p className="mt-2 text-sm">
					Por favor, tente novamente mais tarde. Detalhes do erro:{" "}
					{error?.message}
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Container da tabela */}
			<div className="rounded-md border overflow-y-auto max-h-[600px] scrollbar-custom relative">
				<Table className="min-w-full">
					<TableHeader>
						<TableRow>
							<TableHead className="min-w-[150px]">Nome</TableHead>
							<TableHead className="min-w-[100px]">Tipo</TableHead>
							<TableHead className="min-w-[100px]">Cliente</TableHead>
							<TableHead className="min-w-[180px]">Descrição</TableHead>
							<TableHead className="text-center min-w-[100px]">
								Status
							</TableHead>
							<TableHead className="min-w-[80px]">Tarefas</TableHead>
							<TableHead className="min-w-[120px]">Criação</TableHead>
							<TableHead className="min-w-[120px]">Prazo</TableHead>
							<TableHead className="text-center w-[120px]">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading && isFetching ? (
							<ProjectsTableSkeleton />
						) : (
							projects.map((project) => (
								<TableRow key={project.id}>
									<TableCell className="font-medium">{project.name}</TableCell>
									<TableCell>{capitalizeFirstLetter(project.type)}</TableCell>
									<TableCell>{project.client?.name}</TableCell>
									<TableCell className="text-sm line-clamp-1 truncate max-w-[240px]">
										{project.description
											? stripHtmlTags(project.description)
											: "N/A"}
									</TableCell>
									<TableCell className="text-center">
										<Badge variant={getStatusVariant(project.status)}>
											{getStatusLabelProject(project.status)}
										</Badge>
									</TableCell>
									<TableCell>{project.tasks?.length}</TableCell>
									<TableCell className="whitespace-nowrap">
										{formatDate(project.createdAt)}
									</TableCell>
									<TableCell className="whitespace-nowrap">
										{project.deadlineDate
											? formatDate(project.deadlineDate)
											: "N/A"}
									</TableCell>
									<TableCell className="text-center flex justify-center items-center h-full gap-2">
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
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													disabled={deleteMutation.isPending}
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
			</div>

			{/* Seção da Paginação: */}
			{totalProjects > 0 && (
				<div
					className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4"
					aria-live="polite"
				>
					<span className="text-sm text-muted-foreground" aria-atomic="true">
						Total de projetos:{" "}
						<span className="font-semibold">{totalProjects}</span>
					</span>
					<PaginationComponent totalPages={totalPages} />
				</div>
			)}

			{/* Diálogo de confirmação para exclusão */}
			<ConfirmationDialog
				isOpen={showConfirmDialog}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				title="Deletar Projeto"
				description={
					selectedProject?.name
						? `Tem certeza que deseja deletar o projeto "${selectedProject.name}"? Esta ação não pode ser desfeita e o projeto será removido permanentemente.`
						: "Tem certeza que deseja deletar este projeto? Esta ação não pode ser desfeita e o projeto será removido permanentemente."
				}
				confirmText="Sim, Deletar"
				cancelText="Não, Cancelar"
			/>
		</div>
	);
};

export { ProjectTable };
