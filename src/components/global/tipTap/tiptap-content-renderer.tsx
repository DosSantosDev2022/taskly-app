// src/components/ui/tiptap/tiptap-content-renderer.tsx
"use client";

import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import { JSX, useEffect, useState } from "react";

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
	const [sanitizedHtml, setSanitizedHtml] = useState("");

	useEffect(() => {
		// This code will be executed only on the client side after the component is mounted
		if (content.length === 0) return;

		const domPurify = DOMPurify(window);
		const cleanHtml = domPurify.sanitize(content); // You might want to pass your markdown-converted HTML here
		setSanitizedHtml(cleanHtml);
	}, [content]); // This effect will re-run if the 'text' prop changes

	if (!sanitizedHtml) return <></>; // or some placeholder/loading indicator

	return (
		<div
			className={cn("prose dark:prose-invert max-w-none", className)}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
			dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
		/>
	);
};
