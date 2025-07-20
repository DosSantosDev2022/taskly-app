// src/app/projects/[id]/_components/EditCommentForm.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	Label,
	Textarea,
} from "@/components/ui"; // Assumindo que você tem esses componentes UI
import { editComment } from "@/actions/comment/editComment"; // Você precisará criar esta action
import type { Comment } from "@prisma/client";
import { useRouter } from "next/navigation";

// --- Definição do Schema de Validação com Zod ---
const editCommentSchema = z.object({
	content: z
		.string()
		.min(10, "O comentário deve ter no mínimo 10 caracteres.")
		.max(500, "O comentário deve ter no máximo 500 caracteres."),
});

type EditCommentFormValues = z.infer<typeof editCommentSchema>;

interface EditCommentFormProps {
	comment: Comment;
	isOpen: boolean;
	onClose: () => void;
	onCommentEdited: () => void;
}

export function EditCommentForm({
	comment,
	isOpen,
	onClose,
	onCommentEdited,
}: EditCommentFormProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<EditCommentFormValues>({
		resolver: zodResolver(editCommentSchema),
		defaultValues: {
			content: comment.content,
		},
	});

	// Resetar o formulário quando o modal for aberto ou o comentário mudar
	// Usar useEffect para sincronizar defaultValues com o 'comment' prop
	// No entanto, para 'defaultValues' em useForm, o ideal é que seja inicializado uma vez
	// Se 'comment.content' puder mudar enquanto o modal está fechado e você precisa refletir isso
	// quando ele abre novamente, chame 'reset' no `onClose` ou `isOpen` change.
	// Por simplicidade aqui, ele já vem com o valor inicial do comentário.

	const onSubmit = async (data: EditCommentFormValues) => {
		startTransition(async () => {
			const result = await editComment(comment.id, data.content);

			if (result.success) {
				toast.success("Comentário editado com sucesso!", {
					autoClose: 3000,
					theme: "dark",
				});
				onCommentEdited();
				router.refresh();
				onClose();
			} else {
				console.error("Erro ao editar comentário:", result.errors);
				toast.error(result.message || "Erro ao editar comentário!", {
					autoClose: 3000,
					theme: "dark",
				});
			}
		});
	};

	// Garante que o formulário seja resetado com o conteúdo atual do comentário
	// toda vez que o modal for aberto com um novo comentário ou reaberto.
	// Isso é crucial para que o campo de texto sempre exiba o último conteúdo.
	// Usamos um truque aqui: chamar reset quando o 'isOpen' muda e é verdadeiro,
	// passando o conteúdo mais recente do comentário.
	useEffect(() => {
		if (isOpen) {
			reset({ content: comment.content });
		}
	}, [isOpen, comment.content, reset]); // Dependências para re-executar

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Editar Comentário</DialogTitle>
					<DialogDescription>
						Faça as alterações no seu comentário aqui. Clique em salvar quando
						terminar.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="content">Conteúdo</Label>
						<Textarea
							id="content"
							{...register("content")}
							className="resize-y min-h-[100px]"
							disabled={isPending}
						/>
						{errors.content && (
							<p className="text-red-500 text-sm">{errors.content.message}</p>
						)}
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isPending}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Salvando..." : "Salvar alterações"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
