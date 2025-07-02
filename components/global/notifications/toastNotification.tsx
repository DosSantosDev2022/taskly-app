
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { IoAlertCircle } from 'react-icons/io5'
import {
	FaCircleCheck,
} from 'react-icons/fa6';

// Tipos para o componente de notificação individual
export interface NotificationProps {
	id: string; // ID único para a notificação
	message: string;
	title?: string; // Título opcional para o alerta
	type: 'success' | 'error' | 'warning';
	duration?: number; // Tempo em milissegundos para a notificação desaparecer
	onClose: (id: string) => void; // Função para fechar a notificação por ID
}

const ToastNotification = ({
	id,
	message,
	title,
	type,
	duration = 5000,
	onClose,
}: NotificationProps) => {
	React.useEffect(() => {
		const timer = setTimeout(() => {
			onClose(id);
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose, id]);

	// Determine as classes de cor e o ícone com base no tipo
	let alertClasses = '';
	let IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	let alertTitle = title || ''; // Use o título passado ou um padrão
	let defaultTitleHidden = false; // Se o título padrão deve ser escondido do leitor de tela

	switch (type) {
		case 'success':
			alertClasses = 'bg-success border-success text-success-foreground';
			IconComponent = FaCircleCheck;
			alertTitle = title || 'Sucesso!';
			break;
		case 'error':
			alertClasses = 'bg-destructive border-destructive text-destructive-foreground';
			IconComponent = IoAlertCircle;
			alertTitle = title || 'Erro!';
			break;
		case 'warning': // Corresponde ao seu 'alert' anterior
			alertClasses = 'bg-warning border-warning text-warning-foreground';
			IconComponent = IoAlertCircle;
			alertTitle = title || 'Atenção!';
			break;
		default:
			alertClasses = 'bg-background/90 border-border text-foreground';
			IconComponent = IoAlertCircle; // Fallback
			alertTitle = title || 'Notificação';
			defaultTitleHidden = true; // Esconde o título padrão se nenhum tipo específico for encontrado
	}

	return (

		<motion.div
			layout
			initial={{ opacity: 0, x: '100%', scale: 0.8 }} // Começa mais à direita e escalado
			animate={{ opacity: 1, x: 0, scale: 1 }} // Entra na posição
			exit={{ opacity: 0, x: '100%', transition: { duration: 0.4 } }} // Sai para a direita e some
			transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
			className={cn(
				"w-full max-w-sm rounded-lg shadow-lg pointer-events-auto",
				"origin-right"
			)}
		>
			<Alert
				variant="default"
				className={cn(
					alertClasses,
					'flex items-center gap-2'
				)}
			>
				{/* Renderiza o ícone e garante que ele herde a cor do texto */}
				<IconComponent className='h-5 w-5 shrink-0' />
				<div className="flex-1">
					{/* Título do alerta, visível apenas para leitores de tela ou se customizado */}
					<AlertTitle className={cn("font-semibold", { 'sr-only': defaultTitleHidden && !title })}>
						{alertTitle}
					</AlertTitle>
					<AlertDescription className="text-sm">
						{message}
					</AlertDescription>
				</div>
			</Alert>
		</motion.div>

	);
};

export { ToastNotification };