import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { z } from 'zod'
import { hash } from 'bcryptjs'

const bodySchema = z.object({
  token: z.string().uuid(),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  const body = await req.json()
  const { token, password } = bodySchema.parse(body)

  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
  })

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 400 })
  }

  const passwordHash = await hash(password, 10)

  await db.user.update({
    where: { id: resetToken.userId },
    data: { password: passwordHash },
  })

  await db.passwordResetToken.delete({ where: { token } })

  return NextResponse.json({ success: true })
}
