"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type React from "react";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 60 * 7, // Dados "frescos" por 7 horas antes de serem considerados "stale"
			refetchOnWindowFocus: false, // Evita refetch em cada foco de janela para dados que não precisam de atualização em tempo real
		},
	},
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />{" "}
			{/* Ferramentas de desenvolvimento */}
		</QueryClientProvider>
	);
}
