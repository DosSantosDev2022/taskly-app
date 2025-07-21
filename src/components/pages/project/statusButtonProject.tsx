"use client";

import { useTransition } from "react";
import { toast } from "react-toastify";
import type { ProjectStatus } from "@prisma/client";
import { toggleProjectStatus } from "@/actions/project/toggleProjectStatus";
import { getStatusLabelProject, getStatusProjectStyles } from "@/utils";

interface ProjectStatusDisplayProps {
	projectId: string;
	currentStatus: ProjectStatus;
}

const StatusButtonProject = ({
	projectId,
	currentStatus,
}: ProjectStatusDisplayProps) => {
	const [isPending, startTransition] = useTransition();

	const handleClick = () => {
		startTransition(async () => {
			const result = await toggleProjectStatus(projectId, currentStatus);

			if (result.success) {
				toast.success("Status do projeto atualizado!", {
					autoClose: 3000,
					theme: "dark",
				});
			} else {
				toast.error("Erro ao atualizar status do projeto.", {
					autoClose: 3000,
					theme: "dark",
				});
			}
		});
	};

	return (
		<span
			onClick={handleClick}
			className={`
        items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer
        ${getStatusProjectStyles(currentStatus)}
        ${isPending ? "opacity-70 cursor-not-allowed" : "hover:opacity-80"}
      `}
		>
			{isPending ? "Atualizando..." : getStatusLabelProject(currentStatus)}
		</span>
	);
};

export { StatusButtonProject };
