// src/actions/task.ts
"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z, ZodError } from "zod";

const deleteTaskSchema = z.string().min(1, "O ID da tarefa é obrigatório.");

export interface DeleteTaskResult {
	success: boolean;
	message?: string;
	deletedTask?: { projectId: string };
	errors?: Record<string, string[]>;
}

export async function deleteTaskAction(
	taskId: string,
): Promise<DeleteTaskResult> {
	try {
		const validation = deleteTaskSchema.safeParse(taskId);

		if (!validation.success) {
			console.error(
				"Erro de validação ao deletar tarefa:",
				z.treeifyError(validation.error),
			);
			return {
				success: false,
				message:
					"ID da tarefa inválido. Não foi possível prosseguir com a exclusão.",
				errors: { taskId: validation.error.flatten().formErrors },
			};
		}

		const validatedTaskId = validation.data;

		const deletedTask = await db.task.delete({
			where: {
				id: validatedTaskId,
			},
			select: {
				projectId: true,
			},
		});

		revalidatePath(`/projects/${deletedTask.projectId}`);
		revalidatePath(`/projects/project/${deletedTask.projectId}`);

		return {
			success: true,
			deletedTask: deletedTask,
			message: "Tarefa deletada com sucesso!",
		};
	} catch (error) {
		console.error("Erro ao deletar tarefa:", error);

		if (
			error instanceof Error &&
			"code" in error &&
			(error as any).code === "P2025"
		) {
			return {
				success: false,
				message:
					"A tarefa especificada não foi encontrada. Pode já ter sido removida.",
				errors: { taskId: ["Tarefa não encontrada."] },
			};
		}

		if (error instanceof ZodError) {
			return {
				success: false,
				message: "Erro de validação dos dados fornecidos.",
				errors: z.treeifyError(error),
			};
		}

		return {
			success: false,
			message:
				"Ocorreu um erro interno do servidor ao deletar a tarefa. Por favor, tente novamente.",
			errors: { general: ["Erro inesperado do servidor."] },
		};
	}
}
