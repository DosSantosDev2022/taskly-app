"use server";

import { backendFormSchema } from "@/@types/zod";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface CreateProjectActionResponse {
	success: boolean;
	message?: string;
	errors?: Record<string, string>;
}

/**
 * @function createProjectAction
 * @description Server Action para criar um novo projeto.
 * @param {FormData} formData - Dados do formulário enviados pelo cliente.
 * @returns {Promise<CreateProjectActionResponse>} - Retorna um objeto com o status da operação e mensagens de erro, se houver.
 * @throws {Error} - Lança erros genéricos ou específicos do Prisma.
 */
export async function createProjectAction(
	formData: FormData,
): Promise<CreateProjectActionResponse> {
	// Obtém a sessão do usuário autenticado
	const session = await getServerSession(authOptions);
	// Verifica se o usuário está autenticado
	if (!session?.user?.id) {
		console.error("Server Action: Usuário não autenticado.");
		// Em vez de throw new Error, retorne um objeto de erro
		return { success: false, message: "Usuário não autenticado." };
	}
	// Obtém o ID do usuário da sessão
	const userId = session.user.id;

	// Extrai os campos do FormData
	const name = formData.get("name") as string;
	const description = formData.get("description") as string;
	const type = formData.get("type") as string;
	const status = formData.get("status") as string;
	const deadlineDateString = formData.get("deadlineDate") as string | null;
	const clientId = formData.get("clientId") as string | null;
	const priceStr = formData.get("price");

	// Valida se o campo priceStr é uma string válida
	const deadlineDate = deadlineDateString
		? new Date(deadlineDateString)
		: undefined;
	const parsedClientId = clientId || undefined;

	try {
		// Valida os campos usando o schema Zod
		const validatedFields = backendFormSchema.safeParse({
			name,
			description: description || undefined,
			type,
			status,
			deadlineDate: deadlineDate,
			clientId: parsedClientId,
			price: priceStr,
		});

		// Verifica se a validação falhou
		if (!validatedFields.success) {
			const fieldErrors = validatedFields.error.flatten().fieldErrors;
			const formattedErrors: Record<string, string> = {};

			// Mapeia os erros para um formato simples
			Object.keys(fieldErrors).forEach((key) => {
				const errorMessages = fieldErrors[key as keyof typeof fieldErrors];
				if (errorMessages && errorMessages.length > 0) {
					formattedErrors[key] = errorMessages[0];
				}
			});

			console.error("Server Action: Validação Zod falhou:", formattedErrors);
			// Retorne o objeto de erro com os campos específicos
			return {
				success: false,
				message: "Dados do formulário inválidos. Verifique os campos.",
				errors: formattedErrors,
			};
		}
		// Se a validação for bem-sucedida, extrai os dados validados
		const {
			name: validatedName,
			description: validatedDescription,
			type: validatedType,
			status: validatedStatus,
			deadlineDate: validatedDeadlineDate,
			clientId: validatedClientId,
			price: validatedPrice,
		} = validatedFields.data;

		// Cria o novo projeto no banco de dados
		await db.project.create({
			data: {
				name: validatedName,
				description: validatedDescription,
				type: validatedType,
				status: validatedStatus,
				userId: userId,
				deadlineDate: validatedDeadlineDate,
				clientId: validatedClientId,
				price: validatedPrice,
			},
		});

		// Revalida as rotas para refletir a criação do novo projeto
		revalidatePath("/projects");
		revalidatePath("/dashboard");

		return { success: true, message: "Projeto criado com sucesso!" };
	} catch (error: unknown) {
		// Capture o tipo 'unknown' para tratamento seguro
		console.error("Server Action: Erro ao criar projeto:", error);

		// Tratamento de erros específicos do Prisma
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === "P2003") {
				// Foreign key constraint failed (e.g., clientId does not exist)
				return {
					success: false,
					message: "O cliente selecionado não existe ou é inválido.",
					errors: { clientId: "Cliente inválido." },
				};
			}
			// Adicione outros códigos de erro Prisma conforme a necessidade (ex: P2002 para unique constraint)
			return {
				success: false,
				message: `Erro no banco de dados: ${error.message}`,
			};
		}

		// Erros genéricos ou de tipo 'Error'
		if (error instanceof Error) {
			return {
				success: false,
				message: error.message || "Falha ao criar o projeto.",
			};
		}

		// Para erros totalmente inesperados
		return {
			success: false,
			message: "Ocorreu um erro inesperado ao criar o projeto.",
		};
	}
}
