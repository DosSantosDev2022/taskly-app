// src/components/ui/tiptap/tiptap-content-renderer.tsx
"use client";

import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import { JSX } from "react";

interface TiptapContentRendererProps {
	/**
	 * O conteúdo HTML gerado pelo Tiptap como uma string.
	 */
	content: string;
	/**
	 * Classes adicionais para estilização.
	 */
	className?: string;
}

/**
 * @name TiptapContentRenderer
 * @description Renderiza o conteúdo HTML gerado pelo Tiptap com a estilização do Tailwind CSS,
 * garantindo a segurança através da sanitização do HTML.
 * @param {object} props - As props do componente.
 * @param {string} props.content - O conteúdo HTML.
 * @param {string} props.className - Classes CSS adicionais.
 * @returns {JSX.Element} Um componente que renderiza o HTML.
 */
export const TiptapContentRenderer = ({
	content,
	className,
}: TiptapContentRendererProps): JSX.Element => {
	// 1. Crie uma instância do DOMPurify.
	const purifiedContent = DOMPurify.sanitize(content, {
		// Configurações opcionais para permitir classes CSS do Tailwind
		ADD_ATTR: ["class"],
	});

	return (
		<div
			className={cn("prose dark:prose-invert max-w-none", className)}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
			dangerouslySetInnerHTML={{ __html: purifiedContent }}
		/>
	);
};
