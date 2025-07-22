"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/prisma";
import { clientFormSchema } from "@/@types/forms/clientSchema"; // Seu schema Zod para cliente
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Se você usa Next-Auth
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

export async function createClient(
	formData: FormData,
): Promise<OurActionResponse> {
	console.log("Server Action: createClient iniciada.");

	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		console.error("Server Action: Usuário não autenticado.");
		return { success: false, message: "Usuário não autenticado." };
	}
	const userId = session.user.id; // Associar o cliente ao usuário logado

	const name = formData.get("name") as string;
	const email = formData.get("email") as string | null;
	const phone = formData.get("phone") as string | null;

	try {
		const validatedFields = clientFormSchema.safeParse({
			name,
			email: email || undefined, // Zod espera undefined para campos opcionais vazios
			phone: phone || undefined,
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

			console.error("Server Action: Validação Zod falhou:", formattedErrors);
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
		revalidatePath("/clients"); // Revalida a página de clientes
		revalidatePath("/projects"); // Se os projetos usam clientes, revalide também

		return { success: true, message: "Cliente criado com sucesso!" };
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

			return {
				success: false,
				message: `Erro no banco de dados: ${error.message}`,
			};
		}

		if (error instanceof Error) {
			return {
				success: false,
				message: error.message || "Falha ao criar o cliente.",
			};
		}

		return {
			success: false,
			message: "Ocorreu um erro inesperado ao criar o cliente.",
		};
	}
}
