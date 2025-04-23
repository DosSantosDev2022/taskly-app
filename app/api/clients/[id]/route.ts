import { db } from '@/lib/prisma'
import type { ClientWithProjects } from '@/@types/dataTypes'
import { NextResponse } from 'next/server'


export async function GET(_req: Request, {params}: {params: {id: string}}) {
  const {id} = params

  if(!id) {
    return NextResponse.json({error: 'Id não fornecido, verifique !'}, {status: 400})
  }

  const client = await db.client.findUnique({
    where: {id},
    include: {
      projects: true
    }
  })

  if(!client) {
    return NextResponse.json({error: 'Cliente não encontrado, verifique !'}, {status: 404})
  }

  return NextResponse.json(client)
}