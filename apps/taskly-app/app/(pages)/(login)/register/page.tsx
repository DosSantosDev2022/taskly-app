'use client'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'
import { LoginWithGoogle } from '@/components/global/LoginWithGoogle'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RegisterFormInputs {
	name: string
	email: string
	password: string
}

export default function Register() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormInputs>()
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const OnSubmit = async (data: RegisterFormInputs) => {
		setLoading(true)
		try {
			const res = await fetch('/api/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})

			if (!res.ok) {
				const err = await res.json()
				alert('Erro ao cadastrar usuário')
				return
			}

			router.push('/signIn')
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='max-w-[768px] w-[628px]'>
			<div className='lg:p-12 p-6 flex flex-col space-y-4'>
				<div className='space-y-1.5'>
					<h3 className='font-bold text-3xl'>Crie sua conta</h3>
					<span className='text-muted-foreground'>
						Preencha seus dados
					</span>
				</div>

				<form onSubmit={handleSubmit(OnSubmit)}>
					<div className='space-y-2.5'>
						<div className='flex flex-col space-y-1'>
							<label htmlFor={''} className='text-sm font-medium'>
								Nome
							</label>
							<Input
								placeholder='Digite o seu nome'
								{...register('name', { required: true })}
							/>
							{errors.name && (
								<span className='text-red-500 text-sm'>
									Nome é obrigatório
								</span>
							)}
						</div>

						<div className='flex flex-col space-y-1'>
							<label htmlFor={''} className='text-sm font-medium'>
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
								type='password'
								{...register('password', { required: true })}
							/>
							{errors.password && (
								<span className='text-red-500 text-sm'>
									Senha é obrigatória
								</span>
							)}
						</div>

						<div className='w-full flex flex-col space-y-3'>
							<Button type='submit' sizes='full' disabled={loading}>
								{loading ? 'Cadastrando...' : 'Cadastrar'}
							</Button>
							<LoginWithGoogle label='Cadastrar com Google' />

							<div className='flex flex-col items-center justify-center w-full p-1 space-y-1'>
								<span className='text-muted-foreground'>
									Já possuí conta ?{' '}
								</span>
								<Button asChild sizes='full' variants='secondary'>
									<Link href={'/signIn'}>Fazer Login</Link>
								</Button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
