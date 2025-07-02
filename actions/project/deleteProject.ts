'use server'
import { db } from "@/lib/prisma"
import { revalidatePath } from 'next/cache'

interface DeleteProjectProps {
  projectId: string
}

export async function DeleteProject ({projectId}: DeleteProjectProps) {
   try {
     const projectexists = await db.project.findUnique({
       where: {id: projectId}
     })

     if(!projectexists) {
      return {
        success: false,
        message: 'Projeto não encontrado no banco de dados!'
      }
     }

     await db.project.delete({
       where: {id : projectId}
     })

     revalidatePath('/projects')

     return {
      success: true,
      message: 'Projeto deletado com sucesso !'
     }

   } catch(error) {
    console.error('Erro ao deletar projeto, verifique !', error)
     return {
      success: false,
      message: 'Erro ao deletar projeto'
     }
   }
}