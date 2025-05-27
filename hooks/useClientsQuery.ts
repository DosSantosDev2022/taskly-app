// hooks/useClientsQuery.ts
import { useQuery } from '@tanstack/react-query';
import { fetchClients } from '@/actions/client/fetchClients'; // ou '@/lib/api/fetchClients';
import type { Client } from '@/@types/prismaSchema'; // Certifique-se de ter um tipo Client

interface ClientsQueryResult {
  clients: Client[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useClientsQuery(): ClientsQueryResult {
  const { data, isLoading, isError, error } = useQuery<{ success: boolean; clients?: Client[]; error?: string }, Error>({
    queryKey: ['clients'], // Chave para o cache da lista de clientes
    queryFn: async () => {
       return await fetchClients();
    },
    staleTime: 1000 * 60 * 60, // Clientes não mudam com tanta frequência, pode ter um staleTime maior (1 hora)
    refetchOnWindowFocus: false,
  });

  return { clients: data?.clients, isLoading, isError, error };
}