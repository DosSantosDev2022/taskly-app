import Link from "next/link";
import { ProjectCard, ProjectFilters } from "@/components/pages";
import { Button } from "@/components/ui";
import { getProjects } from "@/services/project";
import { Plus } from "lucide-react";
import type { ProjectStatusType } from "@/utils";
import type { ProjectType } from "@prisma/client";
import { PaginationComponent } from "@/components/global";

// Define os tipos para os parâmetros de busca esperados
interface ProjectsPageProps {
	searchParams: {
		type?: ProjectType;
		status?: ProjectStatusType;
		page?: string;
		pageSize?: string;
	};
}

export default async function ProjectsPage({
	searchParams,
}: ProjectsPageProps) {
	// Extrai os parâmetros de busca da URL
	const { type, status } = searchParams;

	const currentPage = Number(searchParams?.page) || 1;
	const pageSize = Number(searchParams?.pageSize) || 5;
	/* 	const searchQuery = searchParams?.query || ""; */

	const { projects, totalProjects } = await getProjects({
		type,
		status,
		page: currentPage,
		pageSize,
	});

	// Calcula o número total de páginas
	const totalPages = Math.ceil(totalProjects / pageSize);

	return (
		<div className="container mx-auto mt-20 p-4">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
				{/* Coluna Principal: Lista de Projetos */}
				<div className="md:col-span-8">
					<div className="flex items-center justify-between w-full  mb-6">
						<h2 className="text-2xl font-bold tracking-tight">Meus projetos</h2>
						<Button variant={"secondary"} asChild>
							<Link href={"/projects/project/creation"}>
								Novo projeto
								<Plus />
							</Link>
						</Button>
					</div>

					{/* Grid para os cards de projetos */}

					<div className="grid grid-cols-1  gap-6">
						{/* Usamos .map() para percorrer os dados e criar um card para cada projeto */}
						{projects.map((project) => (
							<ProjectCard key={project.id} project={project} />
						))}

						{/* Componente de Paginação */}
						{totalProjects > pageSize && ( // Só mostra a paginação se houver mais clientes que o tamanho da página
							<div className="flex items-center justify-between mt-4">
								<span className="text-sm text-muted-foreground">
									Total de projetos: {totalProjects}
								</span>
								<PaginationComponent
									currentPage={currentPage}
									totalPages={totalPages}
									pageSize={pageSize}
								/>
							</div>
						)}
					</div>
				</div>

				{/* Coluna Lateral: Filtros */}
				<ProjectFilters />
			</div>
		</div>
	);
}
