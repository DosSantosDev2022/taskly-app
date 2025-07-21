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

// --- Tipagem das Props ---
/**
 * @interface AddCommentProps
 * @description Propriedades esperadas pelo componente AddComment.
 */
interface AddCommentProps {
	projectId: string; // ID do projeto ao qual o comentário será adicionado
	onCommentAdded?: () => void; // Callback opcional a ser acionado após a adição bem-sucedida do comentário
}

/**
 * @component AddComment
 * @description Componente que permite aos usuários adicionar um novo comentário a um projeto.
 * Exibe um diálogo com um campo de texto e um botão de envio.
 */
const AddComment = ({ projectId, onCommentAdded }: AddCommentProps) => {
	// --- Estados Locais e Transições ---
	const [isOpen, setIsOpen] = useState(false); // Controla a visibilidade do Dialog
	const [isPending, startTransition] = useTransition(); // Gerencia o estado de envio do formulário
	const [commentContent, setCommentContent] = useState(""); // Armazena o conteúdo do comentário digitado

	// --- Referências ---
	// Opcional: formRef não está sendo usado diretamente para FormData devido ao controle do estado
	// mas pode ser útil para outras interações com o formulário se necessário no futuro.
	const formRef = useRef<HTMLFormElement>(null);

	// --- Handlers de Eventos ---
	/**
	 * @function handleSubmit
	 * @description Lida com o envio do formulário de adição de comentário.
	 * Valida o conteúdo, constrói o FormData e chama a Server Action.
	 * @param {React.FormEvent} event - O evento de envio do formulário.
	 */
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault(); // Previne o comportamento padrão do formulário HTML

		// Validação de entrada: verifica se o comentário não está vazio ou apenas com espaços em branco
		if (!commentContent.trim()) {
			toast.error("O comentário não pode ser vazio.", {
				autoClose: 3000,
				theme: "dark",
			});
			return; // Interrompe a execução se a validação falhar
		}

		// Cria um objeto FormData para enviar os dados à Server Action
		const formData = new FormData();
		formData.append("content", commentContent);
		formData.append("projectId", projectId);

		// Inicia a transição para exibir o estado de "pendente" (loading)
		startTransition(async () => {
			const result = await addComment(formData); // Chama a Server Action

			if (result.success) {
				toast.success("Comentário adicionado com sucesso!", {
					autoClose: 3000,
					theme: "dark",
				});
				setCommentContent(""); // Limpa o campo de texto após o sucesso
				setIsOpen(false); // Fecha o Dialog
				onCommentAdded?.(); // Aciona o callback opcional, se fornecido
			} else {
				// Trata e exibe mensagens de erro (validação ou geral)
				if (result.errors) {
					// Se houver erros de validação específicos
					Object.values(result.errors)
						.flat() // Transforma array de arrays de erros em um único array
						.forEach((errorMsg) => {
							toast.error(errorMsg, { autoClose: 3000, theme: "dark" });
						});
				} else {
					// Mensagem de erro genérica se não houver erros específicos
					toast.error(result.message || "Erro ao adicionar comentário.", {
						autoClose: 3000,
						theme: "dark",
					});
				}
			}
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
				<form onSubmit={handleSubmit} ref={formRef}>
					<div className="w-full space-y-3">
						<Textarea
							placeholder="Deixe seu comentário..."
							name="content" // Importante para que FormData possa capturar o valor
							value={commentContent}
							onChange={(e) => setCommentContent(e.target.value)}
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
