"use client";

import { type CreateTaskInput, TaskSchema } from "@/@types/zod";
import { TiptapEditor } from "@/components/global";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui";
import { useAddTask } from "@/hooks/task/use-add-task";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSX, useState } from "react"; // Adicionando JSX para tipagem
import { useForm } from "react-hook-form";

interface AddTaskProps {
	projectId: string; // ID do projeto ao qual a tarefa será adicionada
}

/**
 * @name AddTask
 * @description Componente para adicionar uma nova tarefa a um projeto.
 * @param {object} props - As props do componente.
 * @param {string} props.projectId - O ID do projeto.
 * @returns {JSX.Element} Um componente de modal para adicionar tarefa.
 */
const AddTask = ({ projectId }: AddTaskProps): JSX.Element => {
	// --- Estados Locais e Transições ---
	const [open, setOpen] = useState(false); // Controla a visibilidade do Dialog/Modal
	// --- Hook de Mutação para Adicionar Tarefa ---
	const { mutate, isPending } = useAddTask();
	// --- Configuração do React Hook Form ---
	const form = useForm<CreateTaskInput>({
		resolver: zodResolver(TaskSchema), // Integração com Zod para validação
		defaultValues: {
			title: "",
			description: "",
			projectId: projectId, // Define o ID do projeto como valor padrão
			status: "PENDING", // Define o status inicial padrão para "Pendente"
		},
		// Modo de validação para otimizar a performance
		mode: "onBlur", // Validações ao sair do campo
	});

	// --- Handlers de Eventos ---
	const onSubmit = (values: CreateTaskInput) => {
		if (!projectId) {
			console.error("ID do projeto não disponível para adicionar tarefa.");
			return;
		}
		// Chama a função `mutate` do hook do React Query
		mutate(values, {
			onSuccess: () => {
				form.reset();
				setOpen(false);
			},
		});
	};

	// --- Renderização do Componente ---
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					aria-label="Abrir formulário para adicionar nova tarefa"
				>
					Adicionar
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[650px]">
				{" "}
				{/* Aumentando a largura do modal para o editor */}
				<DialogHeader>
					<DialogTitle>Nova tarefa</DialogTitle>
					<DialogDescription>
						Preencha os detalhes para adicionar uma nova tarefa ao projeto.
					</DialogDescription>
				</DialogHeader>
				{/* Formulário de adição de tarefa */}
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid gap-4 py-4"
					>
						{/* Campo: Título da Tarefa */}
						<FormField
							name="title"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Título</FormLabel>
									<FormControl>
										<Input
											placeholder="Ex: Criar tela de login"
											{...field}
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Campo: Descrição da Tarefa com TiptapEditor */}
						<FormField
							name="description"
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

						{/* Campo: Status da Tarefa (Select) */}
						<FormField
							name="status"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={isPending}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Selecione um status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="PENDING">Pendente</SelectItem>
											<SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
											<SelectItem value="COMPLETED">Concluída</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Botão de Submissão */}
						<Button type="submit" disabled={isPending} className="w-full mt-4">
							{isPending ? "Adicionando..." : "Adicionar Tarefa"}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export { AddTask };
