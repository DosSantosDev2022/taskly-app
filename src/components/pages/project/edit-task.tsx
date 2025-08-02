"use client";

import { TaskSchema } from "@/@types/zod";
import { updateTask } from "@/actions/task";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Textarea,
} from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

// --- Tipagem dos Dados do Formulário ---
/**
 * @type EditTaskFormValues
 * @description Tipo inferido do schema Zod para os valores do formulário.
 */
type EditTaskFormValues = z.infer<typeof TaskSchema>;

// --- Tipagem das Props ---
/**
 * @interface EditTaskModalProps
 * @description Propriedades esperadas pelo componente EditTaskModal.
 */
interface EditTaskModalProps {
	isOpen: boolean; // Controla a visibilidade do modal
	onClose: () => void; // Callback para fechar o modal
	task: {
		// Detalhes da tarefa a ser editada
		id: string;
		title: string;
		description: string | null;
	};
	onTaskUpdated: (updatedTaskDetails: {
		title: string;
		description: string | null;
	}) => void; // Callback acionado após a atualização bem-sucedida da tarefa
}

/**
 * @component EditTaskModal
 * @description Componente de modal para edição de tarefas.
 * Utiliza React Hook Form para gerenciamento do formulário, Zod para validação
 * e interage com a Server Action `updateTask`.
 */
export function EditTaskModal({
	isOpen,
	onClose,
	task,
	onTaskUpdated,
}: EditTaskModalProps) {
	// --- Estados Locais e Transições ---
	const [isPending, startTransition] = useTransition(); // Gerencia o estado de "pending" (carregando) da Server Action

	// --- Configuração do React Hook Form ---
	const form = useForm<EditTaskFormValues>({
		resolver: zodResolver(TaskSchema), // Integração com Zod para validação
		defaultValues: {
			title: task.title,
			description: task.description || "",
		},
		mode: "onBlur", // Valida os campos ao perderem o foco para melhor UX
	});

	// --- Efeitos Colaterais ---
	/**
	 * @hook useEffect
	 * @description Reseta o formulário com os valores da tarefa sempre que
	 * o modal é aberto ou a tarefa em si muda. Isso garante que o formulário
	 * sempre exiba os dados mais recentes da tarefa.
	 */
	useEffect(() => {
		if (isOpen) {
			form.reset({
				title: task.title,
				description: task.description || "",
			});
		}
	}, [isOpen, task, form]);

	// --- Handlers de Eventos ---

	/**
	 * @function onSubmit
	 * @description Lida com a submissão do formulário de edição de tarefa.
	 * Chama a Server Action `updateTask` e trata o resultado.
	 * @param {EditTaskFormValues} values - Os valores validados do formulário.
	 */
	const onSubmit = (values: EditTaskFormValues) => {
		startTransition(async () => {
			// Chama a Server Action para atualizar a tarefa
			const result = await updateTask(task.id, values);

			if (result.success) {
				toast.success("Tarefa atualizada com sucesso!", {
					autoClose: 3000,
					theme: "dark",
				});
				// Notifica o componente pai/store sobre os detalhes atualizados da tarefa
				onTaskUpdated({ title: values.title, description: values.description });
				onClose(); // Fecha o modal após o sucesso
			} else {
				console.error(
					"Erro ao atualizar tarefa:",
					result.errors || result.message,
				);
				toast.error(result.message || "Erro ao atualizar tarefa.", {
					autoClose: 3000,
					theme: "dark",
				});
				// Se a Server Action retornar erros de validação específicos
				if (result.errors) {
					for (const key in result.errors) {
						if (Object.hasOwn(result.errors, key)) {
							form.setError(key as keyof EditTaskFormValues, {
								type: "server",
								message:
									result.errors[key as keyof typeof result.errors]?.[0] ||
									String(result.errors[key as keyof typeof result.errors]),
							});
						}
					}
				}
			}
		});
	};

	// --- Renderização do Componente ---
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Editar Tarefa</DialogTitle>
					<DialogDescription>
						Faça as alterações na tarefa aqui. Clique em salvar quando terminar.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{/* Campo: Título da Tarefa */}
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Título</FormLabel>
									<FormControl>
										<Input
											placeholder="Título da tarefa"
											{...field}
											disabled={isPending} // Desabilita o campo durante o envio
											aria-invalid={
												form.formState.errors.title ? "true" : "false"
											} // Acessibilidade: indica erro
											aria-describedby="title-error" // Associa ao parágrafo de erro
										/>
									</FormControl>
									{form.formState.errors.title && (
										<p
											id="title-error"
											role="alert"
											className="text-red-500 text-sm"
										>
											{form.formState.errors.title.message}
										</p>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Campo: Descrição da Tarefa */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrição</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Descrição da tarefa (opcional)"
											className="resize-y" // Permite redimensionamento vertical
											{...field}
											value={field.value || ""} // Garante que o Textarea trate null como string vazia
											disabled={isPending}
											aria-invalid={
												form.formState.errors.description ? "true" : "false"
											}
											aria-describedby="description-error"
											rows={5} // Define um número de linhas padrão
										/>
									</FormControl>
									{form.formState.errors.description && (
										<p
											id="description-error"
											role="alert"
											className="text-red-500 text-sm"
										>
											{form.formState.errors.description.message}
										</p>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							{/* Botão Cancelar */}
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								disabled={isPending} // Desabilita durante o envio
								aria-label="Cancelar edição da tarefa"
							>
								Cancelar
							</Button>
							{/* Botão Salvar Alterações */}
							<Button
								type="submit"
								disabled={isPending}
								aria-label="Salvar alterações na tarefa"
							>
								{isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
										{/* Ícone de carregamento */}
										Salvando...
									</>
								) : (
									"Salvar alterações"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
