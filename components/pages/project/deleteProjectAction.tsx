'use client'

import { DeleteProject } from '@/actions/project/deleteProject'
import {
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogClose,
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className='p-1 hover:bg-accent cursor-pointer'>
        <span>Excluír</span>
      </DialogTrigger>


      <DialogContent className='w-xl'>
        <DialogDescription className='text-lg'>
          Tem certeza que desja excluír este projeto ?
        </DialogDescription>
        <div className='flex items-center w-full justify-start gap-2'>
          <Button size='default' onClick={handleDeleteProject}>
            Sim
          </Button>
          <DialogClose asChild>
            <Button variant='outline' size='default'>
              Cancelar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { DeleteProjectAction }