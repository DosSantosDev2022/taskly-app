"use client";

// Secao 1: Importacoes
import { formSchema } from "@/@types/zod";
import { getClients } from "@/actions/client";
import { createProjectAction } from "@/actions/project";
import { LoadingOverlay } from "@/components/global";
import {
	Button,
	Calendar,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Client } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { JSX, useCallback } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "react-toastify";
import z from "zod";

// Secao 2: Constantes e Enums
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
	const queryClient = useQueryClient();

	// --- BUSCA DE CLIENTES COM USEQUERY (sem alteração) ---
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
		staleTime: 1000 * 60 * 5,
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

	// --- MUTACAO PARA CRIAR PROJETO COM USEMUTATION ---
	const createProjectMutation = useMutation({
		// A função de mutação que irá chamar a Server Action
		mutationFn: async (formData: FormData) => {
			const result = await createProjectAction(formData);
			if (!result.success) {
				// Lidar com erros de validação da Server Action
				if (result.errors) {
					Object.entries(result.errors).forEach(([key, value]) => {
						form.setError(key as keyof ProjectFormValues, {
							type: "server",
							message: value as string,
						});
					});
				}
				throw new Error(
					result.message || "Erro de validação ao criar projeto.",
				);
			}
			return result;
		},
		// Executado em caso de sucesso
		onSuccess: () => {
			toast.success("Novo projeto adicionado com sucesso!", {
				autoClose: 3000,
				theme: "dark",
			});
			form.reset();
			// INVALIDE A QUERY DE PROJETOS PARA ATUALIZAR A TABELA
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			onSuccess?.();
		},
		// Executado em caso de erro
		onError: (error) => {
			// O toast de erro já está no mutationFn, mas podemos adicionar um genérico aqui
			console.error("Erro ao criar projeto:", error.message);
			toast.error(error.message, {
				autoClose: 5000,
				theme: "dark",
			});
		},
	});

	// A função onSubmit agora apenas prepara os dados e chama a mutação
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

			// Chama a mutação. O restante da lógica de sucesso/erro é gerenciado pelo useMutation.
			createProjectMutation.mutate(formData);
		},
		[createProjectMutation],
	);

	// --- RENDERIZAÇÃO CONDICIONAL ---
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

	const isFormPending = createProjectMutation.isPending || isLoadingClients;

	return (
		<>
			<LoadingOverlay
				message="Cadastrando projeto..."
				isLoading={isFormPending}
			/>

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
										disabled={isFormPending}
										aria-label="Nome do projeto"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Campos: Tipo de Projeto, Data de Prazo e Preço */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
						<FormField
							name="type"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tipo de Projeto</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={isFormPending}
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
													disabled={isFormPending}
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
											disabled={isFormPending}
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
													disabled={isFormPending}
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
										disabled={isFormPending}
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
						disabled={isFormPending}
					>
						{createProjectMutation.isPending
							? "Criando Projeto..."
							: "Criar Projeto"}
					</Button>
				</form>
			</Form>
		</>
	);
};

export { AddProjectForm };
