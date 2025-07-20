// src/actions/comment/addComment.ts
"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod"; // Importe Zod para validação

// Defina o schema de validação para o comentário
const commentSchema = z.object({
	content: z
		.string()
		.min(1, "O comentário não pode ser vazio.")
		.max(5000, "Comentário muito longo."),
	projectId: z.string().min(1, "ID do projeto é obrigatório."),
});

interface AddCommentResult {
	success?: boolean;
	errors?: Record<string, string[]>;
	message?: string;
}

export async function addComment(
	formData: FormData,
): Promise<AddCommentResult> {
	const session = await getServerSession(authOptions);
	const userId = session?.user.id;

	if (!userId) {
		return {
			message: "Usuário não autenticado.",
		};
	}

	const parsed = commentSchema.safeParse({
		content: formData.get("content"),
		projectId: formData.get("projectId"),
	});

	if (!parsed.success) {
		console.error("Validation Error:", parsed.error.flatten().fieldErrors);
		return {
			errors: parsed.error.flatten().fieldErrors,
			message: "Erro de validação ao adicionar comentário.",
		};
	}

	const { content, projectId } = parsed.data;

	try {
		await db.comment.create({
			data: {
				userId,
				content: content,
				projectId: projectId,
			},
		});

		// Revalida o caminho para onde os comentários são exibidos
		revalidatePath(`/projects/${projectId}`); // Revalida a página do projeto

		return { success: true, message: "Comentário adicionado com sucesso!" };
	} catch (error) {
		console.error("Failed to add comment:", error);
		return { message: "Falha ao adicionar comentário." };
	}
}
