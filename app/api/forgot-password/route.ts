import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/prisma'
import { Resend } from 'resend'
import {ResetPasswordEmail} from '@/components/emails/reset-password'

const resend = new Resend(process.env.RESEND_API_KEY)

const bodySchema = z.object({
  email: z.string().email()
})


export async function POST(req:Request) {
    const body = await req.json()
    const {email} = bodySchema.parse(body)

    const user = await db.user.findUnique({where:{email}})

    if(!user) {
      return NextResponse.json({error: 'Usuário não encontrado !'})
    }

    const validationCode = Math.floor(100000 + Math.random() * 900000).toString()

    await db.passwordResetCode.create({
      data: {
        userId: user.id,
        code: validationCode ,
        expiresAt: new Date(Date.now() + 1000 * 60 * 5) // 5 minutos
      }
    })

    try {
      await resend.emails.send({
        from: 'Taskly App <delivered@resend.dev>',
        to: [email],
        subject: 'Código para redefinição de senha',
        react: ResetPasswordEmail({validationCode})
      })
    } catch(error) {

    }

    return NextResponse.json({success: true})

}