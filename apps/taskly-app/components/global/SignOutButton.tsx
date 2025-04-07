'use client'
import { signOut } from 'next-auth/react'
import { Button } from '../ui'

const SignOutButton = () => {
	const sair = () => {
		signOut({ callbackUrl: '/signIn' }) // redireciona para home
	}
	return <Button onClick={sair}>Sair</Button>
}

export { SignOutButton }
