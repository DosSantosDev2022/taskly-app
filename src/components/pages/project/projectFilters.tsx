// src/components/pages/ProjectFilters.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui";
import type { ProjectStatus } from "@prisma/client";
import { getStatusLabelProject, projectStatusArray } from "@/utils";

type ProjectType = "Web" | "Mobile" | "Desktop";

const projectTypes = [
	{ label: "Web", value: "WEB" as ProjectType },
	{ label: "Mobile", value: "MOBILE" as ProjectType },
	{ label: "Sistema", value: "SISTEMA" as ProjectType },
];

// O tipo agora incluirá a string literal 'all' para a opção "Todos"
type FilterValue = ProjectType | ProjectStatus | "all";

const ProjectFilters = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Inicializa os estados com o valor da URL, ou 'all' se não houver filtro
	const [selectedType, setSelectedType] = useState<FilterValue>(
		(searchParams.get("type") as ProjectType) || "all",
	);
	const [selectedStatus, setSelectedStatus] = useState<FilterValue>(
		(searchParams.get("status") as ProjectStatus) || "all",
	);

	useEffect(() => {
		// Sincroniza o estado local com os parâmetros da URL
		setSelectedType((searchParams.get("type") as ProjectType) || "all");
		setSelectedStatus((searchParams.get("status") as ProjectStatus) || "all");
	}, [searchParams]);

	const updateFilters = (newType: FilterValue, newStatus: FilterValue) => {
		const params = new URLSearchParams(searchParams.toString());

		// Se o valor for 'all', delete o parâmetro. Caso contrário, defina-o.
		if (newType !== "all") {
			params.set("type", newType);
		} else {
			params.delete("type");
		}

		if (newStatus !== "all") {
			params.set("status", newStatus);
		} else {
			params.delete("status");
		}

		router.push(`?${params.toString()}`);
	};

	const handleTypeChange = (value: string) => {
		const newType = value as FilterValue;
		setSelectedType(newType);
		updateFilters(newType, selectedStatus);
	};

	const handleStatusChange = (value: string) => {
		const newStatus = value as FilterValue;
		setSelectedStatus(newStatus);
		updateFilters(selectedType, newStatus);
	};

	return (
		<div className="md:col-span-4">
			<div className="sticky top-20 p-4 border rounded-lg bg-card">
				<h3 className="text-lg font-semibold mb-4">Navegue por filtros</h3>

				<div className="space-y-2">
					{/* Filtro por Tipo de Projeto */}
					<div>
						<span className="text-sm font-medium">Tipo de projeto</span>
						<Select value={selectedType} onValueChange={handleTypeChange}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Selecione um tipo" />
							</SelectTrigger>
							<SelectContent>
								{/* O valor para "Todos" agora é 'all' */}
								<SelectItem value="all">Todos</SelectItem>
								{projectTypes.map((type) => (
									<SelectItem value={type.value} key={type.value}>
										{type.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Filtro por Status */}
					<div>
						<span className="text-sm font-medium">Status</span>
						<Select value={selectedStatus} onValueChange={handleStatusChange}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Selecione um status" />
							</SelectTrigger>
							<SelectContent>
								{/* O valor para "Todos" agora é 'all' */}
								<SelectItem value="all">Todos</SelectItem>
								{projectStatusArray.map((status) => (
									<SelectItem key={status} value={status}>
										{getStatusLabelProject(status)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		</div>
	);
};

export { ProjectFilters };
