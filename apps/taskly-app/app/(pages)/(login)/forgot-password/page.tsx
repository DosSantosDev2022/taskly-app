'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { MessageError } from '@/components/global/forms/FormMessages'
import {
	codeSchema,
	emailSchema,
	newPasswordSchema,
} from '@/@types/zodSchemas'
import type {
	CodeData,
	NewPasswordData,
	EmailData,
	Step,
} from '@/@types/zodSchemas'
import { useRouter } from 'next/navigation'
import { useNotification } from '@/context/notificationContext'

export default function ForgotPassword() {
	const [step, setStep] = useState<Step>('email')
	const [userEmail, setUserEmail] = useState('')
	const router = useRouter()
	const { showNotification } = useNotification()

	// Formulários separados por etapa
	const emailForm = useForm<EmailData>({
		resolver: zodResolver(emailSchema),
	})
	const codeForm = useForm<CodeData>({ resolver: zodResolver(codeSchema) })
	const passwordForm = useForm<NewPasswordData>({
		resolver: zodResolver(newPasswordSchema),
	})

	// 1. Enviar código para o e-mail
	async function handleSendEmail(data: EmailData) {
		// Simulação (substituir por chamada real ao backend)
		await new Promise((resolve) => setTimeout(resolve, 1000))

		setUserEmail(data.email)
		setStep('code')
	}

	// 2. Verificar código
	async function handleVerifyCode(data: CodeData) {
		// Simulação (verificação do código)
		if (data.code === '123456') {
			setStep('new-password')
		} else {
			codeForm.setError('code', { message: 'Código inválido' })
		}
	}

	// 3. Redefinir a senha
	async function handleResetPassword(data: NewPasswordData) {
		// Simular requisição
		await new Promise((resolve) => setTimeout(resolve, 1000))
		showNotification('Senha redefinida com sucesso!', 'success')
		router.push('/signIn')
	}

	return (
		<div className='max-w-3xl w-2xl'>
			<h1 className='text-3xl font-bold mb-6'>Redefinir senha</h1>

			{step === 'email' && (
				<form
					onSubmit={emailForm.handleSubmit(handleSendEmail)}
					className='space-y-4'
				>
					<div className='flex flex-col space-y-1'>
						<Label htmlFor='email'>E-mail</Label>
						<Input
							id='email'
							placeholder='seu@email.com'
							{...emailForm.register('email')}
						/>
						{emailForm.formState.errors.email && (
							<MessageError
								label={emailForm.formState.errors.email.message as string}
							/>
						)}
					</div>
					<Button
						type='submit'
						className='w-full'
						disabled={emailForm.formState.isSubmitting}
					>
						{emailForm.formState.isSubmitting
							? 'Enviando...'
							: 'Enviar código'}
					</Button>
				</form>
			)}

			{step === 'code' && (
				<form
					onSubmit={codeForm.handleSubmit(handleVerifyCode)}
					className='space-y-4'
				>
					<div className='flex flex-col space-y-1'>
						<Label htmlFor='code'>Código de verificação</Label>
						<Input
							id='code'
							placeholder='Digite o código enviado'
							{...codeForm.register('code')}
						/>
						{codeForm.formState.errors.code && (
							<MessageError
								label={codeForm.formState.errors.code.message as string}
							/>
						)}
					</div>
					<Button
						type='submit'
						className='w-full'
						disabled={codeForm.formState.isSubmitting}
					>
						Verificar código
					</Button>
				</form>
			)}

			{step === 'new-password' && (
				<form
					onSubmit={passwordForm.handleSubmit(handleResetPassword)}
					className='space-y-4'
				>
					<div className='flex flex-col space-y-1'>
						<Label htmlFor='password'>Nova senha</Label>
						<Input
							id='password'
							type='password'
							{...passwordForm.register('password')}
						/>
						{passwordForm.formState.errors.password && (
							<MessageError
								label={
									passwordForm.formState.errors.password.message as string
								}
							/>
						)}
					</div>
					<div className='flex flex-col space-y-1'>
						<Label htmlFor='confirmPassword'>Confirme a nova senha</Label>
						<Input
							id='confirmPassword'
							type='password'
							{...passwordForm.register('confirmPassword')}
						/>
						{passwordForm.formState.errors.confirmPassword && (
							<MessageError
								label={
									passwordForm.formState.errors.confirmPassword
										.message as string
								}
							/>
						)}
					</div>
					<Button
						type='submit'
						className='w-full'
						disabled={passwordForm.formState.isSubmitting}
					>
						Redefinir senha
					</Button>
				</form>
			)}
		</div>
	)
}
