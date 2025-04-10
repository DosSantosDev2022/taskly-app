import { db } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST (req: Request) {
  try {
   const {token} = await req.json()

   if(!token) {
    return NextResponse.json({message: 'Token inválido'}, {status: 400})
   }

   const user = await db.user.findFirst({
    where: {verificationToken: token}
   })

   if(!user) {
    return NextResponse.json({message: 'Token não encontrado'}, {status: 400})
   }

   await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null
    }
   })
   return NextResponse.json({message: 'E-mail verificado com sucesso !'})
  } catch (error) {
    console.error('Erro ao verificar e-mail', error)
    return NextResponse.json({message: 'Internal server error'}, {status: 500})

  }
}