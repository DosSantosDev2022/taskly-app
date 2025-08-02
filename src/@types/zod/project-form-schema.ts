// IMPORTANTE: Importar ProjectStatus do Prisma Client

import z from "zod";

/**
 * @schema formSchema
 * @description Esquema Zod para validação de formulários de criação/edição de projetos no frontend.
 * Inclui validação para todos os campos relevantes do projeto, excluindo 'images' que é tratado separadamente.
 */
export const formSchema = z.object({
	/**
	 * @property {string} name - Nome do projeto.
	 * @description Deve ter pelo menos 2 caracteres e no máximo 255. Campo obrigatório.
	 */
	name: z
		.string({ error: "O nome do projeto é obrigatório." })
		.min(2, "O nome do projeto deve ter pelo menos 2 caracteres.")
		.max(255, "O nome do projeto não pode exceder 255 caracteres.") // Aumentei o limite para consistência com o backend
		.trim(),

	/**
	 * @property {string} description - Descrição detalhada do projeto.
	 * @description Campo opcional, com no máximo 5000 caracteres.
	 * Permite string vazia.
	 */
	description: z
		.string()
		.max(5000, "A descrição não pode ter mais de 5000 caracteres."),

	/**
	 * @property {("WEB" | "MOBILE" | "SISTEMA")} type - Tipo do projeto.
	 * @description Deve ser um dos valores pré-definidos: "WEB", "MOBILE", "SISTEMA". Campo obrigatório.
	 */
	type: z.enum(["WEB", "MOBILE", "SISTEMA"], {
		message: "Selecione um tipo de projeto válido (Web, Mobile, Sistema).",
	}),

	/**
	 * @property {Date} deadlineDate - Data limite para conclusão do projeto.
	 * @description Deve ser uma data válida. Campo obrigatório.
	 */
	deadlineDate: z.date({
		error: "A data de prazo é obrigatória.",
	}),

	/**
	 * @property {("PENDING" | "IN_PROGRESS" | "COMPLETED")} status - Status atual do projeto.
	 * @description Deve ser um dos valores pré-definidos: "PENDING", "IN_PROGRESS", "COMPLETED". Campo obrigatório.
	 */
	status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"], {
		message:
			"Status da tarefa inválido. Selecione entre PENDING, IN_PROGRESS, COMPLETED.",
	}),

	/**
	 * @property {any} images - Dados de imagem (tratamento de arquivo complexo, validação no servidor).
	 * @description Campo opcional.
	 */
	images: z.any().optional(), // Validação de arquivos é complexa, faremos no servidor

	/**
	 * @property {string} clientId - ID do cliente associado ao projeto.
	 * @description Campo opcional. Se presente, deve ser um ID de string válido.
	 * Permite string vazia.
	 */
	clientId: z
		.string({ error: "O ID do cliente deve ser uma string." })
		.optional()
		.or(z.literal("")),

	/**
	 * @property {number} price - Preço do projeto.
	 * @description Deve ser um número não negativo. Campo obrigatório.
	 */
	price: z
		.number({
			error: "O preço é obrigatório.",
		})
		.min(0, "O preço não pode ser negativo.")
		.refine((value) => value !== undefined && value !== null, {
			message: "O preço é obrigatório.", // Embora redundantemente verificado pelo required_error, pode ser útil para Edge Cases
		}),

	/**
	 * @property {string} contractUrl - URL do contrato do projeto.
	 * @description Campo opcional. Permite string vazia.
	 */
	contractUrl: z.string().optional().or(z.literal("")),

	/**
	 * @property {string} contractFileName - Nome do arquivo do contrato.
	 * @description Campo opcional. Permite string vazia.
	 */
	contractFileName: z.string().optional().or(z.literal("")),
});

/**
 * @typedef {z.infer<typeof formSchema>} ProjectFormValues
 * @description Tipo inferido do esquema de formulário de projeto para uso no frontend.
 */
export type ProjectFormValues = z.infer<typeof formSchema>;
