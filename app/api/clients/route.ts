import {NextResponse} from 'next/server'
import {db} from '@/lib/prisma'
import type { ClientWithProjects } from '@/@types/dataTypes'

export async function GET (request: Request) {
  try {

     const {searchParams} = new URL(request.url)
     const search = searchParams.get('search')?.toLowerCase() || ''
     const state = searchParams.get('state') || ''
     const city = searchParams.get('city') || ''
     const status = searchParams.get('status') || ''
     const filters: any = {}
   
     if (search) {
      filters.OR = [
      {name: {contains: search, mode: 'insensitive'}},
      {email: {contains: search, mode: 'insensitive'}},
      { phone: { contains: search, mode: 'insensitive' } },
      ]
     }

     if(state) {
      filters.state = state
     }

     if(city) {
      filters.city = city
     }

     if (status) {
      filters.status = { in: status.split(',') };
    }

     const where = Object.keys(filters).length ? filters : undefined

     const clients:ClientWithProjects[] = await db.client.findMany({
      where,
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