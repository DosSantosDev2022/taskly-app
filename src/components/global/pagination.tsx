// src/components/global/pagination-component.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
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
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

interface PaginationComponentProps {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	currentQuery?: string;
}

const PaginationComponent = ({
	currentPage,
	totalPages,
	currentQuery = "",
	pageSize,
}: PaginationComponentProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const createQueryString = useCallback(
		(name: string, value: string, newPageSize?: number) => {
			// Começamos com os searchParams atuais para preservar todos eles
			const params = new URLSearchParams(searchParams.toString());
			// Define o novo parâmetro de página
			params.set(name, value);

			// Preserva o parâmetro 'query' se existir
			if (currentQuery) {
				params.set("query", currentQuery);
			} else {
				params.delete("query"); // Remove se não houver query
			}

			// Preserva o parâmetro 'pageSize'
			params.set("pageSize", (newPageSize || pageSize).toString());

			return params.toString();
		},
		[searchParams, currentQuery, pageSize],
	);

	const goToPage = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			router.push(`${pathname}?${createQueryString("page", page.toString())}`);
		}
	};

	const handlePageSizeChange = (newSize: string) => {
		const newPageSize = Number(newSize);
		if (!Number.isNaN(newPageSize) && newPageSize > 0) {
			router.push(`${pathname}?${createQueryString("page", "1", newPageSize)}`);
		}
	};

	return (
		<div className="flex items-center justify-between space-x-2 py-4">
			{/* Informação de página e seletor de pageSize */}
			<div className="flex items-center space-x-2">
				<div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
					Página {currentPage} de {totalPages}
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
							disabled={currentPage === 1}
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
							onClick={() => goToPage(currentPage - 1)}
							disabled={currentPage === 1}
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
							onClick={() => goToPage(currentPage + 1)}
							disabled={currentPage === totalPages}
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
							disabled={currentPage === totalPages}
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
