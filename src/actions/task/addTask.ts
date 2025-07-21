"use server";

import {
	type CreateTaskInput,
	createTaskSchema,
} from "@/@types/forms/tasksSchema";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

/**
 * @function addTaskAction
 * @description Server Action para adicionar uma nova tarefa a um projeto no banco de dados.
 * Realiza a validação dos dados de entrada usando Zod, cria a tarefa via Prisma,
 * e revalida o cache da página do projeto associado para refletir a nova tarefa.
 *
 * @param {CreateTaskInput} values - Objeto contendo os dados da nova tarefa (projectId, title, description, status).
 * @returns {Promise<{ success: boolean; message?: string; errors?: Zod.inferFlattenedErrors<typeof createTaskSchema>['fieldErrors']; newTask?: any }>}
 * Um objeto com o status da operação, uma mensagem, erros de validação (se houver) e, em caso de sucesso, a nova tarefa criada.
 */
export async function addTaskAction(values: CreateTaskInput) {
	try {
		// 1. Validação dos dados de entrada com Zod
		// Usa `safeParse` para validar os dados e capturar erros de forma segura.
		const validation = createTaskSchema.safeParse(values);

		// Se a validação falhar, retorna um objeto de erro padronizado para o cliente.
		if (!validation.success) {
			console.error(
				"Erro de validação ao criar tarefa:",
				validation.error.flatten().fieldErrors, // Loga os erros de campo para depuração
			);
			return {
				success: false,
				message: "Dados inválidos. Por favor, verifique os campos.",
				errors: validation.error.flatten().fieldErrors,
			};
		}

		// Extrai os dados validados e tipados para uso seguro.
		const { projectId, title, description, status } = validation.data;

		// 2. Criação da nova tarefa no banco de dados via Prisma
		const newTask = await db.task.create({
			data: {
				projectId,
				title,
				// Garante que a descrição seja `null` se for uma string vazia,
				// mantendo a consistência com o schema do banco de dados.
				description: description === "" ? null : description,
				status,
				createdAt: new Date(), // Adiciona um timestamp de criação
				updatedAt: new Date(), // Adiciona um timestamp de atualização inicial
			},
		});

		// 3. Revalidação do cache
		// Revalida a rota específica do projeto para que a lista de tarefas seja atualizada
		// no lado do cliente na próxima requisição, mostrando a nova tarefa.
		revalidatePath(`/projects/${projectId}`);

		// 4. Retorna sucesso e a nova tarefa criada
		return {
			success: true,
			newTask, // Retorna a tarefa criada para que o frontend possa atualizá-la no estado local, se necessário.
			message: "Tarefa criada com sucesso!",
		};
	} catch (error) {
		// 5. Tratamento de erros gerais
		console.error("Erro inesperado ao criar tarefa:", error); // Loga o erro completo para depuração.

		// Trata erros de validação Zod que possam ter escapado (embora `safeParse` minimize isso)
		if (error instanceof ZodError) {
			return {
				success: false,
				message: "Erro de validação ao processar os dados.",
				errors: error.flatten().fieldErrors,
			};
		}

		// Retorna uma mensagem de erro genérica para qualquer outra falha no servidor.
		return {
			success: false,
			message:
				"Ocorreu um erro interno do servidor ao criar a tarefa. Por favor, tente novamente.",
			errors: { general: "Erro interno do servidor." }, // Erro geral para o formulário
		};
	}
}
