// src/actions/project/toggleProjectStatus.ts
"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ProjectStatus } from "@prisma/client"; // Importe os tipos do Prisma

interface ToggleProjectStatusResult {
	success?: boolean;
	message?: string;
	error?: string;
}

export async function toggleProjectStatus(
	projectId: string,
	currentStatus: ProjectStatus, // Receber o status atual para determinar o próximo
): Promise<ToggleProjectStatusResult> {
	if (!projectId) {
		return { error: "ID do projeto não fornecido." };
	}

	// Lógica para determinar o próximo status
	let newStatus: ProjectStatus;
	switch (currentStatus) {
		case "PENDING":
			newStatus = "IN_PROGRESS";
			break;
		case "IN_PROGRESS":
			newStatus = "COMPLETED";
			break;
		case "COMPLETED":
			newStatus = "PENDING"; // Volta para PENDING ou o status inicial que desejar
			break;
		default:
			newStatus = "PENDING"; // Status padrão se for algo inesperado
	}

	try {
		await db.project.update({
			where: { id: projectId },
			data: {
				status: newStatus,
			},
		});

		// Revalida o caminho da página para mostrar o status atualizado
		revalidatePath(`/projects/${projectId}`);

		return {
			success: true,
			message: `Status do projeto atualizado para ${newStatus}.`,
		};
	} catch (error) {
		console.error("Erro ao alternar status do projeto:", error);
		return { error: "Falha ao atualizar o status do projeto." };
	}
}
