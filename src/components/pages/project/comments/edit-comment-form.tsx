"use client";

import { editCommentSchema } from "@/@types/zod";
import { editCommentAction } from "@/actions/comment";
import { TiptapEditor } from "@/components/global";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Comment } from "@prisma/client";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

type EditCommentFormValues = z.infer<typeof editCommentSchema>;

interface EditCommentFormProps {
	comment: Comment; // O objeto de comentário a ser editado (do Prisma)
	isOpen: boolean; // Controla a visibilidade do diálogo
	onClose?: () => void; // Callback opcional para fechar o diálogo
	onCommentEdited: (updatedContent: { content: string }) => void; // Callback acionado após a edição bem-sucedida
}

export function EditCommentForm({
	comment,
	isOpen,
	onClose,
	onCommentEdited,
}: EditCommentFormProps) {
	// --- Estados Locais e Transições ---
	const [isPending, startTransition] = useTransition(); // Gerencia o estado de "pending" da Server Action

	// --- Configuração do React Hook Form ---

	const form = useForm<EditCommentFormValues>({
		resolver: zodResolver(editCommentSchema), // Integração com Zod para validação
		defaultValues: {
			content: "", // Valor inicial do conteúdo do comentário
		},
		// Modo de validação para otimizar a performance (ex: 'onBlur', 'onChange', 'onSubmit')
		mode: "onBlur", // Validações ao sair do campo
	});

	// --- Handlers de Eventos ---

	const onSubmit = async (data: EditCommentFormValues) => {
		startTransition(async () => {
			// Chama a Server Action para editar o comentário, passando o ID e o novo conteúdo
			const result = await editCommentAction(comment.id, data.content);

			if (result.success) {
				toast.success("Comentário editado com sucesso!", {
					autoClose: 3000,
					theme: "dark",
				});
				onCommentEdited({ content: data.content }); // Notifica o componente pai/store sobre a atualização
				onClose?.(); // Fecha o diálogo se a edição for bem-sucedida
			} else {
				console.error("Erro ao editar comentário:", result.errors);
				toast.error(result.message || "Erro ao editar comentário!", {
					autoClose: 3000,
					theme: "dark",
				});
			}
		});
	};

	useEffect(() => {
		if (isOpen) {
			form.reset({ content: comment.content });
		}
	}, [isOpen, comment.content, form.reset]);

	// --- Renderização do Componente ---
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[650px]">
				<DialogHeader>
					<DialogTitle>Editar Comentário</DialogTitle>
					<DialogDescription>
						Faça as alterações no seu comentário aqui. Clique em salvar quando
						terminar.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="w-full space-y-3 ">
							<div className=" max-h-96 overflow-auto scrollbar-custom">
								<FormField
									name="content"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Descrição</FormLabel>
											<FormControl>
												<TiptapEditor
													value={field.value}
													onChange={field.onChange}
													disabled={isPending}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<Button className="w-full" type="submit" disabled={isPending}>
								{isPending ? "Adicionando..." : "Adicionar Comentário"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
