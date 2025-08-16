// src/components/global/pagination-component.tsx
"use client";

import {
	Button,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui";
import { useProjectStore } from "@/store/use-project-store";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

interface PaginationComponentProps {
	totalPages: number;
}

const PaginationComponent = ({ totalPages }: PaginationComponentProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Obtém o estado e a função de atualização do store Zustand
	const { page, pageSize, setSearchParams } = useProjectStore();

	// Efeito para sincronizar o estado do Zustand com a URL na montagem inicial
	useEffect(() => {
		const urlPage = searchParams.get("page");
		const urlPageSize = searchParams.get("pageSize");

		setSearchParams({
			page: urlPage ? Number(urlPage) : 1,
			pageSize: urlPageSize ? Number(urlPageSize) : 10,
		});
	}, [searchParams, setSearchParams]);

	// Função para criar o link e atualizar a URL
	const updateUrlWithParams = useCallback(
		(params: URLSearchParams) => {
			router.push(`${pathname}?${params.toString()}`);
		},
		[router, pathname],
	);

	const goToPage = (pageNumber: number) => {
		if (pageNumber >= 1 && pageNumber <= totalPages) {
			const params = new URLSearchParams(searchParams);
			params.set("page", pageNumber.toString());

			updateUrlWithParams(params);
			setSearchParams({ page: pageNumber });
		}
	};

	const handlePageSizeChange = (newSize: string) => {
		const newPageSize = Number(newSize);
		if (!Number.isNaN(newPageSize) && newPageSize > 0) {
			const params = new URLSearchParams(searchParams);
			params.set("pageSize", newPageSize.toString());
			params.set("page", "1"); // Ao mudar o tamanho da página, sempre volte para a primeira

			updateUrlWithParams(params);
			setSearchParams({ pageSize: newPageSize, page: 1 });
		}
	};

	return (
		<div className="flex items-center justify-between space-x-2 py-4">
			{/* Informação de página e seletor de pageSize */}
			<div className="flex items-center space-x-2">
				<div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
					Página {page} de {totalPages}
				</div>
				<Tooltip>
					<Select
						value={pageSize.toString()}
						onValueChange={handlePageSizeChange}
					>
						<TooltipTrigger asChild>
							<SelectTrigger className="min-w-[4rem] h-8">
								<SelectValue placeholder="Itens por página" />
							</SelectTrigger>
						</TooltipTrigger>
						<SelectContent className="min-w-[4rem]">
							<SelectItem value="10">10</SelectItem>
							<SelectItem value="20">20</SelectItem>
							<SelectItem value="30">30</SelectItem>
							<SelectItem value="40">40</SelectItem>
							<SelectItem value="50">50</SelectItem>
						</SelectContent>
					</Select>
					<TooltipContent>Itens por página</TooltipContent>
				</Tooltip>
			</div>

			{/* Botões de paginação */}
			<div className="space-x-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={() => goToPage(1)}
							disabled={page <= 1}
							aria-label="Primeira página"
						>
							<ChevronsLeft className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent className="">Primeira página</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={() => goToPage(page - 1)}
							disabled={page <= 1}
							aria-label="Página anterior"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Página anterior</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={() => goToPage(page + 1)}
							disabled={page >= totalPages}
							aria-label="Próxima página"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Próxima página</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={() => goToPage(totalPages)}
							disabled={page >= totalPages}
							aria-label="Última página"
						>
							<ChevronsRight className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Última página</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
};

export { PaginationComponent };
