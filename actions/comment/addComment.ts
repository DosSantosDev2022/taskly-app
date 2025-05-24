'use server'

import { CommentSchema, type CommentFormData } from '@/@types/zodSchemas'
import { db } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function AddComment(formData: CommentFormData) {
	const validated = CommentSchema.safeParse(formData)

	if (!validated.success) {
    console.log('Erro Zod:', validated.error.flatten())
		throw new Error('Erro de validação dos dados.')
	}

	const { content, projectId, userId,taskId } = validated.data

	if (!userId) {
		throw new Error("Usuário não autenticado.")
	}
	if (!projectId && !taskId) {
		throw new Error("É necessário um projeto ou tarefa.")
	}
	

	try {
		await db.comment.create({
			data: {
				content,
				projectId,
				userId
			},
		})

    revalidatePath('/projects')
	} catch (error) {
    console.error('Erro ao adicionar commentário:', error)
    throw new Error('Não foi possível adicionar a commentário.')
  }
}
