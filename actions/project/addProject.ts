'use server'

import { projectSchema } from '@/@types/zodSchemas'
import { db } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addProject(formData: unknown) {
	const result = projectSchema.safeParse(formData)

	if (!result.success) {
		return {
			success: false,
			errors: result.error.flatten().fieldErrors,
		}
	}

	const { name, description, ownerId,clientId,teamId, status } = result.data

	try {
		await db.project.create({
			data: {
				name,
				description,
				clientId,
				teamId,
        ownerId,
				status,
			},
		})

		revalidatePath('/projects')

		return {
			success: true,
			message: 'Cliente cadastrado com sucesso',
		}
	} catch (error) {
		console.error('Erro ao cadastrar cliente:', error)
		return {
			success: false,
			message: 'Erro ao cadastrar cliente. Tente novamente.',
		}
	}
}
