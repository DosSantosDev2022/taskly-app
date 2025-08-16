// src/actions/auth.ts

"use server";

import db from "@/lib/prisma";
import { hash } from "bcryptjs";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";

import VerificationEmail from "@/components/global/emails/verification-emails";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * @fileoverview Server Actions para autenticação de usuário (registro e verificação de e-mail).
 */

/**
 * Esquema de validação Zod para o formulário de registro de usuário.
 * Define os requisitos para nome, e-mail e senha.
 */
const registerSchema = z.object({
	name: z.string().min(1, "O nome é obrigatório."),
	email: z.string().email("E-mail inválido.").min(1, "O e-mail é obrigatório."),
	password: z
		.string()
		.min(8, "A senha deve ter no mínimo 8 caracteres.")
		.min(1, "A senha é obrigatória."),
});

/**
 * Define a estrutura do objeto de estado de formulário retornado após o registro.
 *
 * @interface RegisterFormState
 * @property {boolean} success - Indica se o registro foi bem-sucedido.
 * @property {string} message - Uma mensagem descritiva para o usuário.
 * @property {Object.<string, string>} [errors] - Objeto de erros de validação, onde a chave é o nome do campo.
 */
type RegisterFormState = {
	success: boolean;
	message: string;
	errors?: {
		name?: string;
		email?: string;
		password?: string;
		confirmPassword?: string;
		general?: string;
	};
};

/**
 * Define a estrutura do objeto de resultado retornado após a verificação de e-mail.
 *
 * @interface VerificationResult
 * @property {boolean} success - Indica se a verificação foi bem-sucedida.
 * @property {string} message - Uma mensagem descritiva para o usuário.
 */
type VerificationResult = {
	success: boolean;
	message: string;
};

/**
 * Server Action para registrar um novo usuário com credenciais (e-mail e senha).
 *
 * Este processo inclui:
 * 1. Validação dos dados do formulário de registro usando o Zod.
 * 2. Verificação se o e-mail já está em uso.
 * 3. Hashing da senha do usuário com `bcryptjs`.
 * 4. Criação do novo usuário no banco de dados.
 * 5. Geração de um token de verificação de e-mail e seu armazenamento.
 * 6. Envio de um e-mail de verificação usando Resend.
 *
 * @param {z.infer<typeof registerSchema>} formData - Os dados do formulário de registro, tipados e validados pelo Zod.
 * @returns {Promise<RegisterFormState>} O estado do formulário de registro, contendo o resultado da operação.
 */
export async function registerUserAction(
	formData: z.infer<typeof registerSchema>,
): Promise<RegisterFormState> {
	try {
		const result = registerSchema.safeParse(formData);

		if (!result.success) {
			const fieldErrors: { [key: string]: string } = {};
			result.error.issues.forEach((err) => {
				if (err.path?.[0]) {
					fieldErrors[err.path[0] as string] = err.message;
				}
			});
			return {
				success: false,
				message: "Erro de validação.",
				errors: fieldErrors,
			};
		}

		const { name, email, password } = result.data;

		const existingUserByEmail = await db.user.findUnique({
			where: { email: email },
		});

		if (existingUserByEmail) {
			return {
				success: false,
				message: "Este e-mail já está em uso.",
				errors: { email: "Este e-mail já está em uso." },
			};
		}

		const hashedPassword = await hash(password, 12);

		const newUser = await db.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				emailVerified: null,
			},
		});

		// --- Lógica de Geração, Armazenamento e ENVIO do Token de Verificação com Resend ---
		const verificationToken = uuidv4();
		const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token expira em 24 horas

		await db.verificationToken.create({
			data: {
				identifier: newUser.email,
				token: verificationToken,
				expires: expires,
			},
		});

		const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(newUser.email)}`;

		try {
			await resend.emails.send({
				from: "Acme <onboarding@resend.dev>",
				to: newUser.email,
				subject: "Verifique seu e-mail para Taskly App",
				react: VerificationEmail({
					username: newUser.name,
					verificationLink: verificationLink,
				}),
			});
		} catch (emailError) {
			console.error(
				"Erro ao enviar e-mail de verificação com Resend:",
				emailError,
			);
			return {
				success: false,
				message:
					"Registro bem-sucedido, mas houve um problema ao enviar o e-mail de verificação. Por favor, tente novamente mais tarde ou entre em contato.",
				errors: { general: "Erro ao enviar e-mail de verificação." },
			};
		}

		return {
			success: true,
			message:
				"Registro bem-sucedido! Um link de verificação foi enviado para o seu e-mail. Por favor, verifique sua caixa de entrada (e spam).",
		};
	} catch (error) {
		console.error("Erro no Server Action de registro:", error);
		return {
			success: false,
			message: "Ocorreu um erro inesperado durante o registro.",
			errors: { general: "Ocorreu um erro inesperado. Tente novamente." },
		};
	}
}

/**
 * Server Action para verificar o e-mail de um usuário.
 *
 * Este processo inclui:
 * 1. Busca o token de verificação no banco de dados.
 * 2. Valida se o token existe e se não está expirado.
 * 3. Se o token for válido, atualiza o campo `emailVerified` do usuário.
 * 4. Remove o token de verificação do banco de dados para evitar reutilização.
 *
 * @param {string} token - O token de verificação recebido via URL.
 * @param {string} email - O e-mail do usuário associado ao token.
 * @returns {Promise<VerificationResult>} Um objeto com o resultado da verificação.
 */
export async function verifyEmailAction(
	token: string,
	email: string,
): Promise<VerificationResult> {
	try {
		const verificationToken = await db.verificationToken.findUnique({
			where: {
				identifier_token: {
					identifier: email,
					token: token,
				},
			},
		});

		if (!verificationToken) {
			return {
				success: false,
				message: "Link de verificação inválido ou já utilizado.",
			};
		}

		if (new Date() > verificationToken.expires) {
			// Deleta o token expirado
			await db.verificationToken.delete({
				where: {
					identifier_token: {
						identifier: email,
						token: token,
					},
				},
			});
			return {
				success: false,
				message:
					"Link de verificação expirado. Por favor, registre-se novamente ou solicite um novo link.",
			};
		}

		// Atualiza o usuário para marcar o e-mail como verificado
		const updatedUser = await db.user.update({
			where: { email: email },
			data: { emailVerified: new Date() },
		});

		if (!updatedUser) {
			return { success: false, message: "Usuário não encontrado." };
		}

		// Deleta o token após a verificação bem-sucedida
		await db.verificationToken.delete({
			where: {
				identifier_token: {
					identifier: email,
					token: token,
				},
			},
		});

		return {
			success: true,
			message:
				"Seu e-mail foi verificado com sucesso! Agora você pode fazer login.",
		};
	} catch (error) {
		console.error("Erro no Server Action verifyEmailAction:", error);
		return {
			success: false,
			message: "Erro ao verificar e-mail. Tente novamente.",
		};
	}
}
