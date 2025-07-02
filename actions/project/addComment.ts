'use server'

import { CommentSchema, type CommentFormData } from '@/@types/zodSchemas'
import { db } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function AddCommentProject(formData: CommentFormData) {
	const validated = CommentSchema.safeParse(formData)

	if (!validated.success) {
    console.log('Erro de validação Zod ao adicionar comentário:', validated.error.flatten())
    // Lançar um erro para ser capturado no frontend
    // biome-ignore lint/style/useTemplate: <explanation>
        throw new Error('Erro de validação: ' + JSON.stringify(validated.error.flatten()))
  }

	const { content, projectId, userId } = validated.data

	try {
		await db.commentProject.create({
			data: {
				content,
				projectId,
				userId
			},
		})

    revalidatePath('/projects')
	/* revalidatePath(`/projects/${projectId}`) */

	} catch (error) {
    console.error('Erro ao adicionar commentário:', error)
    throw new Error('Não foi possível adicionar a commentário.')
  }
}
