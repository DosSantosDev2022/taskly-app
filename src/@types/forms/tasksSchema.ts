import z from "zod";

export const createTaskSchema = z.object({
	projectId: z.string().min(1, "ID do projeto inválido."),
	title: z
		.string()
		.min(1, "O título é obrigatório.")
		.max(255, "O título é muito longo."),
	description: z
		.string()
		.min(1, "A descrição é obrigatória.")
		.max(1000, "A descrição é muito longa."),
	status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
