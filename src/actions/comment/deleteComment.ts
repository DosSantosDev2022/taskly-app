"use server";

import db from "@/lib/prisma"; // Importe seu cliente Prisma
import { revalidatePath } from "next/cache"; // Para revalidar o cache do Next.js
import { z } from "zod"; // Importe Zod para validação

const deleteCommentSchema = z
	.string()
	.min(1, "ID do comentário é obrigatório.");

export async function deleteComment(taskId: string) {
	const validation = deleteCommentSchema.safeParse(taskId);

	if (!validation.success) {
		console.error("Erro de validação ao deletar comentário:", validation.error);
		return {
			success: false,
			errors: validation.error?.flatten().fieldErrors,
			message: "ID da comentário inválido.",
		};
	}

	const validatedCommentId = validation.data;

	try {
		const deletedComment = await db.comment.delete({
			where: {
				id: validatedCommentId,
			},
		});

		revalidatePath(`/projects/${deletedComment.projectId}`);
		return {
			success: true,
			deletedComent: deletedComment,
			message: "Comentário deletada com sucesso!",
		};
	} catch (error) {
		console.error("Erro ao deletar comentário:", error);

		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			(error as any).code === "P2025"
		) {
			return {
				success: false,
				errors: { taskId: "Comentário não encontrado." },
				message: "A tarefa não existe.",
			};
		}

		return {
			success: false,
			errors: {
				general: "Ocorreu um erro inesperado ao deletar o comentário.",
			},
			message: "Falha ao deletar comentário. Tente novamente.",
		};
	}
}
