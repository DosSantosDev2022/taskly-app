'use client'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'
import { MdDelete } from 'react-icons/md'
import { DeleteClient } from '@/actions/client/deleteClient'
import { useNotification } from '@/context/notificationContext'
import { useState } from 'react'
import { LuX } from 'react-icons/lu'

const DeleteClientAction = ({ clientId }: { clientId: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { showNotification } = useNotification()

  const handleDeleteClient = async () => {
    const res = await DeleteClient({ id: clientId })

    if (res.success) {
      showNotification('Cliente deletado com sucesso !', 'success')
      setIsOpen(false) // Fecha o Dialog após o sucesso
    } else {
      showNotification('Erro ao deletar cliente !', 'error')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className='p-1 hover:bg-accent cursor-pointer'>
        <span>Excluír</span>
      </DialogTrigger>
      <DialogContent className='p-6'>
        <DialogHeader>
          <DialogTitle>Confirmação de Exclusão</DialogTitle>
          <DialogDescription className='text-lg'>
            Tem certeza que deseja excluir este cliente?.
          </DialogDescription>
          <DialogClose />
        </DialogHeader>

        <DialogFooter className='flex items-center justify-end gap-2 mt-4'>
          <DialogClose asChild>
            <Button size='sm' variant='ghost'>
              Cancelar
            </Button>
          </DialogClose>
          <Button size='sm' variant='destructive' onClick={handleDeleteClient}>
            Sim, excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { DeleteClientAction }