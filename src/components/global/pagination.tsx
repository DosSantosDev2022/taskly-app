// src/components/global/pagination-component.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui";

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
}: PaginationComponentProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			if (currentQuery) {
				params.set("query", currentQuery);
			} else {
				params.delete("query");
			}
			return params.toString();
		},
		[searchParams, currentQuery],
	);

	const goToPage = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			router.push(`${pathname}?${createQueryString("page", page.toString())}`);
		}
	};

	return (
		<div className="flex items-center justify-between space-x-2 py-4">
			<div className="flex-1 text-sm text-muted-foreground">
				Página {currentPage} de {totalPages}
			</div>
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
