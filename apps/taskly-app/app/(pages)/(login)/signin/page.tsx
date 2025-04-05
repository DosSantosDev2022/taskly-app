'use client'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'
import { LoginWithGoogle } from '@/components/global/LoginWithGoogle'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'

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

	const OnSubmit = async (data: LoginFormInputs) => {
		setLoading(true)
		const res = await signIn('credentials', {
			redirect: false,
			email: data.email,
			password: data.password,
		})

		setLoading(false)
		if (res?.ok) router.push('/dashboard')
		else alert('Email ou senha inválidos')
	}

	return (
		<div className='max-w-[768px] w-[628px] '>
			<div className='lg:p-12 p-6 flex flex-col space-y-4'>
				<div className='space-y-1.5'>
					<h3 className='font-bold text-3xl'>Entre em sua conta</h3>
					<span className='text-muted-foreground'>
						Preencha seus dados
					</span>
				</div>

				<form onSubmit={handleSubmit(OnSubmit)}>
					<div className='space-y-2.5'>
						<div className='flex flex-col space-y-1'>
							<label htmlFor={'email'} className='text-sm font-medium'>
								Email
							</label>
							<Input
								placeholder='Digite o seu e-mail'
								{...register('email', { required: true })}
							/>
							{errors.email && (
								<span className='text-red-500 text-sm'>
									Email é obrigatório
								</span>
							)}
						</div>
						<div className='flex flex-col space-y-1'>
							<label htmlFor={''} className='text-sm font-medium'>
								Senha
							</label>
							<Input
								placeholder='Digite sua senha'
								{...register('password', { required: true })}
							/>
							{errors.password && (
								<span className='text-red-500 text-sm'>
									Senha é obrigatória
								</span>
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
							<Button type='submit' disabled={loading} sizes='full'>
								{loading ? 'Entrando...' : 'Login'}
							</Button>
							<LoginWithGoogle label='Entrar com Google' />

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
