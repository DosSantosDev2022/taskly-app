'use client'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
	AlertCircleIcon,
	ErrorCircleIcon,
	SuccessCircleIcon,
} from './icons/NotificationsIcon'
interface NotificationProps {
	message: string
	type: 'success' | 'error' | 'alert'
	duration?: number // Tempo em milissegundos para a notificação desaparecer
	onClose: () => void // Função para fechar a notificação
}

const Notification = ({
	message,
	type,
	duration = 5000,
	onClose,
}: NotificationProps) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose()
		}, duration)

		return () => clearTimeout(timer)
	}, [duration, onClose])

	// Define as cores dinamicamente por tipo
	const bgColor =
		type === 'success'
			? 'bg-success/80 text-success-foreground'
			: type === 'error'
				? 'bg-danger/80 text-danger-foreground'
				: 'bg-warning/60 text-warning-foreground'

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 50, scale: 0.3 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
			className={`fixed right-4 bottom-4 rounded-md p-4 shadow-lg ${bgColor} `}
		>
			<div className='flex w-full items-center justify-between gap-2'>
				<p className='text-base font-medium'>{message}</p>
				{type === 'success' && (
					<SuccessCircleIcon fillColor='#12873d' pathColor='#ffffff' />
				)}
				{type === 'error' && <ErrorCircleIcon fillColor='#df3d07' />}
				{type === 'alert' && <AlertCircleIcon fillColor='#facc15' />}
			</div>
		</motion.div>
	)
}

export { Notification }
