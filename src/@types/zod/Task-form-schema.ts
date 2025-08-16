import z from "zod";

/**
 * @schema createTaskSchema
 * @description Esquema Zod para validação dos dados de entrada para criação de uma nova tarefa.
 * Inclui validações para o ID do projeto, título, descrição e status da tarefa.
 */
export const TaskSchema = z.object({
	/**
	 * @property {string} projectId - ID do projeto ao qual a tarefa pertence.
	 * @description Obrigatório, deve ser uma string não vazia.
	 */
	projectId: z
		.string({ error: "O ID do projeto é obrigatório." })
		.min(1, "ID do projeto inválido.")
		.trim(),
	/**
	 * @property {string} title - Título da tarefa.
	 * @description Obrigatório, com mínimo de 1 e máximo de 255 caracteres.
	 */
	title: z
		.string()
		.min(1, "O título da tarefa é obrigatório.")
		.max(255, "O título é muito longo (máximo 255 caracteres).")
		.trim(),
	/**
	 * @property {string} description - Descrição da tarefa.
	 * @description Obrigatória, com mínimo de 1 e máximo de 1000 caracteres.
	 */
	description: z.string().min(1, "A descrição da tarefa é obrigatória.").trim(),
	/**
	 * @property {("PENDING" | "IN_PROGRESS" | "COMPLETED")} status - Status da tarefa.
	 * @description Obrigatório, deve ser um dos valores pré-definidos para o status.
	 */
	status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"], {
		message: "Status da tarefa inválido.",
	}),
});

/**
 * @typedef {z.infer<typeof createTaskSchema>} CreateTaskInput
 * @description Tipo inferido do esquema de criação de tarefa para uso em Server Actions ou funções.
 */
export type CreateTaskInput = z.infer<typeof TaskSchema>;
