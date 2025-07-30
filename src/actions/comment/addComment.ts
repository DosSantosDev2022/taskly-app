"use server";

import { commentSchema } from "@/@types/zod/commentFormSchema";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import z, { ZodError } from "zod";

/**
 * @typedef {object} AddCommentResult
 * @property {boolean} [success] - Indica se a operação foi bem-sucedida.
 * @property {Record<string, string[]>} [errors] - Objeto contendo erros de validação por campo (opcional).
 * @property {string} [message] - Mensagem descritiva do resultado da operação.
 */
interface AddCommentResult {
	success?: boolean;
	errors?: Record<string, string[]>;
	message?: string;
}

/**
 * @function addComment
 * @description Server Action para adicionar um novo comentário a um projeto.
 * Requer autenticação do usuário, valida os dados de entrada e cria o comentário no banco de dados.
 * Após a criação, revalida o cache da página do projeto para exibir o novo comentário.
 *
 * @param {FormData} formData - Os dados do formulário contendo `content` e `projectId`.
 * @returns {Promise<AddCommentResult>} Um objeto indicando o status da operação, mensagem e possíveis erros.
 */
export async function addComment(
	formData: FormData,
): Promise<AddCommentResult> {
	// 1. Verificação de Autenticação do Usuário
	const session = await getServerSession(authOptions);
	const userId = session?.user.id;

	if (!userId) {
		// Retorna erro se o usuário não estiver autenticado.
		return {
			success: false, // Adicionado `success: false` para clareza
			message: "Você precisa estar logado para adicionar um comentário.",
		};
	}

	// Coleta os dados do FormData para validação
	const commentData = {
		content: formData.get("content"),
		projectId: formData.get("projectId") || "",
	};
	console.log("Dados recebidos para validação:", commentData);
	try {
		// 2. Validação dos dados de entrada com Zod
		const parsed = commentSchema.safeParse(commentData);

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

		const { content, projectId } = parsed.data;

		// 3. Criação do Comentário no Banco de Dados
		await db.comment.create({
			data: {
				userId, // ID do usuário autenticado
				content: content,
				projectId: projectId,
				createdAt: new Date(), // Adiciona timestamp de criação
				updatedAt: new Date(), // Adiciona timestamp de atualização inicial
			},
		});

		// 4. Revalidação do Cache
		// Garante que a página do projeto associado seja revalidada
		// para exibir o novo comentário imediatamente.
		revalidatePath(`/projects/${projectId}`);

		// 5. Retorna sucesso
		return { success: true, message: "Comentário adicionado com sucesso!" };
	} catch (error) {
		// 6. Tratamento de Erros
		console.error("Falha ao adicionar comentário:", error);

		// Tratamento de erros de validação Zod (caso ocorra fora do safeParse, menos provável aqui)
		if (error instanceof ZodError) {
			return {
				success: false,
				message: "Erro de validação dos dados fornecidos.",
				errors: error.flatten().fieldErrors,
			};
		}

		// Tratamento específico para erros do Prisma, como projeto não encontrado (P2003 para Foreign Key)
		// Embora o `projectId` seja validado, a ausência real no DB causaria um erro de FK.
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			(error as any).code === "P2003" // Foreign Key constraint failed on the field: `projectId`
		) {
			return {
				success: false,
				message: "O projeto especificado não existe.",
				errors: { projectId: ["Projeto não encontrado."] },
			};
		}

		// Erro genérico para falhas inesperadas no servidor
		return {
			success: false,
			message:
				"Ocorreu um erro interno do servidor ao adicionar o comentário. Por favor, tente novamente.",
		};
	}
}
