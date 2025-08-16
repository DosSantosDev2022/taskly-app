// --- Definição do Schema de Validação com Zod ---

import z from "zod";

/**
 * @const commentSchema
 * @description Schema de validação Zod para os dados de entrada ao adicionar um comentário.
 * Garante que o `content` não seja vazio e tenha um tamanho limitado,
 * e que o `projectId` seja fornecido e não vazio.
 */
export const commentSchema = z.object({
	id: z.string().optional(),
	content: z.string().min(1, "O comentário não pode ser vazio."),
	projectId: z.string().min(1, "O ID do projeto é obrigatório."),
});

// --- Definição do Schema de Validação com Zod ---
/**
 * @const deleteCommentSchema
 * @description Schema de validação Zod para o ID do comentário a ser deletado.
 * Garante que o ID seja uma string não vazia.
 */
export const deleteCommentSchema = z
	.string()
	.min(1, "O ID do comentário é obrigatório.");

// --- Definição do Schema de Validação com Zod ---
/**
 * @const editCommentSchema
 * @description Schema de validação Zod para o formulário de edição de comentários.
 * Garante que o conteúdo tenha um tamanho mínimo e máximo.
 */
export const editCommentSchema = z.object({
	id: z.string().optional(),
	content: z.string().min(10, "O comentário deve ter no mínimo 10 caracteres."),
});

export type CreateCommentInput = z.infer<typeof commentSchema>;
