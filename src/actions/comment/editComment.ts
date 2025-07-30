"use server";

import { editCommentSchema } from "@/@types/zod/commentFormSchema";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface EditCommentResult {
	success: boolean;
	message?: string;
	errors?: { [key: string]: string };
}

export async function editComment(
	id: string,
	content: string,
): Promise<EditCommentResult> {
	// 1. Validação da entrada
	const validation = editCommentSchema.safeParse({ id, content });

	if (!validation.success) {
		const errors: { [key: string]: string } = {};
		validation.error.issues.forEach((err) => {
			if (err.path.length > 0) {
				errors[String(err.path[0])] = err.message;
			}
		});
		return {
			success: false,
			message: "Dados de entrada inválidos.",
			errors,
		};
	}

	const validatedData = validation.data;

	try {
		// 2. Verifica se o comentário existe
		const existingComment = await db.comment.findUnique({
			where: { id: validatedData.id },
		});

		if (!existingComment) {
			return {
				success: false,
				message: "Comentário não encontrado.",
			};
		}

		// 3. Atualiza o comentário no banco de dados
		await db.comment.update({
			where: { id: validatedData.id },
			data: {
				content: validatedData.content,
				updatedAt: new Date(), // Opcional: atualizar o campo updatedAt
			},
		});

		// 4. Revalida o cache para refletir as mudanças na UI
		// Substitua pelo caminho da sua página de projetos/comentários
		revalidatePath(`/projects/${existingComment.projectId}`);
		revalidatePath(`/projects`);

		return {
			success: true,
			message: "Comentário atualizado com sucesso!",
		};
	} catch (error) {
		console.error("Erro ao editar comentário no banco de dados:", error);
		return {
			success: false,
			message: "Falha ao editar comentário. Tente novamente.",
			errors: { database: "Erro interno do servidor." },
		};
	}
}
