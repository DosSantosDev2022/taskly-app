// src/hooks/use-project-query.ts
"use client";

import type { ProjectDetails } from "@/@types/project-types";
import { useProjectStore } from "@/store/use-project-store";
import { useQuery } from "@tanstack/react-query";

/**
 * @interface ProjectsApiResponse
 * @property {ProjectDetails[]} projects - Array de detalhes dos projetos.
 * @property {number} totalProjects - Número total de projetos.
 * @property {number} currentPage - A página atual.
 * @property {number} pageSize - O tamanho da página.
 */
export interface ProjectsApiResponse {
	projects: ProjectDetails[];
	totalProjects: number;
	currentPage: number;
	pageSize: number;
}

interface GetProjectsFilters {
	page?: number;
	pageSize?: number;
	type?: string;
	status?: string;
}

const fetchProjects = async ({
	page = 1,
	pageSize = 10,
	type,
	status,
}: GetProjectsFilters) => {
	// Constrói a URL com os parâmetros de busca
	const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`);
	if (page) url.searchParams.append("page", page.toString());
	if (pageSize) url.searchParams.append("pageSize", pageSize.toString());
	if (type) url.searchParams.append("type", type);
	if (status) url.searchParams.append("status", status);

	const response = await fetch(url.toString(), {
		// Usar a tag do Next.js para controle de cache
		next: { tags: ["projects"] },
	});

	if (!response.ok) {
		throw new Error("Erro ao buscar projetos");
	}

	return response.json();
};

/**
 * Hook personalizado para buscar a lista de projetos.
 * Utiliza o `useQuery` do TanStack Query para gerenciar o estado da requisição e caching.
 * A busca é re-executada automaticamente quando os filtros (tipo, status, página, tamanho da página) mudam.
 *
 * @returns {object} - O objeto de resultado da query, contendo dados, estado de carregamento, erros, etc.
 */
export const useProjectsQuery = () => {
	const { type, status, page, pageSize } = useProjectStore();

	return useQuery<ProjectsApiResponse>({
		// A chave da query agora depende de todos os filtros
		queryKey: ["projects", { type, status, page, pageSize }],
		queryFn: async () => {
			return await fetchProjects({ page, pageSize, type, status });
		},
		refetchOnWindowFocus: true,
		staleTime: 1000 * 60 * 30, // Dados "frescos" por 30 minutos
	});
};
