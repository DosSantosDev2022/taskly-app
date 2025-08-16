"use client";

import { cn } from "@/lib/utils";
import BulletList from "@tiptap/extension-bullet-list";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { JSX } from "react";
import { TiptapMenuBar } from "./tip-tap-menubar";

interface TipTapEditorProps {
	/**
	 * O valor inicial do editor (conteúdo HTML).
	 */
	value: string;
	/**
	 * Callback para quando o valor do editor muda.
	 * @param content O conteúdo HTML atual do editor.
	 */
	onChange: (content: string) => void;
	/**
	 * Estado de desabilitação do formulário.
	 */
	disabled: boolean;
}

/**
 * @name TiptapEditor
 * @description Um editor de texto rico baseado em Tiptap, integrado com o React Hook Form.
 * @param {object} props - As props do componente.
 * @param {string} props.value - O conteúdo HTML inicial do editor.
 * @param {(content: string) => void} props.onChange - Função para ser chamada quando o conteúdo muda.
 * @param {boolean} props.disabled - Indica se o editor está desabilitado.
 * @returns {JSX.Element} Um componente de editor de texto rico.
 */
export const TiptapEditor = ({
	value,
	onChange,
	disabled,
}: TipTapEditorProps): JSX.Element => {
	const editor = useEditor({
		extensions: [
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Highlight,
			Color,
			TextStyleKit,
			BulletList,
			OrderedList,
			StarterKit,
		],
		content: value,
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class: cn(
					"min-h-[150px] p-2 outline-none w-full",
					"prose dark:prose-invert",
					disabled && "cursor-not-allowed bg-muted text-muted-foreground",
				),
			},
		},
	});

	return (
		<div
			className={cn(
				"rounded-md border border-input bg-background",
				disabled && "border-dashed opacity-70",
			)}
		>
			{editor && <TiptapMenuBar editor={editor} disabled={disabled} />}
			<EditorContent
				editor={editor}
				className="prose dark:prose-invert max-w-[46rem] p-4 min-h-[200px]"
			/>
		</div>
	);
};
