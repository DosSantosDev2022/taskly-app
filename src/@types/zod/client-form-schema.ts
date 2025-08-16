import { z } from "zod";

/**
 * @namespace Schemas
 * @description Contém os esquemas de validação Zod para diferentes entidades da aplicação.
 */

/**
 * @schema clientFormSchema
 * @description Esquema Zod para validação dos dados de entrada de formulários de cliente no frontend.
 * Garante que os campos de nome, email e telefone sigam os formatos e restrições esperados.
 */
export const clientFormSchema = z.object({
	/**
	 * @property {string} name - Nome do cliente.
	 * @description Deve ter no mínimo 2 e no máximo 100 caracteres. Campo obrigatório.
	 */
	name: z
		.string()
		.min(2, "O nome do cliente é obrigatório.")
		.max(30, "O nome não pode exceder 30 caracteres.")
		.trim(), // Adicionado .trim() para remover espaços em branco no início/fim

	/**
	 * @property {string} email - Endereço de e-mail do cliente.
	 * @description Deve ser um formato de e-mail válido, com no máximo 255 caracteres. Campo opcional.
	 * Permite string vazia.
	 */
	email: z
		.string()
		.email("Por favor, insira um endereço de e-mail válido.")
		.max(255, "O e-mail não pode exceder 255 caracteres."),
	/**
	 * @property {string} phone - Número de telefone do cliente.
	 * @description Deve ter no máximo 20 caracteres. Campo opcional.
	 * Permite string vazia.
	 */
	phone: z.string().max(20, " telefone é obrigatório"),
});

export type clientFormType = z.infer<typeof clientFormSchema>;
