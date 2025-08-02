"use client";

import { updateClientStatus } from "@/actions/client";
import { formatClientStatus, getStatusClientStyles } from "@/utils";
import type { ClientStatus } from "@prisma/client";
import { useTransition } from "react";
import { toast } from "react-toastify";

interface ProjectStatusDisplayProps {
	clientId: string;
	currentStatus: ClientStatus;
}

const StatusButtonClient = ({
	clientId,
	currentStatus,
}: ProjectStatusDisplayProps) => {
	const [isPending, startTransition] = useTransition();

	const handleClick = () => {
		const newStatusForDb =
			currentStatus === "ACTIVE" ? ("INACTIVE" as const) : ("ACTIVE" as const);

		startTransition(async () => {
			const result = await updateClientStatus({
				id: clientId,
				status: newStatusForDb,
			});

			if (result.success) {
				toast.success("Status do cliente atualizado!", {
					autoClose: 3000,
					theme: "dark",
				});
			} else {
				toast.error("Erro ao atualizar status do cliente.", {
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
        ${getStatusClientStyles(currentStatus)}
        ${isPending ? "opacity-70 cursor-not-allowed" : "hover:opacity-80"}
      `}
		>
			{isPending ? "..." : formatClientStatus(currentStatus)}
		</span>
	);
};

export { StatusButtonClient };
