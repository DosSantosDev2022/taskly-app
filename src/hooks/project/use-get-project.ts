// src/hooks/use-project-query.ts
"use client";

import type { ProjectDetails } from "@/@types/project-types";
import { getProjects } from "@/actions/project";
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
			return await getProjects({ page, pageSize, type, status });
		},
		refetchOnWindowFocus: true,
		staleTime: 1000 * 60 * 30, // Dados "frescos" por 30 minutos
	});
};
