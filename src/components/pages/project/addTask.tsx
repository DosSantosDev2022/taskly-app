// src/components/pages/AddTask.tsx
"use client"; // Importante: este componente interage com o usuário e o estado do formulário
import { Bounce, toast } from "react-toastify";
import { useState, useTransition } from "react"; // useTransition para lidar com o estado de pending
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
} from "@/components/ui"; // Certifique-se de que os imports estão corretos
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTaskAction } from "@/actions/task/addTask"; // Importe sua Server Action
import {
	type CreateTaskInput,
	createTaskSchema,
} from "@/@types/forms/tasksSchema";

const AddTask = ({ projectId }: { projectId: string }) => {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const form = useForm<CreateTaskInput>({
		resolver: zodResolver(createTaskSchema),
		defaultValues: {
			title: "",
			description: "",
			projectId: projectId,
			status: "PENDING", // Valor padrão para o status
		},
	});

	const onSubmit = (values: CreateTaskInput) => {
		// Verificação provisória, você precisa garantir que projectId está disponível
		if (!projectId) {
			console.error("ID do projeto não disponível para adicionar tarefa.");
			// Talvez mostrar um toast de erro para o usuário
			return;
		}

		startTransition(async () => {
			const result = await addTaskAction({ ...values, projectId });

			if (result.success) {
				/* console.log("=== SUCESSO NA SUBMISSÃO ===");
				console.log("Tarefa adicionada com sucesso:", result.newTask); */
				toast.success("Tarefa cadastrada com sucesso!", {
					autoClose: 3000,
					theme: "dark",
					transition: Bounce,
				});
				form.reset(); // Limpa o formulário
				setOpen(false); // Fecha a modal
				// Você pode adicionar um toast de sucesso aqui
			} else {
				/* console.log("=== FALHA NA SUBMISSÃO ===");
				console.error("Erro ao adicionar tarefa:", result.errors); */
				toast.error("Erro ao cadastrar tarefa!", {
					autoClose: 3000,
					theme: "dark",
					transition: Bounce,
				});
				// Exibir erros para o usuário, talvez usando form.setError
				if (result.errors) {
					for (const key in result.errors) {
						if (Object.hasOwn(result.errors, key)) {
							form.setError(key as keyof CreateTaskInput, {
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

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Adicionar</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Nova tarefa</DialogTitle>
					<DialogDescription>
						Preencha os detalhes para adicionar uma nova tarefa ao projeto.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="grid gap-4 py-4"
				>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="title" className="text-right">
							Título
						</Label>
						<Input
							id="title"
							{...form.register("title")}
							className="col-span-3"
						/>
						{form.formState.errors.title && (
							<p className="col-span-4 text-red-500 text-sm">
								{form.formState.errors.title.message}
							</p>
						)}
					</div>
					<div className="grid grid-cols-4 items-start gap-4">
						<Label htmlFor="description" className="text-right pt-2">
							Descrição
						</Label>
						<Textarea
							id="description"
							{...form.register("description")}
							className="col-span-3"
						/>
						{form.formState.errors.description && (
							<p className="col-span-4 text-red-500 text-sm">
								{form.formState.errors.description.message}
							</p>
						)}
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="status" className="text-right">
							Status
						</Label>
						<Select
							onValueChange={(value) =>
								form.setValue(
									"status",
									value as "PENDING" | "IN_PROGRESS" | "COMPLETED",
								)
							}
							value={form.watch("status")}
						>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Selecione um status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="PENDING">Pendente</SelectItem>
								<SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
								<SelectItem value="COMPLETED">Concluída</SelectItem>
							</SelectContent>
						</Select>
						{form.formState.errors.status && (
							<p className="col-span-4 text-red-500 text-sm">
								{form.formState.errors.status.message}
							</p>
						)}
					</div>
					<Button type="submit" disabled={isPending} className="w-full mt-4">
						{isPending ? "Adicionando..." : "Adicionar Tarefa"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export { AddTask };
