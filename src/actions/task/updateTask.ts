// src/actions/task/updateTask.ts
"use server";

import { db } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Esquema de validação para os dados da atualização da tarefa
const updateTaskSchema = z.object({
	title: z
		.string()
		.min(1, "O título é obrigatório.")
		.max(100, "O título não pode ter mais de 100 caracteres."),
	description: z
		.string()
		.max(500, "A descrição não pode ter mais de 500 caracteres.")
		.nullable(),
});

type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export async function updateTask(taskId: string, data: UpdateTaskInput) {
	try {
		// Validação dos dados de entrada
		const validatedData = updateTaskSchema.safeParse(data);

		if (!validatedData.success) {
			return {
				success: false,
				message: "Dados de entrada inválidos.",
				errors: validatedData.error.flatten().fieldErrors,
			};
		}

		const { title, description } = validatedData.data;

		const updatedTask = await db.task.update({
			where: { id: taskId },
			data: {
				title,
				description,
				updatedAt: new Date(), // Atualiza o timestamp de atualização
			},
			select: {
				projectId: true, // Seleciona o projectId para revalidação
			},
		});

		// Revalida a rota para garantir que os dados atualizados sejam mostrados
		// Isso é importante porque a página do projeto precisa exibir a tarefa atualizada.
		revalidatePath(`/projects/${updatedTask.projectId}`);

		return { success: true, message: "Tarefa atualizada com sucesso!" };
	} catch (error) {
		console.error("Erro ao atualizar tarefa:", error);
		return { success: false, message: "Falha ao atualizar a tarefa." };
	}
}
