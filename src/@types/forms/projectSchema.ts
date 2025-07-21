// src/schemas/projectSchemas.ts (ou o arquivo onde este código está)
import { z } from "zod";
// IMPORTANTE: Importar ProjectStatus do Prisma Client
import { ProjectStatus } from "@prisma/client";

// Esquema de validação com Zod atualizado com todos os campos
export const formSchema = z.object({
	name: z
		.string()
		.min(2, "O nome do projeto deve ter pelo menos 2 caracteres."),
	description: z
		.string()
		.max(500, "A descrição não pode ter mais de 500 caracteres."),
	type: z.enum(["WEB", "MOBILE", "SISTEMA"], {
		error: "Selecione um tipo.",
	}),
	deadlineDate: z.date({ error: "A data de prazo é obrigatória." }),
	status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"], {
		error: "Selecione um status.",
	}),
	images: z.any().optional(), // Validação de arquivos é complexa, faremos no servidor
	clientId: z.string({ error: "Selecione um cliente." }).optional(),
});

export const toggleProjectStatusSchema = z.object({
	projectId: z
		.string()
		.trim()
		.min(1, { message: "ID do projeto é obrigatório." }),
	currentStatus: z.nativeEnum(ProjectStatus, {
		message: "Status do projeto inválido. Selecione um status válido.",
	}),
});
