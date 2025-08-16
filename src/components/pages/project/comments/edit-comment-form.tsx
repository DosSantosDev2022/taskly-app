"use client";

import { editCommentSchema } from "@/@types/zod";
import { editCommentAction } from "@/actions/comment";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Label,
	Textarea,
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
	const {
		register, // Função para registrar inputs do formulário
		handleSubmit, // Função para lidar com a submissão do formulário
		formState: { errors }, // Objeto que contém os erros de validação
		reset, // Função para resetar os valores do formulário
	} = useForm<EditCommentFormValues>({
		resolver: zodResolver(editCommentSchema), // Integração com Zod para validação
		defaultValues: {
			content: comment.content, // Define o conteúdo atual do comentário como valor padrão
		},
		mode: "onBlur", // Valida os campos ao perderem o foco
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
			reset({ content: comment.content });
		}
	}, [isOpen, comment.content, reset]);

	// --- Renderização do Componente ---
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-3xl h-full max-h-[90vh]  grid grid-rows-[auto,1fr,auto]">
				<DialogHeader>
					<DialogTitle>Editar Comentário</DialogTitle>
					<DialogDescription>
						Faça as alterações no seu comentário aqui. Clique em salvar quando
						terminar.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4 overflow-y-auto scrollbar-custom pr-2"
				>
					<div className="grid gap-2">
						<Label htmlFor="content">Conteúdo</Label>
						<Textarea
							id="content"
							{...register("content")} // Registra o textarea no React Hook Form
							className="resize-y min-h-[250px]" // Permite redimensionamento vertical, mínimo de 100px
							disabled={isPending} // Desabilita o campo enquanto o envio está pendente
							aria-invalid={errors.content ? "true" : "false"} // Acessibilidade: indica se há erro
							aria-describedby="content-error"
							rows={5} // Define um número de linhas padrão
						/>
						{errors.content && (
							<p
								id="content-error"
								role="alert"
								className="text-destructive text-sm"
							>
								{errors.content.message}
							</p>
						)}
					</div>
					<DialogFooter>
						{/* Botão Cancelar */}
						<Button
							type="button"
							variant="outline"
							onClick={onClose} // Usa o callback onClose para fechar o diálogo
							disabled={isPending} // Desabilita enquanto a requisição está pendente
							aria-label="Cancelar edição"
						>
							Cancelar
						</Button>
						{/* Botão Salvar */}
						<Button
							type="submit"
							disabled={isPending}
							aria-label="Salvar alterações no comentário"
						>
							{isPending ? "Salvando..." : "Salvar alterações"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
