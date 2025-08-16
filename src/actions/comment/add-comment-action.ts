// src/actions/comment.ts
"use server";

import { commentSchema, CreateCommentInput } from "@/@types/zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import z from "zod";

/**
 * Resultado da ação de adicionar um comentário.
 * @interface AddCommentResult
 * @property {CreateCommentInput} [newComment] - O novo comentário criado, se a ação for bem-sucedida.
 * @property {boolean} [success] - Indica se a ação foi bem-sucedida.
 * @property {Record<string, string[]>} [errors] - Um objeto contendo erros de validação, mapeando campos para arrays de mensagens de erro.
 * @property {string} [message] - Uma mensagem descritiva sobre o resultado da ação.
 */
export interface AddCommentResult {
	newComment?: CreateCommentInput;
	success?: boolean;
	errors?: Record<string, string[]>;
	message?: string;
}

/**
 * Adiciona um novo comentário a um projeto.
 * Esta é uma Server Action que valida os dados do comentário, verifica a autenticação do usuário
 * e cria o comentário no banco de dados.
 * @param {CreateCommentInput} newComment - Os dados do novo comentário a ser criado, incluindo o conteúdo e o ID do projeto.
 * @returns {Promise<AddCommentResult>} - O resultado da operação, incluindo o status de sucesso, mensagens e erros de validação.
 */
export async function addCommentAction(
	newComment: CreateCommentInput,
): Promise<AddCommentResult> {
	// Verifica se o usuário está autenticado
	const session = await getServerSession(authOptions);
	const userId = session?.user.id;
	// Se o usuário não estiver autenticado, retorna um erro
	if (!userId) {
		return {
			success: false,
			message: "Você precisa estar logado para adicionar um comentário.",
		};
	}

	try {
		// Valida os dados do comentário usando o schema Zod
		const parsed = commentSchema.safeParse(newComment);
		// Se a validação falhar, retorna os erros
		if (!parsed.success) {
			console.error(
				"Erro de validação ao adicionar comentário:",
				z.treeifyError(parsed.error),
			);
			return {
				success: false,
				errors: parsed.error.flatten().fieldErrors,
				message:
					"Dados inválidos. Por favor, verifique o comentário e o ID do projeto.",
			};
		}
		// Se a validação for bem-sucedida, extrai os dados necessários
		const { content, projectId } = parsed.data;

		// Cria o comentário no banco de dados
		await db.comment.create({
			data: {
				userId,
				content: content,
				projectId: projectId,
			},
		});

		// Revalida as rotas para atualizar os dados em cache
		revalidatePath(`/projects/${projectId}`);
		revalidatePath(`/projects/project/${projectId}`);

		// Retorna o resultado com sucesso e os dados do novo comentário
		return {
			success: true,
			message: "Comentário adicionado com sucesso!",
			newComment: { content, projectId }, // Retorna os dados para o hook
		};
	} catch (error) {
		console.error("Falha ao adicionar comentário:", error);
		// Se ocorrer um erro ao criar o comentário, retorna uma mensagem de erro genérica
		return { success: false, message: "Erro interno do servidor." };
	}
}
