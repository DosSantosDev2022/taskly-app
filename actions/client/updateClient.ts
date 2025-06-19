'use server'

import { db } from '@/lib/prisma'
import { clientSchema } from '@/@types/zodSchemas'
import { revalidatePath } from 'next/cache'


export async function updateClient(id: string, formData: unknown) {
  try {
     const data = clientSchema.parse(formData)
     
     const updateClient = await db.client.update({
      where: {id},
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        state: data.state,
        city: data.city,
        zipcode: data.zipcode,
        status: data.status
      }
     })

      revalidatePath('/clients')
     

      return{success: true, data: updateClient}

  } catch(error) {
     console.error('UPDATE_CLIENT_ERROR',error)
     return {
      success: false,
      message: 'Erro ao atualizar dados do cliente, verofique !'
     }
  }
}