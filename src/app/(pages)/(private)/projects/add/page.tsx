// Em: src/app/projects/new/page.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
	FormDescription,
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

// Dados simulados para o seletor de clientes
const mockClients = [
	{ id: "1", name: "Tech Corp" },
	{ id: "2", name: "Innovate Solutions" },
	{ id: "3", name: "Creative Minds" },
	{ id: "4", name: "Data Systems" },
];

// Esquema de validação com Zod atualizado com todos os campos
const formSchema = z.object({
	name: z
		.string()
		.min(2, "O nome do projeto deve ter pelo menos 2 caracteres."),
	description: z
		.string()
		.max(500, "A descrição não pode ter mais de 500 caracteres.")
		.optional(),
	type: z.enum(["web", "mobile", "desktop"], {
		error: "Selecione um tipo.",
	}),
	subtype: z.string().min(1, "O subtipo é obrigatório."),
	creationDate: z.date(),
	deadlineDate: z.date({ error: "A data de prazo é obrigatória." }),
	status: z.enum(["pending", "in_progress", "completed"], {
		error: "Selecione um status.",
	}),
	images: z.any().optional(), // Validação de arquivos é complexa, faremos no servidor
	clientId: z.string({ error: "Selecione um cliente." }),
});

export default function AddNewProjectPage() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			subtype: "",
			creationDate: new Date(), // Data de criação já vem com o dia atual
			status: "pending",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log("Dados do formulário:", values);
		// TODO: Chamar Server Action com 'values'
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
						name="subtype"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Subtipo</FormLabel>
								<FormControl>
									<Input placeholder="Ex: Fintech" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Datas (Criação e Prazo) */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<FormField
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
														format(field.value, "PPP")
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
						/>
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
														format(field.value, "PPP")
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
										<SelectTrigger>
											<SelectValue placeholder="Selecione o status atual" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="pending">Pendente</SelectItem>
										<SelectItem value="in_progress">Em Andamento</SelectItem>
										<SelectItem value="completed">Concluído</SelectItem>
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
									<PopoverContent className="w-[--radix-popover-trigger-width] p-0">
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
					<FormField
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
					/>

					<Button type="submit" className="w-full md:w-auto">
						Criar Projeto
					</Button>
				</form>
			</Form>
		</div>
	);
}
