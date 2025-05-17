'use client'
import { GrView } from 'react-icons/gr'
import {
	Button,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalOverlay,
	ModalRoot,
	ModalTrigger,
} from '@/components/ui'
import { MdDelete } from 'react-icons/md'
import { DeleteProject } from '@/actions/project/deleteProject'
import { useNotification } from '@/context/notificationContext'
import { ViewDetailsProject } from './viewDetailsProject'
import { useState } from 'react'

interface ActionTableProps {
	projectId: string
	path: string
}

const ActionProjectTable = ({ projectId, path }: ActionTableProps) => {
	const [isOpen, setIsOpen] = useState(false)
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
						Tem certeza que desja excluír este projeto ?
					</ModalDescription>
					<div className='flex items-center w-full justify-start gap-2'>
						<Button sizes='xs' onClick={handleDeleteProject}>
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

export { ActionProjectTable }
