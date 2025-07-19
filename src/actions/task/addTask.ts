"use server";
import {
	type CreateTaskInput,
	createTaskSchema,
} from "@/@types/forms/tasksSchema";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addTaskAction(values: CreateTaskInput) {
	// 1. Validação dos dados
	const validation = createTaskSchema.safeParse(values);

	if (!validation.success) {
		console.error("Erro de validação ao criar tarefa:", validation.error);
		return {
			success: false,
			errors: validation.error.flatten().fieldErrors,
			message: "Dados inválidos. Verifique os campos.",
		};
	}

	const { projectId, title, description, status } = validation.data;

	try {
		const newTask = await db.task.create({
			data: {
				projectId,
				title,
				description,
				status,
			},
		});

		revalidatePath(`/projects/${projectId}`);

		return {
			success: true,
			newTask,
			message: "Tarefa criada com sucesso.",
		};
	} catch (error) {
		console.error("Error creating task:", error);
		return {
			success: false,
			errors: { general: "Erro ao criar a tarefa. Tente novamente." },
			message: "Falha ao criar tarefa.",
		};
	}
}
