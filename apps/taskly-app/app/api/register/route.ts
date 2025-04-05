import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/prisma'

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

		// cria o usuário no banco
		const user = await db.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
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
