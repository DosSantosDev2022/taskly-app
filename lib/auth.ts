import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import { db } from '@/lib/prisma'
import { compare } from 'bcryptjs'

import type { AuthOptions } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(db) as Adapter,
	providers: [
		// Login com e-mail e senha
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Senha', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error('Email e senha são obrigatórios')
				}

				const user = await db.user.findUnique({
					where: { email: credentials.email },
				})

				if (!user || !user.password) {
					throw new Error('Usuário não encontrado')
				}

				 // 🚫 Verifica se o e-mail foi verificado
				 if (!user.emailVerified) {
					throw new Error('Você precisa verificar seu e-mail antes de fazer login.')
				}

				const isPasswordValid = await compare(
					credentials.password,
					user.password,
				)

				if (!isPasswordValid) {
					throw new Error('Senha incorreta')
				}

				return {
					id: user.id,
					name: user.name,
					email: user.email,
					surname: user.surname as string
				}
			},
		}),

		// Login com Google
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			// Se for o primeiro login, user estará presente
			if (user) {
				token.id = user.id
				token.surname = user.surname ?? null
			} else if (token?.email) {
				// Se user não estiver presente (JWT sendo reutilizado), buscamos manualmente
				const dbUser = await db.user.findUnique({
					where: { email: token.email as string },
					select: { id: true, surname: true }, // 👈 só os campos que precisamos
				})
	
				if (dbUser) {
					token.id = dbUser.id
					token.surname = dbUser.surname
				}
			}
	
			return token
		},
	
		async session({ session, token }) {
			if (session.user && token) {
				session.user.id = token.id as string
				session.user.surname = token.surname as string
			}
			return session
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt',
	},
}
