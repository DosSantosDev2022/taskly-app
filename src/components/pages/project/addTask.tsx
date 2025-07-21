"use client";

import { Bounce, toast } from "react-toastify";
import { useState, useTransition } from "react";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
	Label,
	Textarea,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTaskAction } from "@/actions/task/addTask";
import {
	type CreateTaskInput,
	createTaskSchema,
} from "@/@types/forms/tasksSchema";

// --- Tipagem das Props ---
/**
 * @interface AddTaskProps
 * @description Propriedades esperadas pelo componente AddTask.
 */
interface AddTaskProps {
	projectId: string; // ID do projeto ao qual a tarefa será adicionada
}

/**
 * @component AddTask
 * @description Componente para adicionar uma nova tarefa a um projeto específico.
 * Utiliza Shadcn UI para o modal e formulário, React Hook Form para gerenciamento
 * de formulário e Zod para validação.
 */
const AddTask = ({ projectId }: AddTaskProps) => {
	// --- Estados Locais e Transições ---
	const [open, setOpen] = useState(false); // Controla a visibilidade do Dialog/Modal
	const [isPending, startTransition] = useTransition(); // Gerencia o estado de "pending" (carregando) da Server Action

	// --- Configuração do React Hook Form ---
	const form = useForm<CreateTaskInput>({
		resolver: zodResolver(createTaskSchema), // Integração com Zod para validação
		defaultValues: {
			title: "",
			description: "",
			projectId: projectId, // Define o ID do projeto como valor padrão
			status: "PENDING", // Define o status inicial padrão para "Pendente"
		},
		// Modo de validação para otimizar a performance (ex: 'onBlur', 'onChange', 'onSubmit')
		mode: "onBlur", // Validações ao sair do campo
	});

	// --- Handlers de Eventos ---

	/**
	 * @function onSubmit
	 * @description Lida com o envio do formulário.
	 * Acionado pelo `form.handleSubmit` do React Hook Form.
	 * @param {CreateTaskInput} values - Os valores do formulário validados.
	 */
	const onSubmit = (values: CreateTaskInput) => {
		// Validação adicional: garante que projectId esteja sempre presente antes de enviar.
		// Embora já seja padrão, é uma boa prática de segurança.
		if (!projectId) {
			toast.error(
				"Erro interno: ID do projeto não disponível para adicionar tarefa.",
				{
					autoClose: 3000,
					theme: "dark",
				},
			);
			console.error("ID do projeto não disponível para adicionar tarefa.");
			return;
		}

		// Inicia a transição de UI para o estado de "pending"
		startTransition(async () => {
			// Chama a Server Action com os valores do formulário, incluindo o projectId
			const result = await addTaskAction({ ...values, projectId });

			if (result.success) {
				toast.success("Tarefa cadastrada com sucesso!", {
					autoClose: 3000,
					theme: "dark",
					transition: Bounce,
				});
				form.reset(); // Limpa todos os campos do formulário
				setOpen(false); // Fecha o modal
			} else {
				toast.error(result.message || "Erro ao cadastrar tarefa!", {
					autoClose: 3000,
					theme: "dark",
					transition: Bounce,
				});

				// Se houver erros de validação específicos retornados pela Server Action
				if (result.errors) {
					// Itera sobre os erros e os define no formulário para exibição ao usuário
					for (const key in result.errors) {
						if (Object.hasOwn(result.errors, key)) {
							// Garante que 'key' é um nome de campo válido e define o erro
							form.setError(key as keyof CreateTaskInput, {
								type: "server",
								message:
									result.errors[key as keyof typeof result.errors]?.[0] || // Pega a primeira mensagem de erro, se for um array
									String(result.errors[key as keyof typeof result.errors]), // Fallback para string direta
							});
						}
					}
				}
			}
		});
	};

	// --- Renderização do Componente ---
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{/* Botão que abre o modal de adicionar tarefa */}
				<Button
					variant="outline"
					aria-label="Abrir formulário para adicionar nova tarefa"
				>
					Adicionar
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Nova tarefa</DialogTitle>
					<DialogDescription>
						Preencha os detalhes para adicionar uma nova tarefa ao projeto.
					</DialogDescription>
				</DialogHeader>
				{/* Formulário de adição de tarefa */}
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="grid gap-4 py-4"
				>
					{/* Campo: Título da Tarefa */}
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="title" className="text-right">
							Título
						</Label>
						<Input
							id="title"
							{...form.register("title")} // Registra o input no React Hook Form
							className="col-span-3"
							disabled={isPending} // Desabilita enquanto a requisição está pendente
							aria-invalid={form.formState.errors.title ? "true" : "false"} // Acessibilidade: indica erro
							aria-describedby="title-error" // Acessibilidade: associa ao parágrafo de erro
						/>
						{form.formState.errors.title && (
							<p
								id="title-error"
								role="alert"
								className="col-span-4 text-destructive text-sm"
							>
								{form.formState.errors.title.message}
							</p>
						)}
					</div>

					{/* Campo: Descrição da Tarefa */}
					<div className="grid grid-cols-4 items-start gap-4">
						<Label htmlFor="description" className="text-right pt-2">
							Descrição
						</Label>
						<Textarea
							id="description"
							{...form.register("description")} // Registra o textarea no React Hook Form
							className="col-span-3"
							disabled={isPending} // Desabilita enquanto a requisição está pendente
							aria-invalid={
								form.formState.errors.description ? "true" : "false"
							}
							aria-describedby="description-error"
							rows={4} // Define um número de linhas padrão para o textarea
						/>
						{form.formState.errors.description && (
							<p
								id="description-error"
								role="alert"
								className="col-span-4 text-destructive text-sm"
							>
								{form.formState.errors.description.message}
							</p>
						)}
					</div>

					{/* Campo: Status da Tarefa (Select) */}
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="status" className="text-right">
							Status
						</Label>
						<Select
							onValueChange={(value) =>
								form.setValue(
									"status",
									value as "PENDING" | "IN_PROGRESS" | "COMPLETED",
									{ shouldValidate: true, shouldDirty: true }, // Valida e marca como "dirty" na mudança
								)
							}
							value={form.watch("status")} // Controla o valor do Select com React Hook Form
							disabled={isPending} // Desabilita enquanto a requisição está pendente
						>
							<SelectTrigger
								className="col-span-3"
								id="status"
								aria-label="Status da Tarefa"
							>
								<SelectValue placeholder="Selecione um status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="PENDING">Pendente</SelectItem>
								<SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
								<SelectItem value="COMPLETED">Concluída</SelectItem>
							</SelectContent>
						</Select>
						{form.formState.errors.status && (
							<p role="alert" className="col-span-4 text-destructive text-sm">
								{form.formState.errors.status.message}
							</p>
						)}
					</div>

					{/* Botão de Submissão */}
					<Button type="submit" disabled={isPending} className="w-full mt-4">
						{isPending ? "Adicionando..." : "Adicionar Tarefa"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export { AddTask };
