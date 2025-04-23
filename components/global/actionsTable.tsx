'use client'
import { GrView } from 'react-icons/gr'
import { Button } from '../ui'
import { MdDelete } from 'react-icons/md'
import { DeleteClient } from '@/actions/client/deleteClient'
import { useNotification } from '@/context/notificationContext'
import { ViewDetailsClient } from '../pages/clients/viewDetailsClient'

interface ActionTableProps {
	id: string
	path: string
}

const ActionTable = ({ id, path }: ActionTableProps) => {
	const { showNotification } = useNotification()

	const handleDeleteClient = async () => {
		const res = await DeleteClient({ id })

		if (res.success) {
			showNotification('Cliente deletado com sucesso !', 'success')
		} else {
			showNotification('Erro ao deletar cliente !', 'error')
		}
	}

	return (
		<div className='flex items-center justify-center gap-0.5 w-full'>
			<ViewDetailsClient id={id} />
			<Button
				onClick={handleDeleteClient}
				className='text-sm h-8'
				sizes='icon'
				variants='link'
			>
				<MdDelete size={24} />
			</Button>
		</div>
	)
}

export { ActionTable }
