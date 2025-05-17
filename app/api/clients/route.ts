import {NextResponse} from 'next/server'
import {db} from '@/lib/prisma'
import type { Client } from '@/@types/prismaSchema'
import  { ClientStatus, type Prisma } from '@prisma/client'

export async function GET (request: Request) {
  try {

     const {searchParams} = new URL(request.url)
     const page = Number.parseInt(searchParams.get('page') || '1',10)
     const limit = Number.parseInt(searchParams.get('limit') || '10', 10)
     const offset = (page - 1) * limit

     const search = searchParams.get('search')?.toLowerCase() || ''
     const state = searchParams.get('state') || ''
     const city = searchParams.get('city') || ''
     const status = searchParams.get('status') || ''
     const filters: Prisma.ClientWhereInput = {}
   
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

     const statusValues = status
     .split(',')
     .filter((s): s is ClientStatus => Object.values(ClientStatus).includes(s as ClientStatus))

     if (statusValues.length > 0) {
      filters.status = {
        in: statusValues,
      }
    }

     const where = Object.keys(filters).length ? filters : undefined

    const [clients, total] = await Promise.all([
          db.client.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: {createdAt: 'desc'},
            include: {
              projects: true,
            },
            }) as Promise<Client[]>,
            db.client.count({
              where,
            })
        ])

     return NextResponse.json({
      clients,
      total,
      page,
      limit
    })
  } catch(error) {
     console.error('[GET_CLIENTS_ERROR]', error)
     return NextResponse.json(
      {error: 'Erro ao buscar clients'},
      {status: 500}
     )
  }
}