// src/components/pages/clients/clientSearch.tsx
"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react"; // Adicione useRef
import { useDebounce } from "use-debounce";

interface ClientSearchProps {
	currentQuery?: string;
}

const ClientSearch = ({ currentQuery = "" }: ClientSearchProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams(); // searchParams é um objeto de somente leitura

	const [searchValue, setSearchValue] = useState(currentQuery);
	const [debouncedSearchValue] = useDebounce(searchValue, 500);

	// Usar useRef para manter o controle do valor inicial ou quando a query foi aplicada pela última vez.
	// Isso ajuda a evitar o loop de useEffect.
	const initialLoadRef = useRef(true);

	// Efeito para sincronizar o input com a URL (se a URL mudar externamente)
	useEffect(() => {
		// Apenas sincroniza se o componente já foi montado e o valor da URL é diferente do valor local
		if (!initialLoadRef.current && currentQuery !== searchValue) {
			setSearchValue(currentQuery);
		}
	}, [currentQuery]);

	// Efeito para aplicar o debounce e atualizar a URL APENAS quando o valor da busca muda
	useEffect(() => {
		// No carregamento inicial, não queremos disparar um replace
		// Queremos que a query da URL seja a fonte da verdade para o input inicialmente
		if (initialLoadRef.current) {
			initialLoadRef.current = false;
			// Se já houver uma query na URL na montagem inicial, defina o estado
			// Mas o `useState(currentQuery)` já lida com isso.
			return; // Evita o replace na montagem inicial
		}

		// Só faça o `router.replace` se o valor debounced for diferente da `currentQuery` da URL
		// Isso evita re-renderizações desnecessárias quando a página muda mas a busca não.
		if (debouncedSearchValue === currentQuery) {
			return; // Não faça nada se o valor debounced já corresponder à query da URL
		}

		const params = new URLSearchParams(searchParams.toString());
		if (debouncedSearchValue) {
			params.set("query", debouncedSearchValue);
			// Ao buscar, geralmente queremos voltar para a primeira página
			params.set("page", "1");
		} else {
			params.delete("query");
			params.delete("page"); // Limpa o parâmetro 'page' quando a busca é limpa
		}

		// Preserve o 'pageSize' que vem da URL
		const pageSizeFromUrl = searchParams.get("pageSize");
		if (pageSizeFromUrl) {
			params.set("pageSize", pageSizeFromUrl);
		}

		router.replace(`${pathname}?${params.toString()}`);
	}, [debouncedSearchValue, currentQuery, pathname, router, searchParams]); // searchParams como dependência é importante

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
