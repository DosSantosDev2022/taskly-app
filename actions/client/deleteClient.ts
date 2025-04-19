'use server'
import { db } from "@/lib/prisma"
import { revalidatePath } from 'next/cache'

interface DeleteClientProps {
  id: string
}

export async function DeleteClient ({id}: DeleteClientProps) {
   try {
     const clientexists = await db.client.findUnique({
       where: {id}
     })

     if(!clientexists) {
      return {
        success: false,
        message: 'Cliente não encontrado no banco de dados!'
      }
     }

     await db.client.delete({
       where: {id}
     })

     revalidatePath('/clients')

     return {
      success: true,
      message: 'Cliente deletado com sucesso !'
     }

   } catch(error) {
    console.error('Erro ao deletar cliente, verifique !', error)
     return {
      success: false,
      message: 'Erro ao deletar cliente'
     }
   }
}