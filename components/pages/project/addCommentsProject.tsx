'use client'
import { type CommentFormData, CommentSchema } from '@/@types/zodSchemas'
import { AddComment } from '@/actions/comment/addComment'
import {
	TextArea,
	Button,
	ModalRoot,
	ModalTrigger,
	ModalContent,
	ModalHeader,
	ModalTitle,
	ModalClose,
	ModalOverlay,
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { FaPlus } from 'react-icons/fa'

interface AddCommentsProjectsProps {
	projectId?: string
	taskId?: string
	onCommentAdded: () => void
}

const AddCommentsProjects = ({
	projectId,
	taskId,
	onCommentAdded,
}: AddCommentsProjectsProps) => {
	const [open, setOpen] = useState(false)
	const [isPending, startTransition] = useTransition()
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CommentFormData>({
		resolver: zodResolver(CommentSchema),
		defaultValues: {},
	})

	const { data: session } = useSession()
	const userId = session?.user.id

	const OnSubmit = (data: CommentFormData) => {
		startTransition(async () => {
			if (!userId) {
				console.error('Usuário não autenticado')
				return
			}
			const finalData = {
				...data,
				projectId,
				userId,
			}

			try {
				await AddComment(finalData)
				reset()
				setOpen(false)
				onCommentAdded()
			} catch (error) {
				console.error('Erro ao adicionar nova tarefa', error)
			}
		})
	}

	return (
		<ModalRoot open={open} onOpenChange={setOpen}>
			<ModalTrigger sizes='icon'>
				<FaPlus size={16} />
			</ModalTrigger>
			<ModalOverlay variant='darkBlur' />
			<ModalContent className='w-xl'>
				<ModalHeader>
					<ModalTitle>Adicione um comentário ao projeto</ModalTitle>
					<ModalClose sizes='icon' icon />
				</ModalHeader>
				<div className='space-y-2'>
					<form onSubmit={handleSubmit(OnSubmit)}>
						<TextArea
							{...register('content')}
							placeholder='Escreva um comentário...'
						/>
						{errors.content && (
							<p className='text-sm text-danger'>
								{errors.content.message}
							</p>
						)}
						<Button type='submit' sizes='full'>
							{isPending ? 'Adicionando...' : 'Adicionar comentário'}
						</Button>
					</form>
				</div>
			</ModalContent>
		</ModalRoot>
	)
}

export { AddCommentsProjects }
