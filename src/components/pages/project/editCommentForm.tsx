"use client";

import { editCommentSchema } from "@/@types/zod/commentFormSchema";
import { editComment } from "@/actions/comment/editComment";
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

/**
 * @type EditCommentFormValues
 * @description Tipo inferido do schema Zod para as propriedades do formulário.
 */
type EditCommentFormValues = z.infer<typeof editCommentSchema>;

// --- Tipagem das Props ---
/**
 * @interface EditCommentFormProps
 * @description Propriedades esperadas pelo componente EditCommentForm.
 */
interface EditCommentFormProps {
	comment: Comment; // O objeto de comentário a ser editado (do Prisma)
	isOpen: boolean; // Controla a visibilidade do diálogo
	onClose?: () => void; // Callback opcional para fechar o diálogo
	onCommentEdited: (updatedContent: { content: string }) => void; // Callback acionado após a edição bem-sucedida
}

/**
 * @component EditCommentForm
 * @description Componente para edição de um comentário existente.
 * Apresenta um formulário dentro de um diálogo e interage com uma Server Action.
 */
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

	/**
	 * @function onSubmit
	 * @description Lida com a submissão do formulário de edição.
	 * Chama a Server Action para atualizar o comentário e trata os resultados.
	 * @param {EditCommentFormValues} data - Os valores do formulário validados.
	 */
	const onSubmit = async (data: EditCommentFormValues) => {
		startTransition(async () => {
			// Chama a Server Action para editar o comentário, passando o ID e o novo conteúdo
			const result = await editComment(comment.id, data.content);

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

	// --- Efeitos Colaterais ---
	/**
	 * @hook useEffect
	 * @description Reseta o formulário com o conteúdo atual do comentário sempre que o modal é aberto
	 * ou o comentário em si muda (caso seja re-renderizado com um novo comentário).
	 */
	useEffect(() => {
		if (isOpen) {
			// Reseta o formulário com o conteúdo mais recente do comentário.
			// O `reset` é importante para garantir que o formulário mostre sempre
			// o estado mais atual do comentário quando o modal for reaberto.
			reset({ content: comment.content });
		}
	}, [isOpen, comment.content, reset]); // Dependências: re-executa se modal abrir, conteúdo do comentário mudar ou a função reset mudar.

	// --- Renderização do Componente ---
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
							{...register("content")} // Registra o textarea no React Hook Form
							className="resize-y min-h-[100px]" // Permite redimensionamento vertical, mínimo de 100px
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
