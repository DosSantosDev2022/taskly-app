// src/hooks/use-clients.ts

import { getClients } from "@/actions/client"; // Assumindo que você tem uma Server Action para clientes
import { Client } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

/**
 * @fileoverview Hook customizado para buscar a lista de clientes usando React Query.
 */

/**
 * Hook customizado para buscar a lista completa de clientes.
 *
 * Este hook encapsula a lógica de data fetching para clientes, proporcionando:
 * - Gerenciamento automático do estado de loading, erro e dados.
 * - Cache de dados de 30 minutos para otimizar a performance e reduzir requisições desnecessárias.
 * - Tratamento de erros centralizado, lançando uma exceção se a Server Action falhar.
 *
 * @returns {object} Um objeto com o estado da query, incluindo `data`, `isLoading`, `isError` e `error`.
 * @property {Client[] | undefined} data - A lista de clientes, ou `undefined` enquanto a query está pendente ou se houver um erro.
 * @property {boolean} isLoading - Booleano que indica se a query está em estado de carregamento.
 * @property {boolean} isError - Booleano que indica se a query falhou.
 * @property {Error | null} error - O objeto de erro em caso de falha, ou `null` se não houver erro.
 */
export const useGetClients = () => {
	return useQuery<Client[]>({
		queryKey: ["clients"],
		queryFn: async () => {
			const response = await getClients();
			if (!response.success || !response.clients) {
				// Lança um erro que será capturado pelo React Query
				throw new Error("Falha ao buscar clientes.");
			}
			return response.clients;
		},
		staleTime: 1000 * 60 * 30, // 30 minutos de cache
	});
};
