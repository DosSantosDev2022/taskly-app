"use server";

import { hash } from "bcryptjs";
import db from "@/lib/prisma";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";

import VerificationEmail from "@/components/global/emails/verificationEmails";

const resend = new Resend(process.env.RESEND_API_KEY);

const registerSchema = z.object({
	name: z.string().min(1, "O nome é obrigatório."),
	email: z.string().email("E-mail inválido.").min(1, "O e-mail é obrigatório."),
	password: z
		.string()
		.min(8, "A senha deve ter no mínimo 8 caracteres.")
		.min(1, "A senha é obrigatória."),
});

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

type VerificationResult = {
	success: boolean;
	message: string;
};

/* Registro de usuário com credenciais */
export async function registerUser(
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
				emailVerified: null, // Ainda como null, será atualizado após a verificação do e-mail
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
		console.log("verificação:", verificationLink);
		try {
			// Renderiza o template de e-mail (se estiver usando React Email)

			await resend.emails.send({
				from: "Acme <onboarding@resend.dev>", // Quem envia o e-mail
				to: newUser.email, // Quem recebe o e-mail
				subject: "Verifique seu e-mail para Taskly App",
				react: VerificationEmail({
					username: newUser.name,
					verificationLink: verificationLink,
				}),
			});
			console.log(
				`E-mail de verificação enviado com sucesso para: ${newUser.email}`,
			);
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

// Verificação de e-mail após registro de usuário
export async function verifyEmailAction(
	token: string,
	email: string,
): Promise<VerificationResult> {
	try {
		const verificationToken = await db.verificationToken.findUnique({
			where: {
				identifier_token: {
					// Use o nome do campo composto definido no Prisma
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

		const updatedUser = await db.user.update({
			where: { email: email },
			data: { emailVerified: new Date() },
		});

		if (!updatedUser) {
			return { success: false, message: "Usuário não encontrado." };
		}

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
