import {NextResponse} from 'next/server'
import {db} from '@/lib/prisma'
import type { ClientWithProjects } from '@/@types/dataTypes'

export async function GET () {
  try {
     const clients:ClientWithProjects[] = await db.client.findMany({
      orderBy: {createdAt: 'desc'},
      include: {
         projects: true,
       },
     })
     return NextResponse.json(clients)
  } catch(error) {
     console.error('[GET_CLIENTS_ERROR]', error)
     return NextResponse.json(
      {error: 'Erro ao buscar clients'},
      {status: 500}
     )
  }
}