'use server'

import { db } from '@/lib/prisma'
import { projectSchema } from '@/@types/zodSchemas'
import { revalidatePath } from 'next/cache'


export async function updateProject(projectId: string, formData: unknown) {
  try {
     const data = projectSchema.parse(formData)
     
     const updateProject = await db.project.update({
      where: {id: projectId},
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate,
        clientId: data.clientId || undefined,
			  teamId: data.teamId || undefined,
        ownerId: data.ownerId
      }
     })

      revalidatePath('/projects')

      return{success: true, data: updateProject}

  } catch(error) {
     console.error('UPDATE_CLIENT_ERROR',error)
     return {
      success: false,
      message: 'Erro ao atualizar dados do cliente, verofique !'
     }
  }
}