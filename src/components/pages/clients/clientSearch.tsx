// src/components/pages/clients/clientSearch.tsx
"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce"; // Vamos usar use-debounce para evitar muitas requisições

interface ClientSearchProps {
	currentQuery?: string; // Recebe a query atual para preencher o input
}

const ClientSearch = ({ currentQuery = "" }: ClientSearchProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Estado local para o input de busca
	const [searchValue, setSearchValue] = useState(currentQuery);

	// Debounce para atrasar a atualização da URL e evitar muitas requisições
	const [debouncedSearchValue] = useDebounce(searchValue, 500); // Atraso de 500ms

	// Atualiza o input se a currentQuery mudar (ex: navegação de volta ou URL direto)
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (currentQuery !== searchValue) {
			setSearchValue(currentQuery);
		}
	}, [currentQuery]);

	// Efeito para aplicar o debounce e atualizar a URL
	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());
		if (debouncedSearchValue) {
			params.set("query", debouncedSearchValue);
			// Ao buscar, geralmente queremos voltar para a primeira página
			params.set("page", "1");
		} else {
			params.delete("query");
			params.delete("page"); // Opcional: remover page=1 se a query for limpa
		}
		router.replace(`${pathname}?${params.toString()}`);
	}, [debouncedSearchValue, pathname, router, searchParams]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value);
	};

	return (
		<Input
			type="text"
			placeholder="Buscar cliente..."
			value={searchValue}
			onChange={handleInputChange}
			className="max-w-sm"
		/>
	);
};

export { ClientSearch };
