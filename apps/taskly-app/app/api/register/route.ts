import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/prisma'
import { randomBytes } from 'node:crypto'



export async function POST(req: Request) {
	try {
		const { name, email, password } = await req.json()

		// verifica se os campos foram preenchidos
		if (!name || !email || !password) {
			return NextResponse.json(
				{ message: 'Campos obrigatórios' },
				{ status: 400 },
			)
		}

		// verifica se o usuário já existe
		const userExists = await db.user.findUnique({ where: { email } })
		if (userExists) {
			return NextResponse.json(
				{ message: 'Usuário já cadastrado' },
				{ status: 400 },
			)
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		// gera token de verificação seguro
		const verificationToken = randomBytes(32).toString('hex')

		// cria o usuário no banco
		const user = await db.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				verificationToken,
				emailVerified: null,
			},
		})

		// envia o e-mail de verificação com resend
		const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
		const verifyUrl = `${baseUrl}/verify-email?token=${verificationToken}`
    console.log('🔗 Link de verificação:', verifyUrl)
		
		await fetch(`${process.env.NEXT_PUBLIC_URL}/api/verification-email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: user.name,
				email: user.email,
				token: user.verificationToken
			}),
		})

		return NextResponse.json(user, { status: 201 })
	} catch (error) {
		console.error('Erro ao cadastrar usuário', error)
		return NextResponse.json(
			{ message: 'Erro interno do servidor' },
			{ status: 500 },
		)
	}
}
