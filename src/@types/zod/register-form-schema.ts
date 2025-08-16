import { z } from "zod";

/**
 * @module Schemas
 * @description Contém esquemas de validação Zod para diferentes formulários da aplicação.
 * Este módulo centraliza as definições de schemas para garantir consistência e reusabilidade.
 */

/**
 * @constant
 * @name PASSWORD_MIN_LENGTH
 * @type {number}
 * @description Comprimento mínimo exigido para senhas, promovendo segurança.
 */
export const PASSWORD_MIN_LENGTH = 8;

/**
 * @constant
 * @name registerSchema
 * @description Esquema de validação Zod para o formulário de registro de usuário.
 * Este esquema garante que todos os dados de entrada para o registro (nome, e-mail, senha e confirmação de senha)
 * atendam aos requisitos de formato, presença e segurança.
 *
 * @property {z.ZodString} name - Valida o nome do usuário.
 * - Deve ser uma string.
 * - Não pode ser vazio (`.min(1)`).
 * - Espaços em branco serão removidos (`.trim()`).
 *
 * @property {z.ZodString} email - Valida o e-mail do usuário.
 * - Deve ser uma string.
 * - Deve ser um e-mail válido (`.email()`).
 * - Não pode ser vazio (`.min(1)`).
 * - Espaços em branco serão removidos (`.trim()`).
 *
 * @property {z.ZodString} password - Valida a senha do usuário.
 * - Deve ser uma string.
 * - Deve ter no mínimo `PASSWORD_MIN_LENGTH` caracteres (`.min()`).
 * - Deve conter pelo menos uma letra maiúscula (`.regex(/[A-Z]/)`).
 * - Deve conter pelo menos um caractere especial (`.regex(/[^a-zA-Z0-9]/)`).
 * - Espaços em branco serão removidos (`.trim()`).
 *
 * @property {z.ZodString} confirmPassword - Valida a confirmação da senha.
 * - Deve ser uma string.
 * - Não pode ser vazio (`.min(1)`).
 * - Espaços em branco serão removidos (`.trim()`).
 *
 * @refines As senhas `password` e `confirmPassword` devem ser idênticas.
 * Se não coincidirem, a mensagem de erro "As senhas não coincidem." será atribuída ao campo `confirmPassword`.
 */
export const registerSchema = z
	.object({
		name: z.string().trim().min(1, { message: "O nome é obrigatório." }),

		email: z
			.string()
			.trim()
			.email({ message: "O e-mail é obrigatório." })
			.min(1, { message: "O e-mail é obrigatório." }),

		password: z
			.string()
			.trim()
			.min(1, { message: "A senha é obrigatória." })
			.min(PASSWORD_MIN_LENGTH, {
				message: `A senha deve ter no mínimo ${PASSWORD_MIN_LENGTH} caracteres.`,
			})
			.regex(/[A-Z]/, {
				message: "A senha deve conter pelo menos uma letra maiúscula.",
			})
			.regex(/[^a-zA-Z0-9]/, {
				message: "A senha deve conter pelo menos um caractere especial.",
			}),

		confirmPassword: z
			.string()
			.min(1, { message: "A confirmação da senha é obrigatória." })
			.trim()
			.min(1, { message: "A confirmação da senha não pode ser vazia." }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem.",
		path: ["confirmPassword"],
	});

/**
 * @typedef {z.infer<typeof registerSchema>} RegisterFormInputs
 * @description Tipo TypeScript inferido a partir do `registerSchema` do Zod,
 * representando a estrutura dos dados de entrada para o formulário de registro.
 */
export type RegisterFormInputs = z.infer<typeof registerSchema>;
