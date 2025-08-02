// src/components/pages/edit-client-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Client } from "@prisma/client"; // Importe o tipo Client
import { type JSX, useCallback, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type z from "zod";

import { clientFormSchema } from "@/@types/zod";
import { updateClient } from "@/actions/client";
import { LoadingOverlay } from "@/components/global";
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

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface EditClientFormProps {
	isOpen: boolean;
	onClose: () => void;
	client: Client; // O cliente a ser editado
}

const EditClientForm = ({
	isOpen,
	onClose,
	client,
}: EditClientFormProps): JSX.Element => {
	const [isPending, startTransition] = useTransition();

	const form = useForm<ClientFormValues>({
		resolver: zodResolver(clientFormSchema),
		// Definir valores padrão com base no cliente recebido
		defaultValues: {
			name: client.name || "",
			email: client.email || "",
			phone: client.phone || "",
		},
		mode: "onBlur",
	});

	// Resetar o formulário com os novos dados do cliente se o cliente mudar ou o modal abrir
	useEffect(() => {
		if (client) {
			form.reset({
				name: client.name || "",
				email: client.email || "",
				phone: client.phone || "",
			});
		}
	}, [client, form]);

	const onSubmit = useCallback(
		async (values: ClientFormValues) => {
			console.log("Dados do cliente para atualização:", values);
			const formData = new FormData();
			formData.append("id", client.id); // Adicione o ID do cliente!
			formData.append("name", values.name);
			formData.append("email", values.email ?? "");
			formData.append("phone", values.phone ?? "");

			startTransition(async () => {
				try {
					const result = await updateClient(formData);
					console.log(
						"Resultado da Server Action de atualização no frontend:",
						result,
					);

					if (result.success) {
						toast.success("Cliente atualizado com sucesso!", {
							autoClose: 3000,
							theme: "dark",
						});
						onClose(); // Fecha o modal ao sucesso
					} else {
						toast.error(result.message || "Erro ao atualizar cliente.", {
							autoClose: 3000,
							theme: "dark",
						});

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
					toast.error(
						"Ocorreu um erro inesperado ao atualizar o cliente. Tente novamente.",
						{
							autoClose: 5000,
							theme: "dark",
						},
					);
					console.error(
						"Erro inesperado ao enviar formulário de atualização de cliente:",
						error,
					);
				}
			});
		},
		[form, client.id, onClose], // Adicione client.id e onClose às dependências
	);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			{" "}
			{/* Controla o modal com isOpen e onClose */}
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Editar Cliente</DialogTitle>
					<DialogDescription>
						Edite os detalhes do cliente. Clique em salvar quando terminar.
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
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								disabled={isPending}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? "Salvando..." : "Salvar Alterações"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export { EditClientForm };
