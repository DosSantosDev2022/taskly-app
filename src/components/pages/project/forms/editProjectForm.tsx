// src/app/project/edit/[id]/_components/edit-project-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import {
	Button,
	Calendar,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
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
	Textarea,
} from "@/components/ui";

import { cn } from "@/lib/utils";
import { formatDate } from "@/utils";
import { formSchema } from "@/@types/forms/projectSchema";
import { useTransition } from "react";
import type z from "zod";
import { updateProject } from "@/actions/project/updateProject";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Client } from "@prisma/client";
import { NumericFormat } from "react-number-format";

// --- Tipagem de Dados ---
/**
 * @interface Client
 * @description Define a estrutura básica de um objeto de cliente.
 */

/**
 * @interface EditProjectFormProps
 * @description Propriedades esperadas pelo componente EditProjectForm.
 */
interface EditProjectFormProps {
	projectId: string; // ID do projeto a ser editado
	defaultValues: z.infer<typeof formSchema>; // Valores iniciais do formulário, inferidos do schema Zod
	clients?: Client[]; // Lista de clientes disponíveis para seleção no combobox
}

/**
 * @component EditProjectForm
 * @description Formulário para edição de detalhes de um projeto existente.
 * Integra React Hook Form com Zod para validação, Shadcn UI para componentes visuais,
 * e Server Actions para persistência de dados.
 */
export function EditProjectForm({
	projectId,
	defaultValues,
	clients,
}: EditProjectFormProps) {
	// --- Estados Locais e Hooks ---
	const [isPending, startTransition] = useTransition(); // Gerencia o estado de "pending" da Server Action
	const router = useRouter();

	// --- Configuração do React Hook Form ---
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema), // Integração com Zod para validação do formulário
		defaultValues: {
			...defaultValues, // Popula o formulário com os valores padrão fornecidos
			// Garante que a data seja um objeto Date se for uma string, pois o formSchema pode retornar string
			deadlineDate: defaultValues.deadlineDate
				? new Date(defaultValues.deadlineDate)
				: undefined,
		},
		mode: "onBlur", // Valida os campos ao perderem o foco para melhor UX
	});

	// --- Handlers de Eventos ---

	/**
	 * @function onSubmit
	 * @description Lida com a submissão do formulário de edição de projeto.
	 * Converte os valores para FormData e chama a Server Action `updateProject`.
	 * @param {z.infer<typeof formSchema>} values - Os valores validados do formulário.
	 */
	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Cria um objeto FormData para enviar os dados à Server Action
		const formData = new FormData();

		// Adiciona os valores do formulário ao FormData
		formData.append("name", values.name);
		// Garante que a descrição seja uma string vazia se for null/undefined para FormData
		formData.append("description", values.description || "");
		formData.append("type", values.type);
		formData.append("status", values.status);
		formData.append("price", values.price.toString());
		// Converte a data de prazo para ISO string se existir
		if (values.deadlineDate) {
			formData.append("deadlineDate", values.deadlineDate.toISOString());
		}
		// Adiciona o ID do cliente se existir
		if (values.clientId) {
			formData.append("clientId", values.clientId);
		}

		// Inicia a transição de UI para o estado de "pending"
		startTransition(async () => {
			try {
				// Chama a Server Action, passando o projectId e o FormData.
				const result = await updateProject(projectId, formData);

				if (result?.success) {
					// Verifica se 'result' existe e tem 'success'
					toast.success("Projeto atualizado com sucesso!", {
						autoClose: 3000,
						theme: "dark",
					});
					router.push(`/projects/project/${projectId}`); // Redireciona para a página de detalhes do projeto
				} else {
					// Se a Server Action retornar um erro ou result.success for falso
					toast.error(result?.message || "Erro ao editar projeto!", {
						// Exibe a mensagem de erro da action ou uma genérica
						autoClose: 3000,
						theme: "dark",
					});
					// Se a Server Action retornar erros de validação, aplique-os ao formulário
					if (result?.errors) {
						for (const key in result.errors) {
							if (Object.hasOwn(result.errors, key)) {
								form.setError(key as keyof z.infer<typeof formSchema>, {
									type: "server",
									message:
										result.errors[key as keyof typeof result.errors]?.[0] ||
										String(result.errors[key as keyof typeof result.errors]),
								});
							}
						}
					}
					console.error(
						"Erro ao enviar formulário:",
						result?.errors || "Erro desconhecido.",
					);
				}
			} catch (error) {
				// Captura erros inesperados que não vêm da Server Action diretamente
				toast.error("Ocorreu um erro inesperado ao atualizar o projeto.", {
					autoClose: 3000,
					theme: "dark",
				});
				console.error("Erro inesperado ao enviar formulário:", error);
			}
		});
	}

	// --- Renderização do Componente ---
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{/* Campo: Nome do Projeto */}
				<FormField
					name="name"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input
									placeholder="Ex: App de Finanças"
									{...field}
									disabled={isPending} // Desabilita enquanto a requisição está pendente
									aria-invalid={form.formState.errors.name ? "true" : "false"}
									aria-describedby="name-error"
								/>
							</FormControl>
							{form.formState.errors.name && (
								<p
									id="name-error"
									role="alert"
									className="text-red-500 text-sm"
								>
									{form.formState.errors.name.message}
								</p>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Campo: Tipo de Projeto (Select) */}
				<FormField
					name="type"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tipo de projeto</FormLabel>
							<Select
								onValueChange={(value) =>
									field.onChange(value as "WEB" | "MOBILE" | "SISTEMA")
								}
								defaultValue={field.value}
								value={field.value} // Controla o valor para que o React Hook Form saiba o estado atual
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
									<SelectItem value="WEB">Web</SelectItem>
									<SelectItem value="MOBILE">Mobile</SelectItem>
									<SelectItem value="SISTEMA">Sistema</SelectItem>
								</SelectContent>
							</Select>
							{form.formState.errors.type && (
								<p role="alert" className="text-red-500 text-sm">
									{form.formState.errors.type.message}
								</p>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Campo: Data de Prazo (Calendar/Popover) */}
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
												"w-full pl-3 text-left font-normal",
												!field.value && "text-muted-foreground",
											)}
											disabled={isPending}
											aria-label="Selecionar data de prazo"
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
							{form.formState.errors.deadlineDate && (
								<p role="alert" className="text-red-500 text-sm">
									{form.formState.errors.deadlineDate.message}
								</p>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Campo: Status do Projeto (Select) */}
				<FormField
					name="status"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status do Projeto</FormLabel>
							<Select
								onValueChange={(value) =>
									field.onChange(
										value as "PENDING" | "IN_PROGRESS" | "COMPLETED",
									)
								}
								defaultValue={field.value}
								value={field.value} // Controla o valor
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
									<SelectItem value="PENDING">Pendente</SelectItem>
									<SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
									<SelectItem value="COMPLETED">Concluído</SelectItem>
								</SelectContent>
							</Select>
							{form.formState.errors.status && (
								<p role="alert" className="text-red-500 text-sm">
									{form.formState.errors.status.message}
								</p>
							)}
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
									customInput={Input} // Usa seu componente Input da Shadcn/UI
									thousandSeparator="." // Separador de milhar no Brasil (ponto)
									decimalSeparator="," // Separador decimal no Brasil (vírgula)
									prefix="R$ " // Prefixo de moeda
									decimalScale={2} // Duas casas decimais
									fixedDecimalScale={true} // Sempre mostra duas casas decimais
									allowNegative={false} // Não permite números negativos (já validado pelo Zod também)
									onValueChange={(values) => {
										const numValue = values.floatValue; // NumericFormat já dá o número puro aqui

										// GARANTINDO que o valor passado para o RHF é um NUMBER.
										// Se for undefined (campo vazio), passa 0.
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

				{/* Campo: Cliente (Combobox) */}
				<FormField
					name="clientId"
					control={form.control}
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Cliente</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											className={cn(
												"w-full justify-between",
												!field.value && "text-muted-foreground",
											)}
											disabled={isPending}
											aria-label="Selecione um cliente"
										>
											<span className="truncate">
												{field.value
													? clients?.find((c) => c.id === field.value)?.name
													: "Selecione um cliente"}
											</span>
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0">
									{" "}
									{/* Ajustado para w-full */}
									<Command>
										<CommandInput placeholder="Buscar cliente..." />
										<CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
										<CommandGroup>
											{clients?.map((client) => (
												<CommandItem
													value={client.name} // Use client.name para a busca no CommandInput
													key={client.id}
													onSelect={() => {
														// Alterna a seleção do cliente: se já selecionado, deseleciona
														form.setValue(
															"clientId",
															client.id === field.value ? undefined : client.id,
															{ shouldValidate: true, shouldDirty: true }, // Valida e marca como "dirty"
														);
														form.trigger("clientId"); // Gatilho de validação manual para combobox
													}}
													aria-selected={client.id === field.value} // Acessibilidade: indica seleção
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
							{form.formState.errors.clientId && (
								<p role="alert" className="text-red-500 text-sm">
									{form.formState.errors.clientId.message}
								</p>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Campo: Descrição do Projeto */}
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
									disabled={isPending}
									aria-invalid={
										form.formState.errors.description ? "true" : "false"
									}
									aria-describedby="description-error"
									rows={6} // Aumenta o número de linhas padrão
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

				{/* Botão de Submissão do Formulário */}
				<div className="flex items-center justify-start gap-2">
					<Button
						type="submit"
						variant={"secondary"}
						className="w-full md:w-auto"
						disabled={isPending}
					>
						{isPending ? "Atualizando..." : "Atualizar Projeto"}
					</Button>
					<Button type="button" variant={"secondary"} asChild>
						<Link href={`/projects/project/${projectId}`}>Voltar</Link>
					</Button>
				</div>
			</form>
		</Form>
	);
}
