"use client";

import { TaskSchema } from "@/@types/zod";
import { TiptapEditor } from "@/components/global";
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
} from "@/components/ui";
import { useUpdateTask } from "@/hooks/task/use-update-task";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type EditTaskFormValues = z.infer<typeof TaskSchema>;

interface EditTaskModalProps {
	isOpen: boolean; // Controla a visibilidade do modal
	onClose: () => void; // Callback para fechar o modal
	task: {
		projectId: string; // ID do projeto ao qual a tarefa pertence
		id: string;
		title: string;
		description: string | null;
		status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
	};
	onTaskUpdated?: (updatedTaskDetails: {
		title: string;
		description: string | null;
	}) => void; // Callback acionado após a atualização bem-sucedida da tarefa
}

export function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
	// --- Estados Locais e Transições ---
	const { mutate, isPending } = useUpdateTask();

	// --- Configuração do React Hook Form ---
	const form = useForm<EditTaskFormValues>({
		resolver: zodResolver(TaskSchema), // Integração com Zod para validação
		defaultValues: {
			title: task.title,
			description: task.description || "",
			projectId: task.projectId,
			status: task.status,
		},
		mode: "onBlur", // Valida os campos ao perderem o foco para melhor UX
	});

	useEffect(() => {
		if (isOpen) {
			form.reset({
				title: task.title,
				description: task.description || "",
				projectId: task.projectId,
				status: task.status,
			});
		}
	}, [isOpen, task, form]);

	const onSubmit = (values: EditTaskFormValues) => {
		// Use a função `mutate` diretamente
		mutate(
			{ taskId: task.id, taskData: values },
			{
				onSuccess: () => {
					onClose(); // Fecha o modal após o sucesso
				},
			},
		);
	};
	// --- Renderização do Componente ---
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[650px]">
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
										<TiptapEditor
											value={field.value}
											onChange={field.onChange}
											disabled={isPending}
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
