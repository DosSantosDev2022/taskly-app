"use client";

// Secao 1: Importacoes
import { type JSX, useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import type z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "react-toastify";

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
import { LoadingOverlay } from "@/components/global/loadingOverlay"; // Certifique-se de que o caminho está correto
import { cn } from "@/lib/utils"; // Função utilitária para classes Tailwind
import { formSchema } from "@/@types/forms/projectSchema"; // Schema de validação Zod
import { createProject } from "@/actions/project/addProject"; // Server Action
import type { Client } from "@prisma/client"; // Tipo do Prisma
import { useRouter } from "next/navigation";

// Secao 2: Constantes e Enums (se aplicavel, extraidos de outros arquivos para reuso)
/**
 * @const PROJECT_TYPES
 * @description Array de objetos que representa os tipos de projeto disponiveis.
 */
const PROJECT_TYPES = [
	{ value: "WEB", label: "Web" },
	{ value: "MOBILE", label: "Mobile" },
	{ value: "SISTEMA", label: "Sistema" },
] as const; // 'as const' para inferencia de tipo literal

/**
 * @const PROJECT_STATUSES
 * @description Array de objetos que representa os status de projeto disponiveis.
 */
const PROJECT_STATUSES = [
	{ value: "PENDING", label: "Pendente" },
	{ value: "IN_PROGRESS", label: "Em Andamento" },
	{ value: "COMPLETED", label: "Concluído" },
] as const; // 'as const' para inferencia de tipo literal

// Secao 3: Tipos e Interfaces

/**
 * @interface AddProjectFormProps
 * @description Propriedades para o componente AddProjectForm.
 * @property {Client[]} clients - Lista de clientes para associar ao projeto.
 */
interface AddProjectFormProps {
	clients: Client[];
}

/**
 * @typedef {z.infer<typeof formSchema>} ProjectFormValues
 * @description Tipo inferido do schema Zod para os valores do formulario de projeto.
 */
type ProjectFormValues = z.infer<typeof formSchema>;

// Secao 4: Componente Principal
/**
 * @component AddProjectForm
 * @description Um componente de formulário para adicionar novos projetos.
 * Permite ao usuário inserir detalhes do projeto, como nome, descrição,
 * tipo, status, data limite e cliente associado.
 * @param {AddProjectFormProps} props - As propriedades do componente.
 * @returns {JSX.Element} O formulário para adicionar um projeto.
 */
const AddProjectForm = ({ clients }: AddProjectFormProps): JSX.Element => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const form = useForm<ProjectFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			type: "WEB", // Valor padrao para o tipo de projeto
			status: "PENDING", // Valor padrao para o status do projeto
			clientId: undefined,
			deadlineDate: undefined,
		},
		mode: "onBlur", // Valida no blur para melhor UX
	});

	/**
	 * @function onSubmit
	 * @description Lida com a submissão do formulário. Converte os valores do formulário
	 * para FormData e chama a Server Action `createProject`.
	 * Fornece feedback ao usuário via toasts e reseta o formulário em caso de sucesso.
	 * @param {ProjectFormValues} values - Os valores validados do formulário.
	 */

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const onSubmit = useCallback(
		async (values: ProjectFormValues) => {
			// Cria um novo FormData para enviar os dados para a Server Action.
			const formData = new FormData();
			formData.append("name", values.name);
			formData.append("description", values.description || ""); // Garante string vazia se nulo/indefinido
			formData.append("type", values.type);
			formData.append("status", values.status);
			if (values.deadlineDate) {
				formData.append("deadlineDate", values.deadlineDate.toISOString()); // Converte Data para ISO string
			}
			if (values.clientId) {
				formData.append("clientId", values.clientId);
			}

			// Inicia a transicao para indicar estado de carregamento e evitar bloqueio da UI.
			startTransition(async () => {
				try {
					// Chama a Server Action.
					const result = await createProject(formData);

					if (result.success) {
						toast.success("Novo projeto adicionado com sucesso!", {
							autoClose: 3000,
							theme: "dark",
						});
						form.reset(); // Reseta o formulario para os valores padrao apos o sucesso.
						router.push("/projects");
					} else {
						// Trata erros de validacao retornados pela Server Action.
						if (result.errors) {
							// Itera sobre os erros e seta-os nos campos correspondentes do formulario.
							Object.entries(result.errors).forEach(([key, value]) => {
								form.setError(key as keyof ProjectFormValues, {
									type: "server",
									message: value as string, // Assumindo que value eh uma string de erro
								});
							});
							toast.error("Erro de validação. Verifique os campos.", {
								autoClose: 5000,
								theme: "dark",
							});
						} else {
							// Erros gerais ou de servidor nao relacionados a campos especificos.
							toast.error("Erro ao adicionar novo projeto.", {
								autoClose: 5000,
								theme: "dark",
							});
						}
						console.error("Erro ao enviar formulário:");
					}
				} catch (error) {
					// Captura erros inesperados na chamada da Server Action.
					toast.error("Ocorreu um erro inesperado. Tente novamente.", {
						autoClose: 5000,
						theme: "dark",
					});
					console.error("Erro inesperado ao enviar formulário:", error);
				}
			});
		},
		[form],
	);

	return (
		<>
			{/* Secao 5: Overlay de Carregamento para UX */}

			<LoadingOverlay isLoading={isPending} />

			{/* Secao 6: Formulario Principal */}
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
										disabled={isPending}
										aria-label="Nome do projeto"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Campos: Tipo de Projeto e Data de Prazo */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
					</div>

					{/* Campo: Status do Projeto */}
					<FormField
						name="status"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Status do Projeto</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
									disabled={isPending}
								>
									<FormControl>
										<SelectTrigger
											className="w-full"
											aria-label="Selecione o status do projeto"
										>
											<SelectValue placeholder="Selecione o status atual" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{PROJECT_STATUSES.map((status) => (
											<SelectItem key={status.value} value={status.value}>
												{status.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Campo: Cliente (Combobox) */}
					<FormField
						name="clientId"
						control={form.control}
						render={({ field }) => {
							const selectedClient = clients.find((c) => c.id === field.value);
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
													<span className="truncate">
														{selectedClient
															? selectedClient.name
															: "Selecione um cliente"}
													</span>
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
													{clients.map((client) => (
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
