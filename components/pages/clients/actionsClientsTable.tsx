'use client'
import {
	Button,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalOverlay,
	ModalRoot,
	ModalTrigger,
} from '@/components/ui'
import { MdDelete } from 'react-icons/md'
import { DeleteClient } from '@/actions/client/deleteClient'
import { useNotification } from '@/context/notificationContext'
import { ViewDetailsClient } from '@/components/pages/clients/viewDetailsClient'
import { useState } from 'react'
import type { Client } from '@/@types/prismaSchema'

interface ActionTableProps {
	client: Client
	path: string
}

const ActionClientTable = ({ client, path }: ActionTableProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const { showNotification } = useNotification()

	const handleDeleteClient = async () => {
		const res = await DeleteClient({ id: client.id })

		if (res.success) {
			showNotification('Cliente deletado com sucesso !', 'success')
			setIsOpen(false)
		} else {
			showNotification('Erro ao deletar cliente !', 'error')
		}
	}

	return (
		<div className='flex items-center justify-start gap-0.5'>
			<ViewDetailsClient client={client} />
			<ModalRoot open={isOpen} onOpenChange={setIsOpen}>
				<ModalTrigger sizes='icon' variants='link'>
					<MdDelete
						className='hover:scale-95 duration-300 transition-all'
						size={20}
					/>
				</ModalTrigger>
				<ModalOverlay variant='dark' />

				<ModalContent className='w-xl'>
					<ModalDescription className='text-lg'>
						Tem certeza que desja excluír este cliente ?
					</ModalDescription>
					<div className='flex items-center w-full justify-start gap-2'>
						<Button sizes='xs' onClick={handleDeleteClient}>
							Sim
						</Button>
						<ModalClose sizes='xs' variants='danger'>
							Cancelar
						</ModalClose>
					</div>
				</ModalContent>
			</ModalRoot>
		</div>
	)
}

export { ActionClientTable }
