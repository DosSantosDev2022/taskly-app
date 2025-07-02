// context/notificationContext.tsx
'use client';

import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
} from 'react';
import { NotificationProps } from '@/components/global'; // Importe o tipo de props

// Estendemos as props do Notification para incluir um ID gerado
interface NotificationItem extends Omit<NotificationProps, 'onClose'> {
	id: string;
}

// Tipos para o contexto
interface NotificationContextType {
	showNotification: (
		message: string,
		type: NotificationProps['type'],
		title?: string,
		duration?: number,
	) => void;
	notifications: NotificationItem[];
	removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined,
);

interface NotificationProviderProps {
	children: ReactNode;
}

export const NotificationProvider = ({
	children,
}: NotificationProviderProps) => {
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);

	// Adiciona uma nova notificação
	const showNotification = useCallback(
		(
			message: string,
			type: NotificationProps['type'],
			title?: string,
			duration?: number,
		) => {
			const id = Date.now().toString() + Math.random().toString(36).substring(2, 9); // ID único
			const newNotification: NotificationItem = {
				id,
				message,
				title,
				type,
				duration,
			};
			// Adiciona a nova notificação ao topo da lista
			setNotifications((prevNotifications) => [
				newNotification,
				...prevNotifications,
			]);
		},
		[],
	);

	// Remove uma notificação pelo ID
	const removeNotification = useCallback((id: string) => {
		setNotifications((prevNotifications) =>
			prevNotifications.filter((notif) => notif.id !== id),
		);
	}, []);

	return (
		<NotificationContext.Provider
			value={{ showNotification, notifications, removeNotification }}
		>
			{children}
		</NotificationContext.Provider>
	);
};

// Hook customizado para usar o contexto de notificação
export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error(
			'useNotification must be used within a NotificationProvider',
		);
	}
	return context;
};