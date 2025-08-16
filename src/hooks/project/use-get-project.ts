// src/hooks/use-project-query.ts
"use client";

import type { ProjectDetails } from "@/@types/project-types";
import { getProjects } from "@/actions/project";
import { useProjectStore } from "@/store/use-project-store";
import { useQuery } from "@tanstack/react-query";

export interface ProjectsApiResponse {
	projects: ProjectDetails[];
	totalProjects: number;
	currentPage: number;
	pageSize: number;
}

export const useProjectsQuery = () => {
	const { type, status, page, pageSize } = useProjectStore();

	return useQuery<ProjectsApiResponse>({
		// A chave da query agora depende de todos os filtros
		queryKey: ["projects", { type, status, page, pageSize }],
		queryFn: async () => {
			return await getProjects({ page, pageSize, type, status });
		},
		refetchOnWindowFocus: true,
		// Adicione esta opção para evitar a re-busca no primeiro carregamento
		staleTime: 1000 * 60, // Dados considerados "frescos" por 1 minuto
	});
};
