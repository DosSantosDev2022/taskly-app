// src/components/AddComment.tsx
"use client";

import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Textarea,
} from "@/components/ui";
import { useState, useTransition, useRef } from "react";
import { toast } from "react-toastify";
import { addComment } from "@/actions/comment/addComment";

interface AddCommentProps {
	projectId: string;
	onCommentAdded?: () => void;
}

const AddComment = ({ projectId, onCommentAdded }: AddCommentProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const formRef = useRef<HTMLFormElement>(null);
	const [commentContent, setCommentContent] = useState("");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault(); // Previne o comportamento padrão do formulário

		if (!commentContent.trim()) {
			toast.error("O comentário não pode ser vazio.", {
				autoClose: 3000,
				theme: "dark",
			});
			return;
		}

		const formData = new FormData();
		formData.append("content", commentContent);
		formData.append("projectId", projectId);

		startTransition(async () => {
			const result = await addComment(formData);

			if (result.success) {
				toast.success("Comentário adicionado com sucesso!", {
					autoClose: 3000,
					theme: "dark",
				});
				setCommentContent(""); // Limpa o textarea
				setIsOpen(false); // Fecha o Dialog
				onCommentAdded?.(); // Chama o callback se fornecido
			} else {
				// Exibe erros de validação ou mensagem geral de erro
				if (result.errors) {
					Object.values(result.errors)
						.flat()
						.forEach((errorMsg) => {
							toast.error(errorMsg, { autoClose: 3000, theme: "dark" });
						});
				} else {
					toast.error("Erro ao adicionar comentário.", {
						autoClose: 3000,
						theme: "dark",
					});
				}
			}
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Adicionar Comentário</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[768px]">
				<DialogHeader>
					<DialogTitle>Novo Comentário</DialogTitle>
				</DialogHeader>
				{/* Usar um formulário para capturar os dados */}
				<form onSubmit={handleSubmit} ref={formRef}>
					<div className="w-full space-y-3">
						<Textarea
							placeholder="Deixe seu comentário..."
							name="content" // Adicione o atributo 'name' para FormData
							value={commentContent}
							onChange={(e) => setCommentContent(e.target.value)}
							disabled={isPending}
						/>
						<Button className="w-full" type="submit" disabled={isPending}>
							{isPending ? "Adicionando..." : "Adicionar Comentário"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export { AddComment };
