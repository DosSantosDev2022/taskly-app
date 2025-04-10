'use client'

import Image from 'next/image'
import { Button } from '../ui'
import logoGoogle from '@/assets/icons/google.png'
import { signIn } from 'next-auth/react'

interface LoginWithGoogleProps {
	label: string
}

const LoginWithGoogle = ({ label }: LoginWithGoogleProps) => {
	const handleLoginWithGoogleClick = () =>
		signIn('google', { callbackUrl: '/dashboard' })
	return (
		<Button
			type='button'
			onClick={handleLoginWithGoogleClick}
			className='space-x-2'
			variants='ghost'
			sizes='full'
		>
			<Image
				width={26}
				height={26}
				quality={100}
				alt=''
				src={logoGoogle}
			/>
			<span>{label}</span>
		</Button>
	)
}

export { LoginWithGoogle }
