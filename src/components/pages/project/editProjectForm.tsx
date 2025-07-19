// src/app/project/edit/[id]/_components/edit-project-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils";
import { formSchema } from "@/@types/forms/projectSchema";
import { useTransition } from "react";
import type z from "zod";
import { updateProject } from "@/actions/project/updateProject"; // Importa a Server Action de update
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";

interface Client {
	id: string;
	name: string;
}

interface EditProjectFormProps {
	projectId: string;
	defaultValues: z.infer<typeof formSchema>;
	clients: Client[];
}

export function EditProjectForm({
	projectId,
	defaultValues,
	clients,
}: EditProjectFormProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues,
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const formData = new FormData();

		formData.append("name", values.name);
		formData.append("description", values.description || "");
		formData.append("type", values.type);
		formData.append("status", values.status);
		if (values.deadlineDate) {
			formData.append("deadlineDate", values.deadlineDate.toISOString());
		}
		if (values.clientId) {
			formData.append("clientId", values.clientId);
		}

		startTransition(async () => {
			try {
				// Passa o projectId e o prevState (null, já que não estamos usando useFormState aqui)
				await updateProject(projectId, null, formData);
				toast.success("Projeto atualizado com sucesso!", {
					autoClose: 3000,
					theme: "dark",
				});
				router.push(`/projects/${projectId}`);
			} catch (error) {
				toast.error("erro ao editar projeto!", {
					autoClose: 3000,
					theme: "dark",
				});
				console.error("Erro ao enviar formulário:", error);
			}
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{/* Nome do Projeto */}
				<FormField
					name="name"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input placeholder="Ex: App de Finanças" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Tipo de Projeto */}
				<FormField
					name="type"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tipo de projeto</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Selecione o tipo de projeto" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="WEB">Web</SelectItem>
									<SelectItem value="MOBILE">Mobile</SelectItem>
									<SelectItem value="SISTEMA">Sistema</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Data de Prazo */}
				<FormField
					name="deadlineDate"
					control={form.control}
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Data de Prazo</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"pl-3 text-left font-normal",
												!field.value && "text-muted-foreground",
											)}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{field.value ? (
												formatDate(field.value)
											) : (
												<span>Escolha uma data</span>
											)}
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Status do Projeto */}
				<FormField
					name="status"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status do Projeto</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Selecione o status atual" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="PENDING">Pendente</SelectItem>
									<SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
									<SelectItem value="COMPLETED">Concluído</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Cliente (Combobox) */}
				<FormField
					name="clientId"
					control={form.control}
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Cliente</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										{/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
										<Button
											variant="outline"
											role="combobox"
											className={cn(
												"w-full justify-between",
												!field.value && "text-muted-foreground",
											)}
										>
											<span className="truncate">
												{field.value
													? clients.find((c) => c.id === field.value)?.name
													: "Selecione um cliente"}
											</span>
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-xl p-0">
									<Command>
										<CommandInput placeholder="Buscar cliente..." />
										<CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
										<CommandGroup>
											{clients.map((client) => (
												<CommandItem
													value={client.name}
													key={client.id}
													onSelect={() => {
														form.setValue(
															"clientId",
															client.id === field.value ? undefined : client.id,
														); // Toggle selection
													}}
												>
													<Check
														className={cn(
															"mr-2 h-4 w-4",
															client.id === field.value
																? "opacity-100"
																: "opacity-0",
														)}
													/>
													{client.name}
												</CommandItem>
											))}
										</CommandGroup>
									</Command>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Descrição */}
				<FormField
					name="description"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descrição</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Descreva o objetivo do projeto..."
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full md:w-auto" disabled={isPending}>
					{isPending ? "Atualizando..." : "Atualizar Projeto"}
				</Button>
			</form>
		</Form>
	);
}
