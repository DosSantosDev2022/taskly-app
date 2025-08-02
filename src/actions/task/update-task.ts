"use server";

import { db } from "@/lib/prisma";
import { z, ZodError } from "zod";
import { revalidatePath } from "next/cache";

// --- Definição do Schema de Validação com Zod ---
/**
 * @const updateTaskSchema
 * @description Schema de validação Zod para os dados de entrada ao atualizar uma tarefa.
 * Garante que o `title` seja obrigatório e tenha um tamanho limitado,
 * e que a `description` seja opcional e tenha um tamanho limitado,
 * transformando strings vazias em `null` para consistência com o banco de dados.
 */
const updateTaskSchema = z.object({
	title: z
		.string()
		.min(1, "O título é obrigatório.")
		.max(100, "O título não pode ter mais de 100 caracteres."),
	description: z
		.string()
		.max(500, "A descrição não pode ter mais de 500 caracteres.")
		.nullable() // Permite que a descrição seja nula
		.transform((val) => (val === "" ? null : val)), // Converte string vazia para null
});

/**
 * @type UpdateTaskInput
 * @description Tipo inferido do schema Zod para os dados de entrada da Server Action `updateTask`.
 */
type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

/**
 * @function updateTask
 * @description Server Action para atualizar uma tarefa existente no banco de dados.
 * Valida os dados de entrada, executa a atualização via Prisma e revalida o cache
 * da página do projeto associado à tarefa.
 *
 * @param {string} taskId - O ID único da tarefa a ser atualizada.
 * @param {UpdateTaskInput} data - Um objeto contendo os dados `title` e `description` da tarefa.
 * @returns {Promise<{ success: boolean; message?: string; errors?: Zod.inferFlattenedErrors<typeof updateTaskSchema>['fieldErrors'] }>}
 * Um objeto indicando o status da operação (sucesso/falha), uma mensagem e, em caso de falha, os erros de validação.
 */
export async function updateTask(taskId: string, data: UpdateTaskInput) {
	try {
		// 1. Validação dos dados de entrada
		const validatedData = updateTaskSchema.safeParse(data);

		// Se a validação falhar, retorna um objeto de erro padronizado
		if (!validatedData.success) {
			console.error(
				"Erro de validação ao atualizar tarefa:",
				validatedData.error.flatten().fieldErrors,
			);
			return {
				success: false,
				message: "Dados de entrada inválidos. Por favor, verifique os campos.",
				errors: validatedData.error.flatten().fieldErrors,
			};
		}

		const { title, description } = validatedData.data;

		// 2. Atualização da tarefa no banco de dados via Prisma
		const updatedTask = await db.task.update({
			where: { id: taskId }, // Filtra a tarefa pelo ID fornecido
			data: {
				title,
				description,
				updatedAt: new Date(), // Atualiza o timestamp da última modificação
			},
			select: {
				projectId: true, // Seleciona apenas o `projectId` para uso na revalidação
			},
		});

		// 3. Revalidação do cache
		// Revalida a rota da página do projeto pai para garantir que a lista de tarefas
		// ou os detalhes da tarefa na página do projeto mostrem os dados atualizados.
		revalidatePath(`/projects/${updatedTask.projectId}`);

		// 4. Retorna sucesso
		return { success: true, message: "Tarefa atualizada com sucesso!" };
	} catch (error) {
		// 5. Tratamento de erros
		console.error("Falha ao atualizar tarefa:", error);

		// Você pode adicionar tratamento de erros mais granular aqui,
		// como verificar `error.code` para erros específicos do Prisma (ex: P2025 para registro não encontrado).
		if (error instanceof ZodError) {
			// Embora o `safeParse` já capture ZodErrors, esta é uma salvaguarda
			return {
				success: false,
				message: "Erro de validação ao processar os dados.",
				errors: error.flatten().fieldErrors,
			};
		}

		// Retorna uma mensagem de erro genérica para outros tipos de falhas
		return {
			success: false,
			message: "Ocorreu um erro interno ao atualizar a tarefa.",
		};
	}
}
