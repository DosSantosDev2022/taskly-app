'use client'
import { GrView } from 'react-icons/gr'
import { Button } from '@/components/ui'
import { MdDelete } from 'react-icons/md'
import { DeleteProject } from '@/actions/project/deleteProject'
import { useNotification } from '@/context/notificationContext'
import { ViewDetailsProject } from './viewDetailsProject'

interface ActionTableProps {
	projectId: string
	path: string
}

const ActionProjectTable = ({ projectId, path }: ActionTableProps) => {
	const { showNotification } = useNotification()

	const handleDeleteProject = async () => {
		const res = await DeleteProject({ projectId })

		if (res.success) {
			showNotification('Projeto deletado com sucesso !', 'success')
		} else {
			showNotification('Erro ao deletar projeto !', 'error')
		}
	}

	return (
		<div className='flex items-center justify-start gap-0.5'>
			<ViewDetailsProject projectId={projectId} />
			<Button onClick={handleDeleteProject} sizes='icon' variants='link'>
				<MdDelete
					className='hover:scale-95 duration-300 transition-all'
					size={20}
				/>
			</Button>
		</div>
	)
}

export { ActionProjectTable }
