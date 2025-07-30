// src/actions/client/updateClient.ts
"use server";

import { clientFormSchema } from "@/@types/zod/clientFormSchema"; // Reutilizaremos o mesmo schema
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
interface OurActionResponse {
	success: boolean;
	message?: string;
	errors?: Record<string, string>;
}

export async function updateClient(
	formData: FormData,
): Promise<OurActionResponse> {
	console.log("Server Action: updateClient iniciada.");

	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		console.error("Server Action: Usuário não autenticado.");
		return { success: false, message: "Usuário não autenticado." };
	}
	/* Usuário autenticado */
	const userId = session.user.id;

	const id = formData.get("id") as string; // O ID do cliente a ser atualizado
	const name = formData.get("name") as string;
	const email = formData.get("email") as string | null;
	const phone = formData.get("phone") as string | null;
	const address = formData.get("address") as string | null;
	const notes = formData.get("notes") as string | null;

	// 1. Validação do ID do Cliente
	if (!id || typeof id !== "string") {
		console.error(
			"Server Action: ID do cliente para atualização inválido ou ausente.",
		);
		return { success: false, message: "ID do cliente inválido ou ausente." };
	}

	// Transformar strings vazias em undefined para o Zod
	const transformedEmail = email === "" ? undefined : email;
	const transformedPhone = phone === "" ? undefined : phone;
	const transformedAddress = address === "" ? undefined : address;
	const transformedNotes = notes === "" ? undefined : notes;

	try {
		// Reutilizar o mesmo schema de validação para a entrada do formulário
		const validatedFields = clientFormSchema.safeParse({
			name,
			email: transformedEmail,
			phone: transformedPhone,
			address: transformedAddress,
			notes: transformedNotes,
		});

		if (!validatedFields.success) {
			const fieldErrors = validatedFields.error.flatten().fieldErrors;
			const formattedErrors: Record<string, string> = {};

			Object.keys(fieldErrors).forEach((key) => {
				const errorMessages = fieldErrors[key as keyof typeof fieldErrors];
				if (errorMessages && errorMessages.length > 0) {
					formattedErrors[key] = errorMessages[0];
				}
			});

			console.error(
				"Server Action: Validação Zod falhou na atualização:",
				formattedErrors,
			);
			return {
				success: false,
				message: "Dados do formulário inválidos. Verifique os campos.",
				errors: formattedErrors,
			};
		}

		const {
			name: validatedName,
			email: validatedEmail,
			phone: validatedPhone,
		} = validatedFields.data;

		const finalEmailForDb = validatedEmail === "" ? null : validatedEmail;
		const finalPhoneForDb = validatedPhone === "" ? null : validatedPhone;

		// 2. Verificar se o cliente existe e pertence ao usuário logado (Segurança!)
		const existingClient = await db.client.findUnique({
			where: { id: id },
		});

		if (!existingClient) {
			console.error(
				`Server Action: Cliente com ID ${id} não encontrado para atualização.`,
			);
			return {
				success: false,
				message: "Cliente não encontrado para atualização.",
			};
		}

		if (existingClient.userId !== userId) {
			console.error(
				`Server Action: Tentativa de atualizar cliente (${id}) que não pertence ao usuário (${userId}).`,
			);
			return {
				success: false,
				message: "Você não tem permissão para editar este cliente.",
			};
		}

		// 3. Realizar a atualização
		await db.client.update({
			where: { id: id },
			data: {
				name: validatedName,
				email: finalEmailForDb,
				phone: finalPhoneForDb,
			},
		});

		console.log(
			`Server Action: Cliente com ID ${id} atualizado com sucesso! Revalidando paths...`,
		);
		revalidatePath("/clients");
		revalidatePath("/projects"); // Revalide se projetos dependem da info do cliente

		return { success: true, message: "Cliente atualizado com sucesso!" };
	} catch (error: unknown) {
		console.error(
			"Server Action: Erro ao atualizar cliente no banco de dados:",
			error,
		);

		if (error instanceof PrismaClientKnownRequestError) {
			console.log("Server Action: Código do erro do Prisma:", error.code);

			if (error.code === "P2002") {
				// Erro de unicidade (ex: email duplicado)
				const errorResponse = {
					success: false,
					message: "Já existe um cliente com este email.",
					errors: { email: "Este email já está em uso." },
				};
				console.log(
					"Server Action: Retornando erro de unicidade (P2002) na atualização:",
					errorResponse,
				);
				return errorResponse;
			}
			return {
				success: false,
				message: `Erro no banco de dados: ${error.message}`,
			};
		}

		if (error instanceof Error) {
			return {
				success: false,
				message: error.message || "Falha ao atualizar o cliente.",
			};
		}

		return {
			success: false,
			message: "Ocorreu um erro inesperado ao atualizar o cliente.",
		};
	}
}
