// src/actions/client/updateClientStatus.ts
"use server";

import {
	updateClientStatusSchema,
	type UpdateClientStatusInput,
} from "@/@types/zod"; // Importa o novo schema
import { db } from "@/lib/prisma"; // Certifique-se de que o caminho para o Prisma está correto
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import z, { ZodError } from "zod";

/**
 * Server Action para alterar o status de um cliente específico.
 *
 * @param data Um objeto contendo o `id` do cliente e o novo `status` ('ativo' ou 'inativo').
 * @returns Um objeto indicando sucesso ou falha, com uma mensagem e, opcionalmente, erros.
 */
export const updateClientStatus = async (data: UpdateClientStatusInput) => {
	try {
		// 1. Validação dos dados de entrada com Zod
		const validatedData = updateClientStatusSchema.parse(data);

		// 2. Converter o status para o formato do banco de dados
		const dbStatus = validatedData.status.toUpperCase() as
			| "ACTIVE"
			| "INACTIVE"; // 'ativo' -> 'ATIVO', 'inativo' -> 'INATIVO'

		// 3. Buscar o cliente para verificar se ele existe
		const existingClient = await db.client.findUnique({
			where: { id: validatedData.id },
		});

		if (!existingClient) {
			return { success: false, message: "Cliente não encontrado." };
		}

		// 4. Atualizar o status do cliente no banco de dados
		const updatedClient = await db.client.update({
			where: { id: validatedData.id },
			data: {
				status: dbStatus, // Usa o status convertido para o banco
			},
		});

		// 5. Revalidar o cache da página onde os clientes são exibidos

		revalidatePath("/dashboard");
		revalidatePath("/clients");

		return {
			success: true,
			message: `Status do cliente '${updatedClient.name}' alterado para '${validatedData.status}'.`,
		};
	} catch (error) {
		console.error("Erro na Server Action updateClientStatus:", error);

		if (error instanceof ZodError) {
			// Erro de validação Zod (dados de entrada inválidos)
			const errors = z.treeifyError(error);
			return { success: false, message: "Dados inválidos.", errors };
		} else if (
			error instanceof PrismaClientKnownRequestError &&
			error.code === "P2025"
		) {
			// Prisma erro P2025: record not found (já tratado explicitamente acima, mas bom ter aqui)
			return {
				success: false,
				message: "Cliente não encontrado para atualização.",
			};
		} else {
			// Outros erros inesperados
			return {
				success: false,
				message: "Ocorreu um erro inesperado ao atualizar o status do cliente.",
			};
		}
	}
};
