import type React from 'react'
import { useCallback, useEffect } from 'react'
import { useEditor, EditorContent, Editor, Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapLink from '@tiptap/extension-link' // Renomeado para evitar conflito com o ícone Link
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import {
	FaBold,
	FaItalic,
	FaStrikethrough, // Ícone para "Strike"
	FaUnderline,
	FaLink,
	FaAlignLeft,
	FaAlignCenter,
	FaAlignRight,
	FaAlignJustify,
	FaListUl, // Lista de marcadores
	FaListOl, // Lista numerada
} from 'react-icons/fa'
import { Button } from './button'
import {
	LuHeading1,
	LuHeading2,
	LuHeading3,
	LuHeading4,
	LuHeading5,
	LuHeading6,
} from 'react-icons/lu'

interface RichTextEditorProps {
	content: string
	onChange: (html: string) => void
	placeholder?: string
	maxCharacters?: number
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
	content,
	onChange,
	placeholder,
	maxCharacters,
}) => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({}),
			TiptapLink.configure({
				openOnClick: true,
				autolink: true,
			}),
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
			Underline,
			TextStyle,
			Color,
			Highlight,
			Image.configure({
				inline: true,
			}),
			CharacterCount.configure({
				limit: maxCharacters,
			}),
			Placeholder.configure({
				placeholder:
					placeholder || 'Digite a descrição do seu projeto aqui...',
			}),
			Typography,
		],
		/* content: content, */
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML())
		},
		editorProps: {
			attributes: {
				class:
					'prose max-w-none  focus:outline-none text-muted-foreground p-4 border border-border bg-secondary/20 min-h-[200px] max-h-[320px] overflow-y-scroll scrollbar-custom',
			},
		},
	})

	useEffect(() => {
		if (editor && content) {
			// Verifica se o conteúdo atual do editor é diferente do novo conteúdo
			// para evitar loops infinitos ou atualizações desnecessárias.
			if (editor.getHTML() !== content) {
				editor.commands.setContent(content, false) // 'false' para não emitir evento 'update'
			}
		} else if (editor && content === '') {
			// Se o conteúdo for vazio, limpa o editor
			editor.commands.setContent('', false)
		}
	}, [editor, content])

	const setLink = useCallback(() => {
		if (!editor) return
		const previousUrl = editor.getAttributes('link').href
		const url = window.prompt('URL', previousUrl)

		// cancelled
		if (url === null) {
			return
		}

		// empty string (removes link)
		if (url === '') {
			editor.chain().focus().unsetLink().run() // Alterado: Usar unsetLink
			return
		}

		// update link
		// Alterado: Usar setLink diretamente, sem extendMark
		editor.chain().focus().setLink({ href: url }).run()
	}, [editor])

	if (!editor) {
		return null
	}

	return (
		<div className='border border-border rounded-md'>
			<div className='flex flex-wrap gap-2 p-2 border-b border-border bg-secondary/70'>
				{/* Botões de Estilo de Texto */}
				<>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() => editor.chain().focus().toggleBold().run()}
						disabled={!editor.can().chain().focus().toggleBold().run()}
						className={`${editor.isActive('bold') ? 'bg-primary text-primary-foreground' : ''}`}
						title='Negrito'
					>
						<FaBold className='h-4 w-4' />
					</Button>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() => editor.chain().focus().toggleItalic().run()}
						disabled={!editor.can().chain().focus().toggleItalic().run()}
						className={`${editor.isActive('italic') ? 'bg-primary text-primary-foreground' : ''}`}
						title='Itálico'
					>
						<FaItalic className='h-4 w-4' />
					</Button>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() => editor.chain().focus().toggleStrike().run()}
						disabled={!editor.can().chain().focus().toggleStrike().run()}
						className={`p-2 rounded-md text-sm font-medium ${editor.isActive('strike') ? 'bg-primary text-primary-foreground' : ''}`}
						title='Tachado'
					>
						<FaStrikethrough className='h-4 w-4' />
					</Button>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() => editor.chain().focus().toggleUnderline().run()}
						disabled={
							!editor.can().chain().focus().toggleUnderline().run()
						}
						className={`p-2 rounded-md text-sm font-medium ${editor.isActive('underline') ? 'bg-primary text-primary-foreground' : ''}`}
						title='Sublinhado'
					>
						<FaUnderline className='h-4 w-4' />
					</Button>
				</>
				{/* Botões de Cabeçalho */}
				<>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 1 }).run()
						}
						className={`p-2 rounded-md text-sm font-medium ${editor.isActive('heading', { level: 1 }) ? 'bg-primary text-primary-foreground' : ''}`}
						title='Título 1'
					>
						<LuHeading1 className='h-4 w-4' />{' '}
					</Button>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
						className={`p-2 rounded-md text-sm font-medium ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground' : ''}`}
						title='Título 2'
					>
						<LuHeading2 className='h-4 w-4' />{' '}
					</Button>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 3 }).run()
						}
						className={`p-2 rounded-md text-sm font-medium ${editor.isActive('heading', { level: 3 }) ? 'bg-primary text-primary-foreground' : ''}`}
						title='Título 3'
					>
						<LuHeading3 className='h-4 w-4' />{' '}
					</Button>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 4 }).run()
						}
						className={`p-2 rounded-md text-sm font-medium ${editor.isActive('heading', { level: 4 }) ? 'bg-primary text-primary-foreground' : ''}`}
						title='Título 4'
					>
						<LuHeading4 className='h-4 w-4' />{' '}
					</Button>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 5 }).run()
						}
						className={`p-2 rounded-md text-sm font-medium ${editor.isActive('heading', { level: 5 }) ? 'bg-primary text-primary-foreground' : ''}`}
						title='Título 5'
					>
						<LuHeading5 className='h-4 w-4' />{' '}
					</Button>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 6 }).run()
						}
						className={`p-2 rounded-md text-sm font-medium ${editor.isActive('heading', { level: 6 }) ? 'bg-primary text-primary-foreground' : ''}`}
						title='Título 6'
					>
						<LuHeading6 className='h-4 w-4' />{' '}
					</Button>
				</>

				{/* Botões de Alinhamento */}
				<>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() =>
							editor.chain().focus().setTextAlign('left').run()
						}
						className={`p-2 rounded-md text-sm font-medium ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary text-primary-foreground' : ''}`}
						title='Alinhar à Esquerda'
					>
						<FaAlignLeft className='h-4 w-4' />
					</Button>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() =>
							editor.chain().focus().setTextAlign('center').run()
						}
						className={`p-2 rounded-md text-sm font-medium ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary text-primary-foreground' : ''}`}
						title='Alinhar ao Centro'
					>
						<FaAlignCenter className='h-4 w-4' />
					</Button>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() =>
							editor.chain().focus().setTextAlign('right').run()
						}
						className={`p-2 rounded-md text-sm font-medium ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary text-primary-foreground' : ''}`}
						title='Alinhar à Direita'
					>
						<FaAlignRight className='h-4 w-4' />
					</Button>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() =>
							editor.chain().focus().setTextAlign('justify').run()
						}
						className={`p-2 rounded-md text-sm font-medium ${editor.isActive({ textAlign: 'justify' }) ? 'bg-primary text-primary-foreground' : ''}`}
						title='Justificar'
					>
						<FaAlignJustify className='h-4 w-4' />
					</Button>
				</>

				{/* Botões de Lista */}
				<>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						className={`p-2 rounded-md text-sm font-medium ${editor.isActive('bulletList') ? 'bg-primary text-primary-foreground' : ''}`}
						title='Lista de Marcadores'
					>
						<FaListUl className='h-4 w-4' />
					</Button>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={() =>
							editor.chain().focus().toggleOrderedList().run()
						}
						className={`p-2 rounded-md text-sm font-medium ${editor.isActive('orderedList') ? 'bg-primary text-primary-foreground' : ''}`}
						title='Lista Numerada'
					>
						<FaListOl className='h-4 w-4' />
					</Button>
				</>

				{/* Botão de Link */}
				{/* biome-ignore lint/complexity/noUselessFragments: <explanation> */}
				<>
					<Button
						type='button'
						variants='ghost'
						sizes='icon'
						onClick={setLink}
						className={`p-2 rounded-md text-sm font-medium ${editor.isActive('link') ? 'bg-primary text-primary-foreground' : ''}`}
						title='Inserir Link'
					>
						<FaLink className='h-4 w-4' />
					</Button>
				</>

				{/* <div className='relative'>
					<select
						title='Tamanho da Fonte'
						onChange={(e) =>
							editor.chain().focus().setFontSize(e.target.value).run()
						}
						value={editor.getAttributes('textStyle').fontSize || ''}
						className='p-1 h-8 block border border-border cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none bg-secondary/90 text-sm'
					>
						<option value=''>
							<RiFontSize />
						</option>
						{fontSizes.map((size) => (
							<option key={size} value={size}>
								{size}
							</option>
						))}
					</select>
				</div> */}

				{/* Cores (exemplo simplificado) */}
				<div className='flex items-center gap-1'>
					<input
						type='color'
						onInput={(event) =>
							editor
								.chain()
								.focus()
								.setColor((event.target as HTMLInputElement).value)
								.run()
						}
						value={editor.getAttributes('textStyle').color || '#000000'}
						className='p-1 h-8 w-9 block border border-border cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none bg-secondary/90'
						title='Cor do Texto'
					/>
				</div>
				<div className='flex items-center gap-1'>
					<input
						type='color'
						onInput={(event) =>
							editor
								.chain()
								.focus()
								.toggleHighlight({
									color: (event.target as HTMLInputElement).value,
								})
								.run()
						}
						value={editor.getAttributes('highlight').color || '#ffffff'}
						className='p-1 h-8 w-9 block border border-border cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none bg-secondary/90'
						title='Destacar Texto'
					/>
				</div>
			</div>

			<EditorContent editor={editor} />

			{maxCharacters && (
				<div className='bg-secondary/70 p-2 text-sm text-muted-foreground border-t border-border'>
					Caracteres: {editor.storage.characterCount.characters()} /{' '}
					{maxCharacters}
				</div>
			)}
		</div>
	)
}

export default RichTextEditor
