'use client'

import { DeleteProject } from '@/actions/project/deleteProject'
import {
  Button,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalOverlay,
  ModalRoot,
  ModalTrigger,
} from '@/components/ui'
import { useNotification } from '@/context/notificationContext'
import { useState } from 'react'
import { MdDelete } from 'react-icons/md'


const DeleteProjectAction = ({ projectId }: { projectId: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { showNotification } = useNotification()

  const handleDeleteProject = async () => {
    const res = await DeleteProject({ projectId })

    if (res.success) {
      showNotification('Projeto deletado com sucesso !', 'success')
      setIsOpen(false)
    } else {
      showNotification('Erro ao deletar projeto !', 'error')
    }
  }


  return (
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
  )
}

export { DeleteProjectAction }