'use client'
import { Button } from '@/components/ui'
import { MdDelete } from 'react-icons/md'
import { DeleteClient } from '@/actions/client/deleteClient'
import { useNotification } from '@/context/notificationContext'
import { ViewDetailsClient } from '@/components/pages/clients/viewDetailsClient'

interface ActionTableProps {
	id: string
	path: string
}

const ActionClientTable = ({ id, path }: ActionTableProps) => {
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
		<div className='flex items-center justify-start gap-0.5'>
			<ViewDetailsClient id={id} />
			<Button onClick={handleDeleteClient} sizes='icon' variants='link'>
				<MdDelete
					className='hover:scale-95 duration-300 transition-all'
					size={20}
				/>
			</Button>
		</div>
	)
}

export { ActionClientTable }
