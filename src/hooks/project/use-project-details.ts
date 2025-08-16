// src/hooks/use-project-by-id-query.ts
"use client";

import type { ProjectDetails } from "@/@types/project-types";
import { getProjectById } from "@/actions/project";
import type { ProjectsApiResponse } from "@/hooks/project/use-get-project-query"; // Importe o tipo da sua resposta de API de lista
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

		// Configura o staleTime para que os dados do cache sejam considerados 'frescos'
		// Isso evita que a busca de rede seja disparada imediatamente
		// O valor 1000 * 60 (1 minuto) é um bom padrão
		staleTime: 1000 * 60,
	});
};
