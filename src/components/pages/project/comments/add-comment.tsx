"use client";
import { commentSchema, CreateCommentInput } from "@/@types/zod";
import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Textarea,
} from "@/components/ui";
import { useAddComment } from "@/hooks/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface AddCommentProps {
	projectId: string; // ID do projeto ao qual o comentário será adicionado
	onCommentAdded?: () => void; // Callback opcional a ser acionado após a adição bem-sucedida do comentário
}

const AddComment = ({ projectId, onCommentAdded }: AddCommentProps) => {
	// --- Estados Locais e Transições ---
	const [isOpen, setIsOpen] = useState(false);
	// Utiliza o hook useAddComment para gerenciar a mutação
	const { mutate, isPending } = useAddComment();

	// --- Configuração do React Hook Form ---
	const form = useForm<CreateCommentInput>({
		resolver: zodResolver(commentSchema), // Integração com Zod para validação
		defaultValues: {
			content: "", // Valor inicial do conteúdo do comentário
			projectId: projectId, // Define o ID do projeto como valor padrão
		},
		// Modo de validação para otimizar a performance (ex: 'onBlur', 'onChange', 'onSubmit')
		mode: "onBlur", // Validações ao sair do campo
	});

	const onSubmit = (values: CreateCommentInput) => {
		// Inicia a transição para exibir o estado de "pendente" (loading)
		mutate(values, {
			onSuccess: () => {
				form.reset();
				setIsOpen(false);
				onCommentAdded?.();
			},
		});
	};

	// --- Renderização do Componente ---
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{/* Botão que abre o modal de adicionar comentário */}
				<Button
					variant="outline"
					aria-label="Abrir formulário para adicionar comentário"
				>
					Adicionar Comentário
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[768px]">
				<DialogHeader>
					<DialogTitle>Novo Comentário</DialogTitle>
				</DialogHeader>
				{/* Formulário para entrada do comentário */}
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="w-full space-y-3">
						<Textarea
							placeholder="Deixe seu comentário..."
							{...form.register("content")}
							disabled={isPending} // Desabilita o campo enquanto o envio está pendente
							aria-label="Conteúdo do comentário" // Acessibilidade
							rows={5} // Define um número de linhas padrão para o textarea
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
