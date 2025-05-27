// hooks/useProjectDetails.ts
import { useQuery } from '@tanstack/react-query';
import { fetchProjectId } from '@/actions/project/fetchProjectId'; // ou '@/actions/project/fetchProjectId';
import type { Project } from '@/@types/prismaSchema'; // Certifique-se de que seu tipo Project inclui as relações.

interface ProjectDetailsResult {
  project: Project | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void; // Para revalidar os dados manualmente
}

export function useProjectDetails(projectId: string | null): ProjectDetailsResult {
  const { data, isLoading, isError, error, refetch } = useQuery<Project, Error>({
    queryKey: ['project', projectId], // Chave única para o cache do projeto com o ID
    queryFn: async () => {
      if (!projectId) {
        throw new Error('ID do projeto é necessário para buscar detalhes.');
      }
      return await fetchProjectId(projectId);
    },
    enabled: !!projectId, // A query só será executada se projectId não for null/undefined
    staleTime: 1000 * 60 * 5, // Dados considerados "stale" após 5 minutos
    refetchOnWindowFocus: false, // Desabilita refetch ao focar na janela para este hook
  });

  return { project: data, isLoading, isError, error, refetch };
}