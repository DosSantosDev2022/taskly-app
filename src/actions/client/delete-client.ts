// src/actions/client/deleteClient.ts
"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

/**
 * @interface OurActionResponse
 * @description Define a estrutura de resposta padrão para as Server Actions.
 * @property {boolean} success - Indica se a operação foi bem-sucedida.
 * @property {string} [message] - Mensagem descritiva do resultado da operação (sucesso ou erro geral).
 * @property {Record<string, string>} [errors] - Objeto contendo mensagens de erro por campo para validação.
 */
interface OurActionResponse {
	success: boolean;
	message?: string;
	errors?: Record<string, string>;
}

export async function deleteClient(
	formData: FormData,
): Promise<OurActionResponse> {
	console.log("Server Action: deleteClient iniciada.");

	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		console.error("Server Action: Usuário não autenticado.");
		return { success: false, message: "Usuário não autenticado." };
	}
	const userId = session.user.id;
	console.log("Server Action: Usuário autenticado, ID:", userId);

	const clientId = formData.get("clientId") as string;

	// 1. Validação Simples do ID
	if (!clientId || typeof clientId !== "string") {
		console.error("Server Action: ID do cliente inválido ou ausente.");
		return { success: false, message: "ID do cliente inválido ou ausente." };
	}

	try {
		// 2. Verificar se o cliente pertence ao usuário logado (SEGURANÇA!)
		const clientToDelete = await db.client.findUnique({
			where: {
				id: clientId,
			},
		});

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

		// 3. Deletar o cliente
		await db.client.delete({
			where: {
				id: clientId,
			},
		});

		console.log(
			`Server Action: Cliente com ID ${clientId} deletado com sucesso!`,
		);
		revalidatePath("/clients"); // Revalida a página de clientes para refletir a exclusão
		revalidatePath("/projects"); // Revalida também se projetos dependem dos clientes

		return { success: true, message: "Cliente excluído com sucesso!" };
	} catch (error: unknown) {
		console.error("Server Action: Erro ao deletar cliente:", error);

		if (error instanceof PrismaClientKnownRequestError) {
			console.log("Server Action: Código do erro do Prisma:", error.code); // <-- LOG CHAVE!

			// P2025: Record to delete does not exist. (Menos provável aqui devido ao findUnique acima)
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

		if (error instanceof Error) {
			return {
				success: false,
				message: error.message || "Falha ao excluir o cliente.",
			};
		}

		return {
			success: false,
			message: "Ocorreu um erro inesperado ao excluir o cliente.",
		};
	}
}
