// BriefingNotes.tsx
'use client'
import { useState, useRef, useEffect, useTransition } from 'react'
import {
	Button,
	ModalClose,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	ModalRoot,
	ModalTitle,
	ModalTrigger,
	TextArea,
} from '@/components/ui'
import { Notification } from '@/components/global/Notification'
import {
	addNote,
	deleteNote,
	getNotesByBriefingId,
	type Note as NoteType,
} from '@/actions/briefings/notesActions'
import { IoDocumentText } from 'react-icons/io5'
import { NoteSkeleton } from '@/components/pages/briefings'
import { useNotification } from '@/context/notificationContext'
import { MdDelete } from 'react-icons/md'

interface BriefingNotesProps {
	briefingId: string
}

export function BriefingNotes({ briefingId }: BriefingNotesProps) {
	const [notes, setNotes] = useState<NoteType[]>([])
	const [newNoteContent, setNewNoteContent] = useState('')
	const [isPending, startTransition] = useTransition()
	const scrollRef = useRef<HTMLDivElement>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isLoadingNotes, setIsLoadingNotes] = useState(true)
	const { showNotification } = useNotification()

	const fetchNotes = async () => {
		setIsLoadingNotes(true)
		const fetchedNotes = await getNotesByBriefingId(briefingId)
		setNotes(fetchedNotes)
		setIsLoadingNotes(false)
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchNotes()
	}, [briefingId])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight
		}
	}, [notes])

	const handleAddNote = async () => {
		if (!newNoteContent.trim()) {
			showNotification('Nenhuma anotação encontrada !', 'alert')
			return
		}

		startTransition(async () => {
			const addedNote = await addNote(briefingId, newNoteContent.trim())
			if (addedNote) {
				setNotes((prevNotes) => [...prevNotes, addedNote])
				setNewNoteContent('')
				showNotification('Anotação salva com sucesso!', 'success')
				setIsModalOpen(false)
			} else {
				showNotification('Erro ao salvar anotação !', 'error')
			}
		})
	}

	const handleDeleteNote = async (noteId: string) => {
		startTransition(async () => {
			const result = await deleteNote(briefingId, noteId)

			if (result.success) {
				setNotes((prevNotes) =>
					prevNotes.filter((note) => note.id !== noteId),
				)
				showNotification('Anotação deletada !', 'success')
			} else {
				showNotification(
					result.error || 'Erro ao deletar anotação !',
					'error',
				)
			}
		})
	}

	return (
		<div className='flex flex-col h-full p-4 rounded-lg shadow-sm border border-border'>
			<div className='flex items-cente justify-start gap-2'>
				<IoDocumentText className='text-muted-foreground' size={28} />
				<h3 className='text-2xl font-semibold mb-4 text-start'>
					Anotações
				</h3>
			</div>

			{/* Envolve apenas a área das notas em um container com rolagem */}
			<div
				ref={scrollRef}
				className='flex-1 overflow-y-auto pr-2 mb-4 space-y-4 scrollbar-custom'
			>
				{isLoadingNotes ? ( // Renderização condicional para o skeleton
					Array.from({ length: 6 }).map(
						(
							_,
							index, // Mostra 3 skeletons enquanto carrega
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						) => <NoteSkeleton key={index} />,
					)
				) : notes.length === 0 ? (
					<p className='text-muted-foreground text-center'>
						Nenhuma anotação ainda. Adicione uma!
					</p>
				) : (
					notes.map((note) => (
						<div
							key={note.id}
							className='bg-secondary/10 p-3 rounded-md border border-border text-sm shadow-xs'
						>
							<div className='flex items-center justify-between w-full'>
								<p className='text-primary-foreground break-words whitespace-pre-wrap'>
									{note.content}
								</p>
								<Button
									onClick={() => handleDeleteNote(note.id)}
									sizes='icon'
									variants='ghost'
									className='active:scale-95'
								>
									<MdDelete />
								</Button>
							</div>
							<p className='text-xs text-primary-foreground mt-1 text-start'>
								{new Date(note.createdAt).toLocaleString()}
							</p>
						</div>
					))
				)}
			</div>

			{/* Formulário fixo */}
			<ModalRoot open={isModalOpen} onOpenChange={setIsModalOpen}>
				<ModalTrigger sizes='full'>Adicionar anotação</ModalTrigger>
				<ModalOverlay variant='dark' />
				<ModalContent>
					<ModalHeader>
						<ModalTitle>Nova anotação</ModalTitle>
						<ModalClose icon sizes='icon' />
					</ModalHeader>
					<div className='flex flex-col gap-2'>
						<TextArea
							placeholder='Adicione uma nova anotação...'
							value={newNoteContent}
							onChange={(e) => setNewNoteContent(e.target.value)}
							rows={3}
							className='resize-none'
							disabled={isPending}
						/>
						<Button
							sizes='full'
							onClick={handleAddNote}
							disabled={isPending || !newNoteContent.trim()}
						>
							{isPending ? 'Salvando...' : 'Adicionar Anotação'}
						</Button>
					</div>
				</ModalContent>
			</ModalRoot>
		</div>
	)
}
