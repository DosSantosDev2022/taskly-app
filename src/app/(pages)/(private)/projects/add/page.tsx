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
import { createProject } from "@/actions/project/addProject";
import { useTransition } from "react";
import type z from "zod";
import { toast } from "react-toastify";

// Dados simulados para o seletor de clientes
const mockClients = [
	{ id: "a9f04538-f934-4e4f-8d7d-fa85fd1eb741", name: "Tech Solutions Ltda." },
	{ id: "029efec5-e893-4c23-9b9b-ae22033a83d9", name: "Inovação Digital S.A." },
	{ id: "f26da8dd-397f-413e-b9ed-d647b050d190", name: "Global Ventures" },
];

export default function AddNewProjectPage() {
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			type: "WEB",
			status: "PENDING",
			clientId: undefined,
			deadlineDate: undefined,
		},
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
				await createProject(formData);
				toast.success("Novo projeto adicionado com sucesso!");
				form.reset();
			} catch (error) {
				toast.error("Erro ao adicionar novo projeto");
				console.error("Erro ao enviar formulário:", error);
			}
		});
	}

	return (
		<div className="container mx-auto max-w-2xl pt-24 p-4 mt-20">
			<div className="space-y-4 mb-8">
				<h1 className="text-3xl font-bold">Adicionar Novo Projeto</h1>
				<p className="text-muted-foreground">
					Preencha os campos abaixo para cadastrar um novo projeto.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					{/* Nome, Tipo e Subtipo */}
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
					<FormField
						name="type"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tipo de projeto</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
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

					{/* Datas (Criação e Prazo) */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* <FormField
							name="creationDate"
							control={form.control}
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Data de Criação</FormLabel>
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
												disabled
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/> */}
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
					</div>

					{/* Status e Cliente (Combobox) */}
					<FormField
						name="status"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Status do Projeto</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
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
					{/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
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
														? mockClients.find((c) => c.id === field.value)
																?.name
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
												{mockClients.map((client) => (
													<CommandItem
														value={client.name}
														key={client.id}
														onSelect={() => {
															form.setValue("clientId", client.id);
														}}
													>
														{" "}
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

					{/* Descrição e Upload de Imagens */}
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
					{/* <FormField
						name="images"
						control={form.control}
						render={({ field: { onChange, value, ...rest } }) => (
							<FormItem>
								<FormLabel>Imagens de Preview</FormLabel>
								<FormControl>
									<Input
										type="file"
										multiple
										accept="image/png, image/jpeg, image/webp"
										onChange={(e) => onChange(e.target.files)}
										{...rest}
									/>
								</FormControl>
								<FormDescription>
									Selecione uma ou mais imagens.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/> */}

					<Button type="submit" className="w-full md:w-auto">
						Criar Projeto
					</Button>
				</form>
			</Form>
		</div>
	);
}
