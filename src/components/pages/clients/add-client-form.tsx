"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type JSX, useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type z from "zod";

import { clientFormSchema } from "@/@types/zod/clientFormSchema";
import { createClient } from "@/actions/client/addClient";
import { LoadingOverlay } from "@/components/global/loadingOverlay";
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
import { PlusCircle } from "lucide-react";

type ClientFormValues = z.infer<typeof clientFormSchema>;

const AddClientForm = (): JSX.Element => {
	const [isPending, startTransition] = useTransition();
	const [isOpen, setIsOpen] = useState(false); // Estado para controlar o modal

	const form = useForm<ClientFormValues>({
		resolver: zodResolver(clientFormSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
		},
		mode: "onBlur",
	});

	const handleOpenChange = useCallback(
		(open: boolean) => {
			setIsOpen(open);
			if (!open) {
				form.reset(); // reseta o formulário para os defaultValues
				form.clearErrors(); // limpa quaisquer erros de validação
			}
		},
		[form],
	);

	const onSubmit = useCallback(
		async (values: ClientFormValues) => {
			console.log("Dados do cliente para envio:", values);
			const formData = new FormData();
			formData.append("name", values.name);
			formData.append("email", values.email ?? "");
			formData.append("phone", values.phone ?? "");

			startTransition(async () => {
				try {
					const result = await createClient(formData);
					console.log("Resultado da Server Action no frontend:", result); // Mantenha este log!

					if (result.success) {
						toast.success("Cliente adicionado com sucesso!", {
							autoClose: 3000,
							theme: "dark",
						});
						form.reset();
						setIsOpen(false); // Fecha o modal ao sucesso
					} else {
						// **NOVA LÓGICA DE TRATAMENTO DE ERRO**
						// 1. Exiba a mensagem principal do `result.message` no toast.
						//    Isso garante que "Já existe um cliente com este email." apareça no toast.
						toast.error("Erro ao adicionar cliente.", {
							autoClose: 3000,
							theme: "dark",
						});

						// 2. Se houver erros específicos por campo (`result.errors`),
						//    defina-os no React Hook Form para que apareçam abaixo dos campos.
						if (result.errors) {
							Object.entries(result.errors).forEach(([key, value]) => {
								form.setError(key as keyof ClientFormValues, {
									type: "server",
									message: value as string,
								});
							});
						}
					}
				} catch (error) {
					toast.error("Ocorreu um erro inesperado. Tente novamente.", {
						autoClose: 5000,
						theme: "dark",
					});
					console.error(
						"Erro inesperado ao enviar formulário de cliente:",
						error,
					);
				}
			});
		},
		[form],
	);

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<Button
				variant={"secondary"}
				onClick={() => setIsOpen(true)}
				className="flex items-center gap-2"
			>
				<PlusCircle className="h-4 w-4" /> Adicionar Cliente
			</Button>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Adicionar Novo Cliente</DialogTitle>
					<DialogDescription>
						Preencha os detalhes para adicionar um novo cliente.
					</DialogDescription>
				</DialogHeader>
				<LoadingOverlay isLoading={isPending} />
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 py-4"
					>
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome</FormLabel>
									<FormControl>
										<Input
											placeholder="Nome completo do cliente"
											{...field}
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="email@exemplo.com"
											{...field}
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="phone"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Telefone</FormLabel>
									<FormControl>
										<Input
											placeholder="(XX) XXXXX-XXXX"
											{...field}
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="submit" disabled={isPending}>
								{isPending ? "Adicionando..." : "Salvar Cliente"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export { AddClientForm };
