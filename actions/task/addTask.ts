'use server'

import { taskSchema, type TaskFormData } from '@/@types/zodSchemas'
import { db } from '@/lib/prisma' // Ajuste para o seu cliente do banco (por exemplo, prisma)
import { revalidatePath } from 'next/cache'

export async function addTask(formData: TaskFormData) {
  const validated = taskSchema.safeParse(formData)

  if (!validated.success) {
    throw new Error('Erro de validação dos dados.')
  }

  const { title, description, status, priority, dueDate, projectId, ownerId ,teamId} = validated.data
  try {
    await db.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate,
        projectId,
        ownerId,
        teamId: teamId !== '' ? teamId : null,
      },
    })

    // Opcional: Atualizar cache de páginas específicas
    revalidatePath('/tasks') // ou a rota onde você lista as tarefas
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error)
    throw new Error('Não foi possível adicionar a tarefa.')
  }
}
