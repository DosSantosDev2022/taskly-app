"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Editor, useEditorState } from "@tiptap/react";
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	Droplet,
	Italic,
	List,
	ListOrdered,
	Pilcrow,
	Redo,
	Strikethrough,
	Undo,
} from "lucide-react";
import { JSX } from "react";
import { ColorChangeHandler, ColorResult, CompactPicker } from "react-color";
import { TiptapMenuButton } from "./tip-tap-menu-button";

interface TiptapEditorState {
	isBold: boolean;
	canBold: boolean;
	isItalic: boolean;
	canItalic: boolean;
	isStrike: boolean;
	canStrike: boolean;
	isParagraph: boolean;
	isHeading1: boolean;
	isHeading2: boolean;
	isHeading3: boolean;
	isHeading4: boolean;
	isHeading5: boolean;
	isHeading6: boolean;
	isBulletList: boolean;
	isOrderedList: boolean;
	canUndo: boolean;
	canRedo: boolean;
	isAlignLeft: boolean;
	isAlignCenter: boolean;
	isAlignRight: boolean;
}

interface TiptapMenuBarProps {
	editor: Editor;
	disabled: boolean;
}

/**
 * @name TiptapMenuBar
 * @description Barra de ferramentas para o Tiptap Editor.
 * @param {object} props - As props do componente.
 * @param {Editor} props.editor - A instância do editor Tiptap.
 * @param {boolean} props.disabled - Indica se a barra de ferramentas está desabilitada.
 * @returns {JSX.Element} Um componente de barra de ferramentas.
 */
export const TiptapMenuBar = ({
	editor,
	disabled,
}: TiptapMenuBarProps): JSX.Element => {
	const editorState: TiptapEditorState = useEditorState({
		editor,
		selector: (ctx) => ({
			isBold: ctx.editor.isActive("bold") ?? false,
			canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
			isItalic: ctx.editor.isActive("italic") ?? false,
			canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
			isStrike: ctx.editor.isActive("strike") ?? false,
			canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
			isParagraph: ctx.editor.isActive("paragraph") ?? false,
			isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
			isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
			isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
			isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
			isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
			isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
			isBulletList: ctx.editor.isActive("bulletList") ?? false,
			isOrderedList: ctx.editor.isActive("orderedList") ?? false,
			canUndo: ctx.editor.can().chain().undo().run() ?? false,
			canRedo: ctx.editor.can().chain().redo().run() ?? false,
			isAlignLeft: ctx.editor.isActive({ textAlign: "left" }),
			isAlignCenter: ctx.editor.isActive({ textAlign: "center" }),
			isAlignRight: ctx.editor.isActive({ textAlign: "right" }),
		}),
	});

	const handleMouseDown = (e: React.MouseEvent) => e.preventDefault();

	/**
	 * @name handleColorChange
	 * @description Lida com a alteração de cor, aplicando a nova cor ao texto.
	 * @param {ColorResult} color - O objeto de cor retornado pelo `react-color`.
	 */
	const handleColorChange: ColorChangeHandler = (color: ColorResult) => {
		editor.chain().focus().setColor(color.hex).run();
	};

	return (
		<div className="flex flex-wrap items-center gap-1 border-b border-border p-2 bg-secondary/60">
			{/* ALINHAMENTO */}
			<TiptapMenuButton
				onClick={() => editor.chain().focus().setTextAlign("left").run()}
				variant="ghost"
				size="icon"
				disabled={disabled}
				className={cn(
					editorState.isAlignLeft && "bg-accent text-accent-foreground",
				)}
				aria-label="Alinhar à esquerda"
				type="button"
				onMouseDown={handleMouseDown}
				tooltipText="Alinhar à esquerda"
			>
				<AlignLeft className="h-4 w-4" />
			</TiptapMenuButton>
			<TiptapMenuButton
				onClick={() => editor.chain().focus().setTextAlign("center").run()}
				variant="ghost"
				size="icon"
				disabled={disabled}
				className={cn(
					editorState.isAlignCenter && "bg-accent text-accent-foreground",
				)}
				aria-label="Alinhar ao centro"
				type="button"
				onMouseDown={handleMouseDown}
				tooltipText="Alinhar ao centro"
			>
				<AlignCenter className="h-4 w-4" />
			</TiptapMenuButton>
			<TiptapMenuButton
				onClick={() => editor.chain().focus().setTextAlign("right").run()}
				variant="ghost"
				size="icon"
				disabled={disabled}
				className={cn(
					editorState.isAlignRight && "bg-accent text-accent-foreground",
				)}
				aria-label="Alinhar à direita"
				type="button"
				onMouseDown={handleMouseDown}
				tooltipText="Alinhar à direita"
			>
				<AlignRight className="h-4 w-4" />
			</TiptapMenuButton>

			{/* BOLD */}
			<TiptapMenuButton
				onClick={() => editor.chain().focus().toggleBold().run()}
				variant="ghost"
				size="icon"
				disabled={disabled || !editorState.canBold}
				className={cn(editorState.isBold && "bg-accent text-accent-foreground")}
				aria-label="Negrito"
				type="button"
				onMouseDown={handleMouseDown}
				tooltipText="Negrito"
			>
				<Bold className="h-4 w-4" />
			</TiptapMenuButton>

			{/* ITALIC */}
			<TiptapMenuButton
				onClick={() => editor.chain().focus().toggleItalic().run()}
				variant="ghost"
				size="icon"
				disabled={disabled || !editorState.canItalic}
				className={cn(
					editorState.isItalic && "bg-accent text-accent-foreground",
				)}
				aria-label="Itálico"
				type="button"
				onMouseDown={handleMouseDown}
				tooltipText="Itálico"
			>
				<Italic className="h-4 w-4" />
			</TiptapMenuButton>

			{/* STRIKE */}
			<TiptapMenuButton
				onClick={() => editor.chain().focus().toggleStrike().run()}
				variant="ghost"
				size="icon"
				disabled={disabled || !editorState.canStrike}
				className={cn(
					editorState.isStrike && "bg-accent text-accent-foreground",
				)}
				aria-label="Riscar"
				type="button"
				onMouseDown={handleMouseDown}
				tooltipText="Riscar"
			>
				<Strikethrough className="h-4 w-4" />
			</TiptapMenuButton>

			{/* PARAGRAPH */}
			<TiptapMenuButton
				onClick={() => editor.chain().focus().setParagraph().run()}
				variant="ghost"
				size="icon"
				disabled={disabled}
				className={cn(
					editorState.isParagraph && "bg-accent text-accent-foreground",
				)}
				aria-label="Parágrafo"
				type="button"
				onMouseDown={handleMouseDown}
				tooltipText="Parágrafo"
			>
				<Pilcrow className="h-4 w-4" />
			</TiptapMenuButton>

			{/* TÍTULOS (com Select) */}
			<Select
				onValueChange={(value) => {
					const level = parseInt(value as string) as 1 | 2 | 3 | 4 | 5 | 6;
					editor.chain().focus().toggleHeading({ level }).run();
				}}
				value={
					editorState.isHeading1
						? "1"
						: editorState.isHeading2
							? "2"
							: editorState.isHeading3
								? "3"
								: editorState.isHeading4
									? "4"
									: editorState.isHeading5
										? "5"
										: editorState.isHeading6
											? "6"
											: "paragraph"
				}
				disabled={disabled}
			>
				<Tooltip>
					<TooltipTrigger asChild>
						<SelectTrigger className="w-fit gap-2">
							<SelectValue placeholder="Tamanho" />
						</SelectTrigger>
					</TooltipTrigger>
					<TooltipContent>Títulos</TooltipContent>
				</Tooltip>
				<SelectContent>
					<SelectItem value="1">Título 1</SelectItem>
					<SelectItem value="2">Título 2</SelectItem>
					<SelectItem value="3">Título 3</SelectItem>
					<SelectItem value="4">Título 4</SelectItem>
					<SelectItem value="5">Título 5</SelectItem>
					<SelectItem value="6">Título 6</SelectItem>
				</SelectContent>
			</Select>

			{/* LISTA DE MARCADORES */}
			<TiptapMenuButton
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				variant="ghost"
				size="icon"
				disabled={disabled}
				className={cn(
					editorState.isBulletList && "bg-accent text-accent-foreground",
				)}
				aria-label="Lista de marcadores"
				type="button"
				onMouseDown={handleMouseDown}
				tooltipText="Lista de marcadores"
			>
				<List className="h-4 w-4" />
			</TiptapMenuButton>

			{/* LISTA NUMERADA */}
			<TiptapMenuButton
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				variant="ghost"
				size="icon"
				disabled={disabled}
				className={cn(
					editorState.isOrderedList && "bg-accent text-accent-foreground",
				)}
				aria-label="Lista numerada"
				type="button"
				onMouseDown={handleMouseDown}
				tooltipText="Lista numerada"
			>
				<ListOrdered className="h-4 w-4" />
			</TiptapMenuButton>

			{/* CORES */}
			<Popover>
				<PopoverTrigger asChild>
					<TiptapMenuButton
						variant="ghost"
						size="icon"
						onMouseDown={handleMouseDown}
						tooltipText="Cor do texto"
					>
						<Droplet
							className="h-4 w-4"
							style={{ color: editor.getAttributes("textStyle").color }}
						/>
					</TiptapMenuButton>
				</PopoverTrigger>
				<PopoverContent className="w-fit p-0">
					<CompactPicker
						color={editor.getAttributes("textStyle").color || "#000000"}
						onChange={handleColorChange}
					/>
				</PopoverContent>
			</Popover>

			{/* DESFAZER */}
			<TiptapMenuButton
				onClick={() => editor.chain().focus().undo().run()}
				variant="ghost"
				size="icon"
				disabled={disabled || !editorState.canUndo}
				aria-label="Desfazer"
				type="button"
				onMouseDown={handleMouseDown}
				tooltipText="Desfazer"
			>
				<Undo className="h-4 w-4" />
			</TiptapMenuButton>

			{/* REFAZER */}
			<TiptapMenuButton
				onClick={() => editor.chain().focus().redo().run()}
				variant="ghost"
				size="icon"
				disabled={disabled || !editorState.canRedo}
				aria-label="Refazer"
				type="button"
				onMouseDown={handleMouseDown}
				tooltipText="Refazer"
			>
				<Redo className="h-4 w-4" />
			</TiptapMenuButton>
		</div>
	);
};
