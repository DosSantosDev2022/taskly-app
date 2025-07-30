"use server";

import { formSchema } from "@/@types/zod/projectFormSchema"; // Schema Zod para validação
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z, { ZodError } from "zod"; // Importa ZodError para tratamento de erros mais específico

/**
 * @function updateProject
 * @description Server Action para atualizar um projeto existente no banco de dados.
 * Realiza validação dos dados de entrada usando Zod e atualiza o projeto no Prisma.
 * Após a atualização, revalida o cache da página do projeto.
 *
 * @param {string} projectId - O ID único do projeto a ser atualizado.
 * @param {FormData} formData - Os dados do formulário enviados pelo cliente.
 * @returns {Promise<{ success: boolean; errors?: any; message?: string }>} Objeto indicando sucesso/falha, erros de validação ou mensagem de erro geral.
 */
export async function updateProject(projectId: string, formData: FormData) {
	try {
		// 1. Validação dos dados de entrada com Zod
		// Converte os dados do FormData para um objeto plano que o Zod pode validar.
		const parsed = formSchema.safeParse({
			name: formData.get("name"),
			description: formData.get("description"),
			type: formData.get("type"),
			status: formData.get("status"),
			// Converte a string da data de volta para um objeto Date se existir
			deadlineDate: formData.get("deadlineDate")
				? new Date(formData.get("deadlineDate") as string)
				: undefined,
			clientId: formData.get("clientId") || undefined, // Garante undefined se vazio
			price: parseFloat(formData.get("price") as string),
		});

		// Se a validação falhar, retorna os erros para o cliente
		if (!parsed.success) {
			console.error(
				"Erro de validação ao atualizar projeto:",
				z.treeifyError(parsed.error),
			);
			// Retorna um objeto com `success: false` e os erros de campo formatados
			return {
				success: false,
				errors: z.treeifyError(parsed.error),
				message: "Dados inválidos. Por favor, verifique os campos.",
			};
		}

		// Extrai os dados validados
		const { name, description, type, status, deadlineDate, clientId, price } =
			parsed.data;

		// 2. Atualização do projeto no banco de dados via Prisma
		await db.project.update({
			where: { id: projectId }, // Condição para encontrar o projeto
			data: {
				name,
				description,
				type,
				status,
				price,
				deadlineDate,
				clientId,
				updatedAt: new Date(), // Adiciona um timestamp de atualização
			},
		});

		// 3. Revalidação do cache
		// Garante que a página do projeto atualizada seja exibida na próxima requisição
		revalidatePath(`/projects/${projectId}`);

		// 4. Retorna sucesso
		return { success: true, message: "Projeto atualizado com sucesso!" };
	} catch (error) {
		// 5. Tratamento de erros
		console.error("Falha ao atualizar projeto:", error);

		// Se o erro for uma instância de ZodError (embora safeParse já capture isso),
		// podemos tratá-lo especificamente (ex: em caso de validação manual mais à frente).
		if (error instanceof ZodError) {
			return {
				success: false,
				errors: z.treeifyError(error),
				message: "Erro de validação ao processar os dados.",
			};
		}

		// Tratamento de erros de banco de dados ou outros erros inesperados
		// Você pode verificar `error.code` para erros específicos do Prisma se precisar
		return {
			success: false,
			message: "Erro interno do servidor ao atualizar o projeto.",
		};
	}
}
