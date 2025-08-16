// src/hooks/use-project-by-id-query.ts
"use client";

import type { ProjectDetails } from "@/@types/project-types";
import { getProjectById } from "@/actions/project";
import type { ProjectsApiResponse } from "@/hooks/project";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook personalizado para buscar detalhes de um único projeto pelo seu ID.
 * Utiliza o `useQuery` do TanStack Query para gerenciar o estado e caching.
 * O hook tenta primeiro encontrar o projeto no cache de "projects" antes de fazer uma nova requisição.
 *
 * @param {string} projectId - O ID do projeto a ser buscado.
 * @returns {object} - O objeto de resultado da query, contendo os dados do projeto, estado de carregamento, erros, etc.
 */
export const useProjectByIdQuery = (projectId: string) => {
	const queryClient = useQueryClient();

	return useQuery<ProjectDetails | null>({
		queryKey: ["project", projectId],
		queryFn: () => getProjectById(projectId),

		// O 'enabled' garante que a query só será executada se houver um 'projectId' válido.
		enabled: !!projectId,

		// Configura o cache inicial para evitar a re-busca de dados
		// Isso é útil quando você já tem uma lista de projetos carregada
		initialData: () => {
			// 1. Acessa o cache da query "projects" e tipa explicitamente como 'ProjectsApiResponse'
			const projectsCache = queryClient.getQueryData<ProjectsApiResponse>([
				"projects",
			]);

			// 2. Tenta encontrar o projeto na lista pré-carregada do cache
			const projectFromCache = projectsCache?.projects.find(
				(p) => p.id === projectId,
			);

			// 3. Retorna o projeto do cache se ele existir
			if (projectFromCache) {
				return projectFromCache;
			}

			// 4. Se não encontrar, retorna `undefined` para que o React Query busque os dados pela rede.
			return undefined;
		},
		staleTime: 1000 * 60 * 60,
	});
};
