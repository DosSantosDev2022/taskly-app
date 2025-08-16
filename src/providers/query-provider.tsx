// src/components/global/QueryProvider.tsx
"use client";

import type { DehydratedState } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface QueryProviderProps {
	children: React.ReactNode;
	dehydratedState?: DehydratedState;
}

export function QueryProvider({
	children,
	dehydratedState,
}: QueryProviderProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						staleTime: 1000 * 60 * 5,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
