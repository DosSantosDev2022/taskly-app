import Link from "next/link";
import type { JSX } from "react";
import { z } from "zod"; // Importação do Zod

import { ProjectType, ProjectStatus } from "@prisma/client";
import { ProjectTable, ProjectFilters } from "@/components/pages";
import { PaginationComponent } from "@/components/global";
import { getProjects } from "@/actions/project/getProject";
import { AddProjectForm } from "@/components/pages/project/forms/addProjectForm";
import { AddProjectModal } from "@/components/pages/project/addProjectModal";

/**
 * @typedef {object} ProjectsPageProps
 * @property {object} searchParams - Parâmetros de busca da URL.
 * @property {string} [searchParams.type] - Tipo de projeto para filtragem.
 * @property {string} [searchParams.status] - Status do projeto para filtragem.
 * @property {string} [searchParams.page] - Número da página atual.
 * @property {string} [searchParams.pageSize] - Tamanho da página (quantidade de itens por página).
 */
interface ProjectsPageProps {
	searchParams: {
		type?: string;
		status?: string;
		page?: string;
		pageSize?: string;
	};
}

// 1. Definição dos Schemas Zod
const projectTypeSchema = z.enum(ProjectType);
const projectStatusTypeSchema = z.enum(ProjectStatus);

// Esquema de validação para os searchParams
const searchParamsSchema = z
	.object({
		type: projectTypeSchema.optional(),
		status: projectStatusTypeSchema.optional(),
		page: z
			.string()
			.optional()
			.default("1")
			.transform(Number)
			.pipe(z.number().min(1, "A página deve ser no mínimo 1.")),
		pageSize: z
			.string()
			.optional()
			.default("10")
			.transform(Number)
			.pipe(z.number().min(1, "O tamanho da página deve ser no mínimo 1.")),
	})
	.partial(); // Permite que todos os campos sejam opcionais na entrada inicial

/**
 * Componente principal da página de listagem de projetos.
 * Exibe uma lista de projetos, filtros e paginação.
 * @param {ProjectsPageProps} props - As propriedades da página, incluindo os parâmetros de busca.
 * @returns {Promise<JSX.Element>} Um elemento JSX que representa a página de projetos.
 */
export default async function ProjectsPage({
	searchParams,
}: ProjectsPageProps): Promise<JSX.Element> {
	// Validação dos parâmetros de busca com Zod
	const validationResult = searchParamsSchema.safeParse(searchParams);

	if (!validationResult.success) {
		console.error(
			"Erro de validação dos parâmetros de busca:",
			z.treeifyError(validationResult.error),
		);
		return (
			<div className="container mx-auto mt-20 p-4 text-center">
				<h1 className="text-3xl font-bold text-destructive">
					Erro nos parâmetros da URL!
				</h1>
				<p className="text-lg text-background mt-4">
					Por favor, verifique os filtros e tente novamente.
				</p>
				{process.env.NODE_ENV === "development" && (
					<pre className="mt-4 p-4 bg-gray-100 rounded-md text-left overflow-auto">
						{JSON.stringify(z.treeifyError(validationResult.error), null, 2)}
					</pre>
				)}
				<Link
					href="/projects"
					className="mt-6 inline-block bg-secondary hover:bg-secondary/50 text-foreground font-bold py-2 px-4 rounded-md transition-colors"
				>
					Voltar para Projetos
				</Link>
			</div>
		);
	}

	const {
		type,
		status,
		page: currentPage,
		pageSize,
	} = validationResult.data as {
		type?: ProjectType;
		status?: ProjectStatus;
		page: number;
		pageSize: number;
	};

	const { projects, totalProjects } = await getProjects({
		type,
		status,
		page: currentPage,
		pageSize,
	});

	const totalPages = Math.ceil(totalProjects / pageSize);

	return (
		<div className="container mx-auto mt-20 p-4" role="main">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
				<section className="md:col-span-12" aria-labelledby="projects-heading">
					<div className="flex flex-col sm:flex-row items-center justify-between w-full mb-6 gap-4">
						<h1
							id="projects-heading"
							className="text-2xl font-bold tracking-tight"
						>
							Meus Projetos
						</h1>
						<div className="flex items-center gap-2">
							<ProjectFilters />
							<AddProjectModal />
						</div>
					</div>

					<div className="grid grid-cols-1 gap-6">
						{projects.length === 0 ? (
							<div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
								<p className="text-lg font-medium">
									Nenhum projeto encontrado.
								</p>
								<p className="mt-2 text-sm">
									Ajuste seus filtros ou crie um novo projeto para começar!
								</p>
							</div>
						) : (
							<ProjectTable projects={projects} />
						)}

						{totalProjects > 0 && (
							<div
								className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4"
								aria-live="polite"
							>
								<span
									className="text-sm text-muted-foreground"
									aria-atomic="true"
								>
									Total de projetos:{" "}
									<span className="font-semibold">{totalProjects}</span>
								</span>
								<PaginationComponent
									currentPage={currentPage}
									totalPages={totalPages}
									pageSize={pageSize}
								/>
							</div>
						)}
					</div>
				</section>
			</div>
		</div>
	);
}
