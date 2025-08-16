import z from "zod";

/**
 * @schema backendFormSchema
 * @description Esquema Zod para validação dos dados de entrada de formulários de projeto no backend (Server Actions).
 * É mais flexível em relação a campos opcionais que podem ser tratados no frontend,
 * mas mantém validações essenciais para integridade dos dados.
 * Diferencia-se por usar `z.coerce.number()` para o preço.
 */
export const backendFormSchema = z.object({
	/**
	 * @property {string} name - Nome do projeto.
	 * @description Obrigatório, sem validações de min/max aqui, pois o frontend já deve garantir.
	 */
	name: z
		.string()
		.min(2, "O nome do projeto é obrigatório.") // Mantido para segurança
		.max(50, "O nome do projeto não pode exceder 50 caracteres.") // Mantido para segurança
		.trim(),
	/**
	 * @property {string} description - Descrição do projeto.
	 * @description Campo opcional, validado para string e com `transform` para `undefined`.
	 */
	description: z
		.string()
		.max(5000, "A descrição não pode ter mais de 5000 caracteres.")
		.optional()
		.or(z.literal(""))
		.transform((d) => (d === "" ? undefined : d)),
	/**
	 * @property {("WEB" | "MOBILE" | "SISTEMA")} type - Tipo do projeto.
	 * @description Obrigatório, validado contra o enum.
	 */
	type: z.enum(["WEB", "MOBILE", "SISTEMA"], {
		message: "Selecione um tipo de projeto válido (Web, Mobile, Sistema).",
	}),
	/**
	 * @property {Date} deadlineDate - Data limite do projeto.
	 * @description Obrigatória e deve ser uma data válida.
	 */
	deadlineDate: z.date({
		error: "A data de prazo é obrigatória.",
	}),
	/**
	 * @property {("PENDING" | "IN_PROGRESS" | "COMPLETED")} status - Status do projeto.
	 * @description Obrigatório, validado contra o enum.
	 */
	status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"], {
		message: "Status da tarefa inválido.",
	}),
	/**
	 * @property {string} clientId - ID do cliente associado.
	 * @description Campo opcional.
	 */
	clientId: z.string().optional().or(z.literal("")),
	/**
	 * @property {number} price - Preço do projeto.
	 * @description Obrigatório, deve ser um número não negativo.
	 * Usa `z.coerce.number()` para converter string para número, comum em formulários.
	 */
	price: z.coerce.number().min(0, "O preço é obrigatório."),
	/**
	 * @property {string} contractUrl - URL do contrato.
	 * @description Campo opcional, transformado para `undefined` se vazio.
	 */
	contractUrl: z.string().optional().or(z.literal("")),
	/**
	 * @property {string} contractFileName - Nome do arquivo do contrato.
	 * @description Campo opcional, transformado para `undefined` se vazio.
	 */
	contractFileName: z.string().optional().or(z.literal("")),
});
