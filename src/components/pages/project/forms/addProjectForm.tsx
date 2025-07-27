"use client";

// Secao 1: Importacoes
import { type JSX, useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import type z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NumericFormat } from "react-number-format";
import {
	Button,
	Calendar,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	// Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, // REMOVIDOS - Devem estar no modal
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Textarea,
} from "@/components/ui";
import { LoadingOverlay } from "@/components/global/loadingOverlay";
import { cn } from "@/lib/utils";
import { formSchema } from "@/@types/forms/projectSchema";
import { createProject } from "@/actions/project/addProject";
import type { Client } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/actions/client/getClients";
import { toast } from "react-toastify"; // Mantido toastify conforme seu código original, mas sonner é uma boa alternativa

// Secao 2: Constantes e Enums (se aplicavel, extraidos de outros arquivos para reuso)
const PROJECT_TYPES = [
	{ value: "WEB", label: "Web" },
	{ value: "MOBILE", label: "Mobile" },
	{ value: "SISTEMA", label: "Sistema" },
] as const;

// Secao 3: Tipos e Interfaces
interface AddProjectFormProps {
	onSuccess?: () => void;
}

type ProjectFormValues = z.infer<typeof formSchema>;

// Secao 4: Componente Principal
const AddProjectForm = ({ onSuccess }: AddProjectFormProps): JSX.Element => {
	const [isPending, startTransition] = useTransition();

	// --- BUSCA DE CLIENTES COM USEQUERY ---
	const {
		data: clients,
		isLoading: isLoadingClients,
		isError: isErrorClients,
		error: errorClients,
	} = useQuery<Client[]>({
		queryKey: ["clients"],
		queryFn: async () => {
			const response = await getClients();
			if (!response.success || !response.clients) {
				throw new Error("Falha ao buscar clientes.");
			}
			return response.clients;
		},
		staleTime: 1000 * 60 * 5, // 5 minutos de cache
	});

	const form = useForm<ProjectFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			type: "WEB",
			status: "PENDING",
			clientId: undefined,
			deadlineDate: undefined,
			price: 0,
		},
		mode: "onBlur",
	});

	const onSubmit = useCallback(
		async (values: ProjectFormValues) => {
			const formData = new FormData();
			formData.append("name", values.name);
			formData.append("description", values.description || "");
			formData.append("type", values.type);
			formData.append("status", values.status);
			formData.append(
				"price",
				values.price.toLocaleString("en-US", {
					useGrouping: false,
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				}),
			);
			if (values.deadlineDate) {
				formData.append("deadlineDate", values.deadlineDate.toISOString());
			}
			if (values.clientId) {
				formData.append("clientId", values.clientId);
			}

			startTransition(async () => {
				try {
					const result = await createProject(formData);

					if (result.success) {
						toast.success("Novo projeto adicionado com sucesso!", {
							autoClose: 3000,
							theme: "dark",
						});
						form.reset();
						onSuccess?.();
					} else {
						if (result.errors) {
							Object.entries(result.errors).forEach(([key, value]) => {
								form.setError(key as keyof ProjectFormValues, {
									type: "server",
									message: value as string,
								});
							});
							toast.error("Erro de validação. Verifique os campos.", {
								autoClose: 5000,
								theme: "dark",
							});
						} else {
							toast.error(result.errors || "Erro ao adicionar novo projeto.", {
								autoClose: 5000,
								theme: "dark",
							});
						}
						console.error(
							"Erro ao enviar formulário:",
							result.errors || result.errors,
						);
					}
				} catch (error) {
					toast.error("Ocorreu um erro inesperado. Tente novamente.", {
						autoClose: 5000,
						theme: "dark",
					});
					console.error("Erro inesperado ao enviar formulário:", error);
				}
			});
		},
		[form, onSuccess],
	);

	// --- RENDERIZAÇÃO CONDICIONAL DO CONTEÚDO ---
	if (isErrorClients) {
		console.error("Erro ao carregar clientes para o formulário:", errorClients);
		toast.error("Não foi possível carregar a lista de clientes.");
		return (
			<div className="flex flex-col items-center justify-center p-8 text-center text-destructive">
				<p className="font-semibold text-lg">Erro ao carregar clientes.</p>
				<p className="text-sm text-muted-foreground">
					Por favor, tente novamente mais tarde.
				</p>
				<Button onClick={() => window.location.reload()} className="mt-4">
					Recarregar Página
				</Button>
			</div>
		);
	}

	return (
		<>
			<LoadingOverlay message="Cadastrando projeto..." isLoading={isPending} />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
					aria-label="Formulário de criação de projeto"
				>
					{/* Campo: Nome do Projeto */}
					<FormField
						name="name"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nome do Projeto</FormLabel>
								<FormControl>
									<Input
										placeholder="Ex: Aplicativo de Gerenciamento Financeiro"
										{...field}
										disabled={isPending} // Não mais depende de isLoadingClients aqui
										aria-label="Nome do projeto"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Campos: Tipo de Projeto e Data de Prazo e preço */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
						{/* Campo: Tipo de Projeto */}
						<FormField
							name="type"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tipo de Projeto</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={isPending}
									>
										<FormControl>
											<SelectTrigger
												className="w-full"
												aria-label="Selecione o tipo de projeto"
											>
												<SelectValue placeholder="Selecione o tipo de projeto" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{PROJECT_TYPES.map((type) => (
												<SelectItem key={type.value} value={type.value}>
													{type.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Campo: Data de Prazo */}
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
													variant="outline"
													className={cn(
														"pl-3 text-left font-normal",
														!field.value && "text-muted-foreground",
														"focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
													)}
													disabled={isPending}
													aria-label={
														field.value
															? `Data de prazo: ${format(field.value, "PPP", { locale: ptBR })}`
															: "Escolha uma data de prazo"
													}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{field.value ? (
														format(field.value, "PPP", { locale: ptBR })
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
												locale={ptBR}
												aria-label="Calendário para seleção da data de prazo"
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Campo: Preço do projeto */}
						<FormField
							name="price"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Preço do Projeto</FormLabel>
									<FormControl>
										<NumericFormat
											value={field.value}
											onBlur={field.onBlur}
											name={field.name}
											customInput={Input}
											thousandSeparator="."
											decimalSeparator=","
											prefix="R$ "
											decimalScale={2}
											fixedDecimalScale={true}
											allowNegative={false}
											onValueChange={(values) => {
												const numValue = values.floatValue;
												field.onChange(numValue === undefined ? 0 : numValue);
											}}
											placeholder="Ex: R$ 1.250,00"
											disabled={isPending}
											aria-label="Preço do projeto"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Campo: Cliente (Combobox) */}
					<FormField
						name="clientId"
						control={form.control}
						render={({ field }) => {
							// Aqui clients é garantido como Client[] devido aos checks acima
							const selectedClient = clients?.find((c) => c.id === field.value);
							return (
								<FormItem className="flex flex-col">
									<FormLabel>Cliente</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													role="combobox"
													aria-expanded={form.formState.isDirty}
													className={cn(
														"w-full justify-between",
														!field.value && "text-muted-foreground",
														"focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
													)}
													disabled={isPending}
													aria-label={
														selectedClient
															? `Cliente selecionado: ${selectedClient.name}`
															: "Selecione um cliente"
													}
												>
													{isLoadingClients ? (
														"Carregando clientes..."
													) : (
														<span className="truncate">
															{selectedClient
																? selectedClient.name
																: "Selecione um cliente"}
														</span>
													)}

													<ChevronsUpDown
														className="ml-2 h-4 w-4 shrink-0 opacity-50"
														aria-hidden="true"
													/>
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-xl p-0">
											<Command aria-label="Lista de clientes">
												<CommandInput placeholder="Buscar cliente..." />
												<CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
												<CommandGroup>
													{clients?.map((client) => (
														<CommandItem
															value={client.name}
															key={client.id}
															onSelect={() => {
																form.setValue("clientId", client.id);
																form.trigger("clientId");
															}}
															aria-selected={client.id === field.value}
														>
															<Check
																className={cn(
																	"mr-2 h-4 w-4",
																	client.id === field.value
																		? "opacity-100"
																		: "opacity-0",
																)}
																aria-hidden="true"
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
							);
						}}
					/>

					{/* Campo: Descrição */}
					<FormField
						name="description"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Descrição</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Descreva o objetivo, escopo e requisitos principais do projeto..."
										{...field}
										disabled={isPending}
										aria-label="Descrição do projeto"
										rows={5}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Botao de Submissao */}
					<Button
						type="submit"
						className="w-full md:w-auto"
						disabled={isPending}
					>
						{isPending ? "Criando Projeto..." : "Criar Projeto"}
					</Button>
				</form>
			</Form>
		</>
	);
};

export { AddProjectForm };
