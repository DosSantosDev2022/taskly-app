// src/actions/comment.ts

"use server";

import { editCommentSchema } from "@/@types/zod";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * @fileoverview Server Action para editar um comentário existente.
 */

/**
 * Define a estrutura do objeto de resultado retornado pela Server Action.
 *
 * @interface EditCommentResult
 * @property {boolean} success - Indica se a operação foi bem-sucedida.
 * @property {string} [message] - Uma mensagem descritiva em caso de sucesso ou falha.
 * @property {Object.<string, string>} [errors] - Um objeto contendo erros de validação, onde a chave é o nome do campo e o valor é a mensagem de erro.
 */
interface EditCommentResult {
	success: boolean;
	message?: string;
	errors?: { [key: string]: string };
}

/**
 * Edita um comentário existente no banco de dados.
 *
 * Esta Server Action realiza as seguintes etapas:
 * 1. Valida a entrada do usuário usando `editCommentSchema` do Zod.
 * 2. Verifica se o comentário com o `id` fornecido existe no banco de dados.
 * 3. Atualiza o conteúdo do comentário no Prisma.
 * 4. Revalida o cache das páginas relevantes para que a UI reflita a mudança.
 * 5. Trata possíveis erros, como validação falha ou problemas com o banco de dados.
 *
 * @param {string} id - O ID do comentário a ser editado.
 * @param {string} content - O novo conteúdo do comentário.
 * @returns {Promise<EditCommentResult>} Um objeto com o resultado da operação, incluindo `success`, `message` e, opcionalmente, `errors`.
 */
export async function editCommentAction(
	id: string,
	content: string,
): Promise<EditCommentResult> {
	// 1. Valida os dados de entrada usando o schema do Zod
	const validation = editCommentSchema.safeParse({ id, content });
	// Se a validação falhar, retorna os erros de validação
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
	// Se a validação for bem-sucedida, extrai os dados validados
	const validatedData = validation.data;

	try {
		//  Verifica se o comentário existe
		const existingComment = await db.comment.findUnique({
			where: { id: validatedData.id },
		});

		if (!existingComment) {
			return {
				success: false,
				message: "Comentário não encontrado.",
			};
		}

		//  Atualiza o comentário no banco de dados
		await db.comment.update({
			where: { id: validatedData.id },
			data: {
				content: validatedData.content,
				updatedAt: new Date(),
			},
		});

		// 4. Revalida o cache para refletir as mudanças na UI
		// Revalida a página de detalhes do projeto e a lista de projetos.
		revalidatePath(`/projects/project/${existingComment.projectId}`);
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
