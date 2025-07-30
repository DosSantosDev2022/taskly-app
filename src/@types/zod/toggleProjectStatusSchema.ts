import { ProjectStatus } from "@prisma/client";
import z from "zod";

/**
 * @schema toggleProjectStatusSchema
 * @description Esquema Zod para validação da alteração de status de um projeto.
 * Garante que o ID do projeto e o status fornecidos sejam válidos.
 */
export const toggleProjectStatusSchema = z.object({
	/**
	 * @property {string} projectId - ID único do projeto.
	 * @description Obrigatório, deve ser uma string não vazia.
	 */
	projectId: z
		.string({ error: "O ID do projeto é obrigatório." })
		.trim()
		.min(1, "ID do projeto é obrigatório."),
	/**
	 * @property {ProjectStatus} currentStatus - Status atual ou novo status do projeto.
	 * @description Deve ser um valor válido do enum `ProjectStatus` do Prisma.
	 */
	currentStatus: z.enum(ProjectStatus, {
		message: "Status do projeto inválido.",
	}),
});
