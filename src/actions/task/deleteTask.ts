"use server";

import db from "@/lib/prisma"; // Importe seu cliente Prisma
import { revalidatePath } from "next/cache"; // Para revalidar o cache do Next.js
import { z } from "zod"; // Importe Zod para validação

const deleteTaskSchema = z.string().min(1, "ID da tarefa é obrigatório.");

export async function deleteTask(taskId: string) {
	const validation = deleteTaskSchema.safeParse(taskId);

	if (!validation.success) {
		console.error("Erro de validação ao deletar tarefa:", validation.error);
		return {
			success: false,
			errors: validation.error?.flatten().fieldErrors,
			message: "ID da tarefa inválido.",
		};
	}

	const validatedTaskId = validation.data;

	try {
		const deletedTask = await db.task.delete({
			where: {
				id: validatedTaskId,
			},
		});

		revalidatePath(`/projects/${deletedTask.projectId}`);
		return {
			success: true,
			deletedTask: deletedTask,
			message: "Tarefa deletada com sucesso!",
		};
	} catch (error) {
		console.error("Erro ao deletar tarefa:", error);

		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			(error as any).code === "P2025"
		) {
			return {
				success: false,
				errors: { taskId: "Tarefa não encontrada." },
				message: "A tarefa não existe.",
			};
		}

		return {
			success: false,
			errors: { general: "Ocorreu um erro inesperado ao deletar a tarefa." },
			message: "Falha ao deletar tarefa. Tente novamente.",
		};
	}
}
