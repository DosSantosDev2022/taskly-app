import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

const bodySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
})

export async function POST(req: Request) {
  const body = await req.json()
  const { email, code } = bodySchema.parse(body)

  const user = await db.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  const resetCode = await db.passwordResetCode.findFirst({
    where: {
      userId: user.id,
      code,
      expiresAt: { gte: new Date() }, // ainda válido
      used: false,
    },
  })

  if (!resetCode) {
    return NextResponse.json({ error: 'Código inválido ou expirado' }, { status: 400 })
  }

  const token = randomUUID()

  await db.passwordResetCode.update({
    where: { id: resetCode.id },
    data: { used: true },
  })

  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 min
    },
  })

  return NextResponse.json({ token })
}
