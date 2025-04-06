'use client'
import Link from 'next/link'
import { Button, Input, Label } from '@/components/ui'
import { LoginWithGoogle } from '@/components/global/LoginWithGoogle'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { MessageError } from '@/components/global/forms/FormMessages'
import { useNotification } from '@/context/notificationContext'
import { LockKeyhole, Mail } from 'lucide-react'

interface LoginFormInputs {
	email: string
	password: string
}

export default function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormInputs>()
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const { showNotification } = useNotification()

	const OnSubmit = async (data: LoginFormInputs) => {
		setLoading(true)
		const res = await signIn('credentials', {
			redirect: false,
			email: data.email,
			password: data.password,
		})

		setLoading(false)
		if (res?.ok) {
			router.push('/dashboard')
		} else {
			showNotification('E-mail e senha inválidos, verifique !', 'error')
		}
	}

	return (
		<div className='max-w-3xl w-2xl'>
			<div className='lg:p-12 p-6 flex flex-col space-y-4'>
				<h3 className='font-bold text-3xl'>Entre em sua conta</h3>
				<form onSubmit={handleSubmit(OnSubmit)}>
					<div className='space-y-2.5'>
						<div className='flex flex-col space-y-1'>
							<Label htmlFor={'email'}>Email</Label>
							<Input
								icon={<Mail size={22} />}
								placeholder='Digite o seu e-mail'
								{...register('email', { required: true })}
							/>
							{errors.email && (
								<MessageError label='E-mail é obrigatório !' />
							)}
						</div>
						<div className='flex flex-col space-y-1'>
							<Label htmlFor={''}>Senha</Label>
							<Input
								icon={<LockKeyhole size={22} />}
								placeholder='Digite sua senha'
								{...register('password', { required: true })}
							/>
							{errors.password && (
								<MessageError label='A senha é obrigatória !' />
							)}
						</div>

						<div className='p-1'>
							<Link
								className='text-muted-foreground text-sm hover:text-primary duration-300 transition-colors'
								href={''}
							>
								Esqueceu sua senha ?
							</Link>
						</div>
						<div className='w-full flex flex-col space-y-2'>
							<div className='flex w-full space-x-1.5'>
								<Button type='submit' disabled={loading} sizes='full'>
									{loading ? 'Entrando...' : 'Login'}
								</Button>
								<LoginWithGoogle label='Entrar com Google' />
							</div>

							<div className='flex flex-col items-center justify-center w-full p-1 space-y-1'>
								<span className='text-muted-foreground'>
									Não possuí conta ?{' '}
								</span>
								<Button asChild sizes='full' variants='secondary'>
									<Link href={'/register'}>Fazer cadastro</Link>
								</Button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
