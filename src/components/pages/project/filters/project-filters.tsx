// src/components/pages/ProjectFilters.tsx
"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/use-project-store";
import type { ProjectStatus, ProjectType } from "@prisma/client";
import { FilterX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const projectTypes = [
	{ label: "Web", value: "WEB" as ProjectType },
	{ label: "Mobile", value: "MOBILE" as ProjectType },
	{ label: "Sistema", value: "SISTEMA" as ProjectType },
];

const projectStatus = [
	{ label: "Pendente", value: "PENDING" as ProjectStatus },
	{ label: "Em Andamento", value: "IN_PROGRESS" as ProjectStatus },
	{ label: "Concluído", value: "COMPLETED" as ProjectStatus },
];

const ProjectFilters = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	// Obtém o estado e a função de atualização do store Zustand
	const { type, status, setSearchParams } = useProjectStore();

	// Efeito para sincronizar o estado do Zustand com a URL
	// Isso é crucial para que, ao carregar a página com a URL, o estado do store seja o mesmo.
	useEffect(() => {
		// Lê os valores da URL de forma segura
		const urlType = (searchParams.get("type") as ProjectType) || undefined;
		const urlStatus =
			(searchParams.get("status") as ProjectStatus) || undefined;
		const urlPage = Number(searchParams.get("page")) || 1;
		const urlPageSize = Number(searchParams.get("pageSize")) || 10;

		// ATUALIZAÇÃO DO ZUSTAND COM O ESTADO COMPLETO E CORRETO
		setSearchParams({
			type: urlType,
			status: urlStatus,
			page: urlPage,
			pageSize: urlPageSize,
		});
	}, [searchParams, setSearchParams]);

	// Função centralizada para atualizar a URL e o estado
	const handleUpdateFilter = (
		key: "type" | "status",
		value: string | undefined,
	) => {
		const params = new URLSearchParams(searchParams);

		if (value) {
			params.set(key, value);
		} else {
			params.delete(key);
		}

		// Resetar a paginação para a primeira página ao aplicar um novo filtro
		params.set("page", "1");

		// Atualiza a URL
		router.push(`${pathname}?${params.toString()}`);
	};

	const handleClearFilters = () => {
		router.push(pathname);
	};

	return (
		<div className="flex items-center gap-2">
			{/* Filtro por Tipo de Projeto */}
			<Tooltip>
				{/* O valor e a mudança de valor agora são gerenciados pelo Zustand */}
				<Select
					value={type || "all"}
					onValueChange={(value) =>
						handleUpdateFilter("type", value !== "all" ? value : undefined)
					}
				>
					<TooltipTrigger asChild>
						<SelectTrigger aria-label="Selecione um tipo" className="w-[180px]">
							<SelectValue placeholder="Filtrar por Tipo" />
						</SelectTrigger>
					</TooltipTrigger>
					<SelectContent>
						<SelectItem value="all">Todos os tipos</SelectItem>
						{projectTypes.map((t) => (
							<SelectItem value={t.value} key={t.value}>
								{t.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<TooltipContent>Filtrar por Tipo</TooltipContent>
			</Tooltip>

			{/* Filtro por Status */}
			<Tooltip>
				<Select
					value={status || "all"}
					onValueChange={(value) =>
						handleUpdateFilter("status", value !== "all" ? value : undefined)
					}
				>
					<TooltipTrigger asChild>
						<SelectTrigger
							aria-label="Selecione um status"
							className="w-[180px]"
						>
							<SelectValue placeholder="Filtrar por Status" />
						</SelectTrigger>
					</TooltipTrigger>
					<SelectContent>
						<SelectItem value="all">Todos os status</SelectItem>
						{projectStatus.map((status) => (
							<SelectItem key={status.label} value={status.value}>
								{status.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<TooltipContent>Filtrar por Status</TooltipContent>
			</Tooltip>

			{(type || status) && (
				<Button
					variant="outline"
					size="icon"
					onClick={handleClearFilters}
					aria-label="Limpar Filtros"
				>
					<FilterX className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
};

export { ProjectFilters };
