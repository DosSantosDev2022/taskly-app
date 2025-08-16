// src/components/pages/projects/project-skeleton-table.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import type { JSX } from "react";

/**
 * Componente Skeleton para a tabela de projetos.
 * Exibe um estado de carregamento visualmente agradável enquanto os dados são buscados.
 */
const ProjectsTableSkeleton = (): JSX.Element => {
	// Define o número de linhas do esqueleto.
	// Isso deve ser um valor fixo ou calculado para simular a tabela.
	const rowCount = 5;

	return (
		<>
			{Array.from({ length: rowCount }).map((_, index) => (
				<TableRow key={index}>
					{/* Coluna Nome do Projeto */}
					<TableCell className="font-medium">
						<Skeleton className="h-4 w-[150px]" />
					</TableCell>

					{/* Coluna Tipo */}
					<TableCell>
						<Skeleton className="h-4 w-[80px]" />
					</TableCell>

					{/* Coluna Cliente */}
					<TableCell>
						<Skeleton className="h-4 w-[100px]" />
					</TableCell>

					{/* Coluna Descrição */}
					<TableCell>
						<Skeleton className="h-4 w-[200px]" />
					</TableCell>

					{/* Coluna Status */}
					<TableCell className="text-center">
						<Skeleton className="h-4 w-[80px] mx-auto" />
					</TableCell>

					{/* Coluna Tarefas */}
					<TableCell>
						<Skeleton className="h-4 w-[40px]" />
					</TableCell>

					{/* Coluna Criação */}
					<TableCell>
						<Skeleton className="h-4 w-[100px]" />
					</TableCell>

					{/* Coluna Prazo */}
					<TableCell>
						<Skeleton className="h-4 w-[100px]" />
					</TableCell>

					{/* Coluna Ações */}
					<TableCell className="flex items-center justify-center gap-2">
						<Skeleton className="h-8 w-8 rounded-full" />
						<Skeleton className="h-8 w-8 rounded-full" />
					</TableCell>
				</TableRow>
			))}
		</>
	);
};

export { ProjectsTableSkeleton };
