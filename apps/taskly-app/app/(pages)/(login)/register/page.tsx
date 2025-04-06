'use client'
import Link from 'next/link'
import { Button, Input, Label } from '@/components/ui'
import { LoginWithGoogle } from '@/components/global/LoginWithGoogle'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageError } from '@/components/global/forms/FormMessages'
import { useNotification } from '@/context/notificationContext'
import { registerUserSchema } from '@/@types/zodSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, LockKeyhole, CircleUserRound } from 'lucide-react'

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
	} = useForm<RegisterFormInputs>({
		resolver: zodResolver(registerUserSchema),
	})
	const { showNotification } = useNotification()
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
				showNotification('Erro ao cadastrar usuário, verifique !', 'error')
				return
			}
			showNotification('Usuário cadastrado com sucesso', 'success')
			router.push('/signIn')
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='max-w-3xl w-2xl'>
			<div className='lg:p-12 p-6 flex flex-col space-y-4'>
				<h3 className='font-bold text-3xl'>Crie sua conta</h3>

				<form onSubmit={handleSubmit(OnSubmit)}>
					<div className='space-y-2'>
						<div className='flex flex-col space-y-1'>
							<Label htmlFor={''}>Nome</Label>
							<Input
								icon={<CircleUserRound size={22} />}
								placeholder='Digite o seu nome'
								{...register('name', { required: true })}
							/>
							{errors.name && (
								<MessageError label={errors.name.message as string} />
							)}
						</div>

						<div className='flex flex-col space-y-1'>
							<Label htmlFor={''}>Email</Label>
							<Input
								icon={<Mail size={22} />}
								placeholder='Digite um e-mail válido'
								{...register('email', { required: true })}
							/>
							{errors.email && (
								<MessageError label={errors.email.message as string} />
							)}
						</div>

						<div className='flex flex-col space-y-1'>
							<Label htmlFor={''}>Senha</Label>
							<Input
								icon={<LockKeyhole size={22} />}
								placeholder='Digite sua senha'
								type='password'
								{...register('password', { required: true })}
							/>
							{errors.password && (
								<MessageError label={errors.password.message as string} />
							)}
						</div>

						<div className='w-full flex flex-col space-y-2'>
							<div className='flex w-full space-x-1.5'>
								<Button type='submit' sizes='full' disabled={loading}>
									{loading ? 'Cadastrando...' : 'Cadastrar'}
								</Button>
								<LoginWithGoogle label='Cadastrar com Google' />
							</div>

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
