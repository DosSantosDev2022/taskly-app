'use server'
import { db } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const clientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  zipcode: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
})

export async function addClient(formData: unknown) {
  const result = clientSchema.safeParse(formData)
  if(!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors
    }
  }

  const {name,email,phone,address,zipcode,state,city,status} = result.data

  try {
    await db.client.create({
      data: {
        name,
        email,
        phone,
        address,
        zipcode,
        state,
        city,
        status,
      }
    })

    revalidatePath("/clients")

    return {
      success: true,
      message: 'Cliente cadastrado com sucesso'
    }
  }catch (error) {
    console.error('Erro ao cadastrar cliente:', error)
    return {
      success: false,
      message: 'Erro ao cadastrar cliente. Tente novamente.',
    }
  }
}



