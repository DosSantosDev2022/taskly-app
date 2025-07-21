// src/components/project/EditTaskModal.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useEffect, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateTask } from "@/actions/task/updateTask";

// Esquema de validação com Zod
const formSchema = z.object({
	title: z
		.string()
		.min(1, "O título é obrigatório.")
		.max(100, "O título não pode ter mais de 100 caracteres."),
	description: z
		.string()
		.max(500, "A descrição não pode ter mais de 500 caracteres.")
		.nullable(),
});

// Tipagem dos dados do formulário
type EditTaskFormValues = z.infer<typeof formSchema>;

interface EditTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	task: {
		id: string;
		title: string;
		description: string | null;
	};
	onTaskUpdated: (updatedTaskDetails: {
		title: string;
		description: string | null;
	}) => void; // Callback para quando a tarefa for atualizada
}

export function EditTaskModal({
	isOpen,
	onClose,
	task,
	onTaskUpdated,
}: EditTaskModalProps) {
	const [isPending, startTransition] = useTransition();

	const form = useForm<EditTaskFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: task.title,
			description: task.description,
		},
	});

	// Resetar o formulário quando a tarefa mudar ou o modal abrir/fechar
	// Isso garante que os valores iniciais estejam sempre corretos.
	useEffect(() => {
		if (isOpen) {
			form.reset({
				title: task.title,
				description: task.description,
			});
		}
	}, [isOpen, task, form]);

	const onSubmit = (values: EditTaskFormValues) => {
		startTransition(async () => {
			const result = await updateTask(task.id, values);

			if (result.success) {
				toast.success("Tarefa atualizada com sucesso!", {
					autoClose: 3000,
					theme: "dark",
				});
				onTaskUpdated({ title: values.title, description: values.description }); // Notifica o componente pai sobre a atualização
				onClose(); // Fecha o modal
			} else {
				console.error("Erro ao atualizar tarefa:", result.errors);
				toast.error(result.message || "Erro ao atualizar tarefa.", {
					autoClose: 3000,
					theme: "dark",
				});
			}
		});
	};

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
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Título</FormLabel>
									<FormControl>
										<Input placeholder="Título da tarefa" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrição</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Descrição da tarefa (opcional)"
											className="resize-y"
											{...field}
											value={field.value || ""} // Garante que Textarea controle corretamente null
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={onClose}>
								Cancelar
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
