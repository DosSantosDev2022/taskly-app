"use server";

import { clientFormSchema } from "@/@types/zod"; // Seu schema Zod para cliente
import { authOptions } from "@/lib/auth"; // Se você usa Next-Auth
import { db } from "@/lib/prisma";
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
interface ClientActionResponse {
	success: boolean;
	message?: string;
	errors?: Record<string, string>;
}

export async function createClient(
	formData: FormData,
): Promise<ClientActionResponse> {
	console.log("Server Action: createClient iniciada.");

	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		console.error("Server Action: Usuário não autenticado.");
		return { success: false, message: "Usuário não autenticado." };
	}

	// Extrai os dados do formulário
	const userId = session.user.id; // Associar o cliente ao usuário logado
	const name = formData.get("name") as string;
	const email = formData.get("email") as string | null;
	const phone = formData.get("phone") as string | null;

	try {
		// Validação dos campos usando Zod
		const validatedFields = clientFormSchema.safeParse({
			name,
			email: email || undefined,
			phone: phone || undefined,
		});

		// Se a validação falhar, retorna os erros formatados
		if (!validatedFields.success) {
			const fieldErrors = validatedFields.error.flatten().fieldErrors;
			const formattedErrors: Record<string, string> = {};
			// Formata os erros para retornar apenas a primeira mensagem de erro por campo
			Object.keys(fieldErrors).forEach((key) => {
				const errorMessages = fieldErrors[key as keyof typeof fieldErrors];
				if (errorMessages && errorMessages.length > 0) {
					formattedErrors[key] = errorMessages[0];
				}
			});
			// Loga os erros de validação
			console.error("Server Action: Validação Zod falhou:", formattedErrors);
			// Retorna a resposta com os erros formatados
			return {
				success: false,
				message: "Dados do formulário inválidos. Verifique os campos.",
				errors: formattedErrors,
			};
		}
		// Se a validação for bem-sucedida, extrai os dados validados
		const {
			name: validatedName,
			email: validatedEmail,
			phone: validatedPhone,
		} = validatedFields.data;

		// Cria o cliente no banco de dados
		await db.client.create({
			data: {
				name: validatedName,
				email: validatedEmail,
				phone: validatedPhone,
				userId: userId,
			},
		});

		console.log(
			"Server Action: Cliente criado com sucesso! Revalidando paths...",
		);
		// Revalida as páginas que dependem dos dados do cliente
		revalidatePath("/clients");
		revalidatePath("/projects");

		// Retorna a resposta de sucesso
		return { success: true, message: "Cliente criado com sucesso!" };

		// Se ocorrer algum erro durante a criação, captura e trata o erro
	} catch (error: unknown) {
		if (error instanceof PrismaClientKnownRequestError) {
			// Exemplo: se o email for único e tentar criar um duplicado
			if (error.code === "P2002") {
				return {
					success: false,
					message: "Já existe um cliente com este email.",
					errors: { email: "Este email já está em uso." },
				};
			}
			// Loga o erro de banco de dados
			return {
				success: false,
				message: `Erro no banco de dados: ${error.message}`,
			};
		}
		// Se o erro for uma instância de Error genérica, captura e retorna a mensagem
		if (error instanceof Error) {
			return {
				success: false,
				message: error.message || "Falha ao criar o cliente.",
			};
		}
		// Se o erro não for reconhecido, retorna uma mensagem genérica
		return {
			success: false,
			message: "Ocorreu um erro inesperado ao criar o cliente.",
		};
	}
}
