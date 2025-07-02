'use client'
import { type CommentFormData, CommentSchema } from '@/@types/zodSchemas'
import { AddCommentProject } from '@/actions/project/addComment'
import {
	Textarea,
	Button,
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { FaPlus } from 'react-icons/fa'

interface AddCommentsProjectsProps {
	projectId: string
	onCommentAdded: () => void
}

const AddCommentsProjects = ({
	projectId,
	onCommentAdded,
}: AddCommentsProjectsProps) => {

	const { data: session } = useSession()
	const userId = session?.user.id

	const [open, setOpen] = useState(false)
	const [isPending, startTransition] = useTransition()
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CommentFormData>({
		resolver: zodResolver(CommentSchema),
		defaultValues: {
			userId,
			content: '',
			projectId: projectId,
		},
	})

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

			if (!finalData.projectId) {
				console.error('Um comentário deve estar associado a um Projeto')
				return
			}

			try {
				await AddCommentProject(finalData)
				reset()
				setOpen(false)
				onCommentAdded()
			} catch (error) {
				console.error('Erro ao adicionar nova tarefa', error)
			}
		})
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={'ghost'} size='icon'>
					<FaPlus />
				</Button>

			</DialogTrigger>

			<DialogContent className='w-xl'>
				<DialogHeader>
					<DialogTitle>Adicione um comentário ao projeto</DialogTitle>
					<DialogClose />
				</DialogHeader>

				<form onSubmit={handleSubmit(OnSubmit)}>
					<Textarea
						{...register('content')}
						placeholder='Escreva um comentário...'
					/>
					{errors.content && (
						<p className='text-sm text-danger'>
							{errors.content.message}
						</p>
					)}
					<Button className='w-full mt-2' type='submit'>
						{isPending ? 'Adicionando...' : 'Adicionar comentário'}
					</Button>
				</form>

			</DialogContent>
		</Dialog>
	)
}

export { AddCommentsProjects }
