// @/@types/zod/clientStatusSchema.ts
import { z } from "zod";

/**
 * @schema updateClientStatusSchema
 * @description Esquema Zod para validação dos dados necessários para alterar o status de um cliente.
 */
export const updateClientStatusSchema = z.object({
	/**
	 * @property {string} id - ID do cliente a ser atualizado.
	 * @description Deve ser uma string não vazia.
	 */
	id: z.string().min(1, "O ID do cliente é obrigatório."),

	/**
	 * @property {'ACTIVE' | 'INACTIVE'} status - Novo status do cliente.
	 * @description Deve ser 'ativo' ou 'inativo'.
	 */
	status: z.enum(["ACTIVE", "INACTIVE"], {
		error: "O status é obrigatório e deve ser 'ativo' ou 'inativo'.",
	}),
});

// Tipo inferido para uso em TypeScript
export type UpdateClientStatusInput = z.infer<typeof updateClientStatusSchema>;
