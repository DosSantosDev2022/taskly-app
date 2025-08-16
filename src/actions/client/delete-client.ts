// src/actions/client/deleteClient.ts
"use server";

import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

/**
 * @interface OurActionResponse
 * @description Define a estrutura de resposta padrão para as Server Actions.
 * @property {boolean} success - Indica se a operação foi bem-sucedida.
 * @property {string} [message] - Mensagem descritiva do resultado da operação (sucesso ou erro geral).
 * @property {Record<string, string>} [errors] - Objeto contendo mensagens de erro por campo para validação.
 */
interface DeleteClientActionResponse {
	success: boolean;
	message?: string;
	errors?: Record<string, string>;
}

export async function deleteClient(
	formData: FormData,
): Promise<DeleteClientActionResponse> {
	// Loga o início da ação
	const session = await getServerSession(authOptions);
	// Verifica se o usuário está autenticado
	if (!session?.user?.id) {
		console.error("Server Action: Usuário não autenticado.");
		return { success: false, message: "Usuário não autenticado." };
	}
	// Extrai o ID do usuário autenticado
	const userId = session.user.id;
	// Extrai o ID do cliente do FormData
	const clientId = formData.get("clientId") as string;

	// 1. Validação Simples do ID
	if (!clientId || typeof clientId !== "string") {
		console.error("Server Action: ID do cliente inválido ou ausente.");
		return { success: false, message: "ID do cliente inválido ou ausente." };
	}

	try {
		//  Verificar se o cliente pertence ao usuário logado
		const clientToDelete = await db.client.findUnique({
			where: {
				id: clientId,
			},
		});
		// Se o cliente não for encontrado, retorna uma mensagem de erro
		if (!clientToDelete) {
			console.error(
				`Server Action: Cliente com ID ${clientId} não encontrado.`,
			);
			return { success: false, message: "Cliente não encontrado." };
		}

		// Se o cliente não pertencer ao usuário, impedir a exclusão
		if (clientToDelete.userId !== userId) {
			console.error(
				`Server Action: Tentativa de excluir cliente (${clientId}) que não pertence ao usuário (${userId}).`,
			);
			return {
				success: false,
				message: "Você não tem permissão para excluir este cliente.",
			};
		}

		// 2. Deletar o cliente
		await db.client.delete({
			where: {
				id: clientId,
			},
		});

		// 3. Revalidar as páginas que dependem dos dados do cliente
		revalidatePath("/clients");
		revalidatePath("/projects");

		return { success: true, message: "Cliente excluído com sucesso!" };

		// 4. Capturar erros específicos do Prisma
	} catch (error: unknown) {
		console.error("Server Action: Erro ao deletar cliente:", error);
		// Verifica se o erro é uma instância de PrismaClientKnownRequestError
		if (error instanceof PrismaClientKnownRequestError) {
			console.log("Server Action: Código do erro do Prisma:", error.code);

			// P2025: Record to delete does not exist.
			// Isso acontece se o cliente não for encontrado no banco de dados.
			if (error.code === "P2025") {
				return {
					success: false,
					message: "Cliente não encontrado para exclusão.",
				};
			}
			// P2003: Foreign key constraint failed.
			// Isso acontece se houver projetos ou outras entidades que dependam deste cliente.
			if (error.code === "P2003") {
				return {
					success: false,
					message:
						"Não é possível excluir o cliente. Existem projetos associados a ele.",
				};
			}
			return {
				success: false,
				message: `Erro no banco de dados: ${error.message}`,
			};
		}
		// Se o erro for uma instância de Error genérica, captura e retorna a mensagem
		if (error instanceof Error) {
			return {
				success: false,
				message: error.message || "Falha ao excluir o cliente.",
			};
		}
		// Se o erro não for reconhecido, retorna uma mensagem genérica
		return {
			success: false,
			message: "Ocorreu um erro inesperado ao excluir o cliente.",
		};
	}
}
