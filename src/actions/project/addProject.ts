"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/prisma";
import { backendFormSchema } from "@/@types/forms/projectSchema";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
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

// A função agora retorna Promise<OurActionResponse>
export async function createProject(
	formData: FormData,
): Promise<OurActionResponse> {
	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		console.error("Server Action: Usuário não autenticado.");
		// Em vez de throw new Error, retorne um objeto de erro
		return { success: false, message: "Usuário não autenticado." };
	}
	const userId = session.user.id;

	const name = formData.get("name") as string;
	const description = formData.get("description") as string;
	const type = formData.get("type") as string;
	const status = formData.get("status") as string;
	const deadlineDateString = formData.get("deadlineDate") as string | null;
	const clientId = formData.get("clientId") as string | null;
	const priceStr = formData.get("price");

	// Zod, por padrão, espera `undefined` para campos opcionais que não foram fornecidos,
	// e não `null`. Ajuste aqui para compatibilidade.
	const deadlineDate = deadlineDateString
		? new Date(deadlineDateString)
		: undefined;
	const parsedClientId = clientId || undefined; // Converte string vazia ou null para undefined

	// Bloco try-catch para capturar erros durante a validação e interação com o DB
	try {
		const validatedFields = backendFormSchema.safeParse({
			name,
			description: description || undefined,
			type,
			status,
			deadlineDate: deadlineDate,
			clientId: parsedClientId, // Usar parsedClientId aqui
			price: priceStr,
		});

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

		const {
			name: validatedName,
			description: validatedDescription,
			type: validatedType,
			status: validatedStatus,
			deadlineDate: validatedDeadlineDate,
			clientId: validatedClientId,
			price: validatedPrice,
		} = validatedFields.data;

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

		console.log(
			"Server Action: Projeto criado com sucesso! Revalidando paths...",
		);
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
