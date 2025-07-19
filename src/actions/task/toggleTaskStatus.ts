"use server";

import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

// Define the schema for input validation
const updateTaskStatusSchema = z.object({
	taskId: z.string().min(1, "ID da tarefa é obrigatório."),
	currentStatus: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
	projectId: z.string().min(1, "ID do projeto é obrigatório para revalidação."),
});

export async function toggleTaskStatus(formData: FormData) {
	const taskId = formData.get("taskId") as string;
	const currentStatus = formData.get("currentStatus") as TaskStatus;
	const projectId = formData.get("projectId") as string;

	// Validate the input
	const validation = updateTaskStatusSchema.safeParse({
		taskId,
		currentStatus,
		projectId,
	});

	if (!validation.success) {
		console.error(
			"Erro de validação ao atualizar status da tarefa:",
			validation.error,
		);
		return {
			success: false,
			errors: validation.error.flatten().fieldErrors,
			message: "Dados de entrada inválidos para atualizar o status.",
		};
	}

	const {
		taskId: validatedTaskId,
		currentStatus: validatedCurrentStatus,
		projectId: validatedProjectId,
	} = validation.data;

	// Determine the next status in the cycle
	let nextStatus: TaskStatus;
	switch (validatedCurrentStatus) {
		case "PENDING":
			nextStatus = "IN_PROGRESS";
			break;
		case "IN_PROGRESS":
			nextStatus = "COMPLETED";
			break;
		case "COMPLETED":
			// If already completed, you might want to cycle back to pending or do nothing.
			// For this example, let's cycle back to PENDING.
			nextStatus = "PENDING";
			break;
		default:
			// Fallback for unexpected status, though Zod should prevent this.
			return {
				success: false,
				message: "Status atual da tarefa não reconhecido.",
			};
	}

	try {
		// Update the task status in the database
		const updatedTask = await db.task.update({
			where: { id: validatedTaskId },
			data: { status: nextStatus },
		});

		// Revalidate the path of the project to update the UI
		revalidatePath(`/projects/${validatedProjectId}`);

		return {
			success: true,
			updatedTask: updatedTask,
			message: `Status da tarefa atualizado para ${nextStatus}!`,
		};
	} catch (error) {
		console.error("Erro ao atualizar status da tarefa:", error);
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			(error as any).code === "P2025"
		) {
			return {
				success: false,
				errors: { taskId: "Tarefa não encontrada." },
				message: "A tarefa que você tentou atualizar não existe.",
			};
		}
		return {
			success: false,
			errors: {
				general: "Ocorreu um erro inesperado ao atualizar o status da tarefa.",
			},
			message: "Falha ao atualizar status da tarefa. Tente novamente.",
		};
	}
}
