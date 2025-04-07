'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

export default function VerifyEmail() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const token = searchParams.get('token')
	console.log('token recebido', token)

	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle')
	const [message, setMessage] = useState('Verificando o seu e-mail...')

	useEffect(() => {
		if (!token) {
			// Ainda estamos esperando o token — não faz nada por enquanto
			return
		}

		const verifyEmail = async () => {
			setStatus('loading') // Agora sim começamos o loading real

			try {
				const res = await fetch('/api/verify-email', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ token }),
				})
				const data = await res.json()

				if (res.ok) {
					setStatus('success')
					setMessage(
						'E-mail verificado com sucesso ! Você já pode fazer login.',
					)
					setTimeout(() => router.push('/signIn'), 3000)
				} else {
					setStatus('error')
					setMessage(data.message || 'Erro ao verificar e-mail.')
				}
			} catch (error) {
				console.error(error)
				setStatus('error')
				setMessage('Erro interno ao verificar e-mail')
			}
		}
		verifyEmail()
	}, [token, router])

	return (
		<div className='flex flex-col items-center justify-center min-h-[60vh] px-4 text-center'>
			{status === 'idle' || status === 'loading' ? (
				<>
					<Loader2 className='animate-spin w-8 h-8 text-primary' />
					<p className='mt-4'>{message}</p>
				</>
			) : status === 'success' ? (
				<>
					<CheckCircle2 className='text-green-500 w-8 h-8' />
					<p className='mt-4 text-green-600'>{message}</p>
				</>
			) : (
				<>
					<XCircle className='text-red-500 w-8 h-8' />
					<p className='mt-4 text-red-600'>{message}</p>
				</>
			)}
		</div>
	)
}
