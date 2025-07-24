"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Importações do React Hook Form e Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Importa o Server Action de registro
import { registerUser } from "@/actions/auth/register";
import { toast } from "react-toastify";

// 1. Definindo o Schema de Validação com Zod para o frontend
const registerSchema = z
	.object({
		name: z.string().min(1, { message: "O nome é obrigatório." }),

		email: z
			.string()
			.email({ message: "E-mail inválido." })
			.min(1, { message: "O e-mail é obrigatório." }),

		password: z
			.string()
			.min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
			.regex(/[A-Z]/, {
				message: "A senha deve conter pelo menos uma letra maiúscula.",
			})
			.regex(/[^a-zA-Z0-9]/, {
				message: "A senha deve conter pelo menos um caractere especial.",
			})
			.min(1, { message: "A senha é obrigatória." }),

		confirmPassword: z.string().min(1, { message: "Confirme sua senha." }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem.",
		path: ["confirmPassword"],
	});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const FormRegister = () => {
	const [serverFeedback, setServerFeedback] = useState<string | null>(null); // Para mensagens gerais de sucesso/erro do servidor
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
		clearErrors,
		reset, // Para resetar o formulário após sucesso
	} = useForm<RegisterFormInputs>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});
	console.log("Current errors:", errors);
	const onSubmit = async (data: RegisterFormInputs) => {
		setServerFeedback(null); // Limpa feedback anterior do servidor

		// Limpa erros específicos de campos que podem ter vindo do servidor
		setError("email", { message: undefined });
		setError("password", { message: undefined });
		setError("name", { message: undefined });
		clearErrors();
		try {
			// 2. Chamada ao Server Action
			const result = await registerUser(data);

			if (!result.success) {
				// Se houver erros específicos de campo do servidor
				if (result.errors) {
					if (result.errors.name)
						setError("name", { message: result.errors.name });
					if (result.errors.email)
						setError("email", { message: result.errors.email });
					if (result.errors.password)
						setError("password", { message: result.errors.password });
					if (result.errors.confirmPassword)
						setError("confirmPassword", {
							message: result.errors.confirmPassword,
						});
					if (result.errors.general) setServerFeedback(result.errors.general);
				}
				setServerFeedback(result.message); // Exibe mensagem geral de erro
				return;
			}

			// Registro bem-sucedido: exibe mensagem e tenta fazer login automático
			toast(result.message, {
				autoClose: 5000,
				theme: "dark",
			});

			reset(); // Limpa o formulário
			router.push("/login");
		} catch (err) {
			console.error("Erro inesperado durante o registro:", err);
			setServerFeedback("Ocorreu um erro inesperado. Tente novamente.");
		}
	};

	// 3. Função para lidar com o registro/login via Google
	const handleGoogleRegister = async () => {
		setServerFeedback(null);
		try {
			const result = await signIn("google", {
				redirect: false,
				callbackUrl: "/projects",
			});
			if (result?.error) {
				setServerFeedback(result.error);
				console.error("Erro no registro/login com Google:", result.error);
			} else if (result?.ok) {
				router.push("/projects");
			}
		} catch (err) {
			console.error(
				"Erro inesperado durante o registro/login com Google:",
				err,
			);
			setServerFeedback(
				"Ocorreu um erro inesperado ao tentar registrar/logar com Google. Tente novamente.",
			);
		}
	};

	return (
		<Card className="w-full max-w-xl">
			<CardHeader>
				<CardTitle className="text-2xl text-center">Registrar</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Nome Completo</Label>
						<Input
							id="name"
							type="text"
							placeholder="Seu nome"
							{...register("name")}
							className={errors.name ? "border-destructive" : ""}
						/>
						{errors.name && (
							<p className="text-destructive text-sm">{errors.name.message}</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							{...register("email")}
							className={errors.email ? "border-destructive" : ""}
						/>
						{errors.email && (
							<p className="text-destructive text-sm">{errors.email.message}</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Senha</Label>
						<Input
							id="password"
							type="password"
							placeholder="Digite sua senha"
							{...register("password")}
							className={errors.password ? "border-destructive" : ""}
						/>
						{errors.password && (
							<p className="text-destructive text-sm">
								{errors.password.message}
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="confirmPassword">Confirmar Senha</Label>
						<Input
							id="confirmPassword"
							type="password"
							placeholder="Confirme sua senha"
							{...register("confirmPassword")}
							className={errors.confirmPassword ? "border-destructive" : ""}
						/>
						{errors.confirmPassword && (
							<p className="text-destructive text-sm">
								{errors.confirmPassword.message}
							</p>
						)}
					</div>

					{/* Exibe feedback geral do servidor (sucesso ou erro não específico de campo) */}
					{serverFeedback && (
						<p
							className={`${serverFeedback.includes("sucesso") ? "text-green-500" : "text-destructive"} text-sm`}
						>
							{serverFeedback}
						</p>
					)}

					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? "Cadastrando..." : "Cadastrar"}
					</Button>
					<Button
						type="button"
						className="w-full"
						onClick={handleGoogleRegister}
						disabled={isSubmitting}
					>
						Cadastrar com Google
					</Button>
					<div className="flex justify-end">
						<Link
							className="text-sm font-light hover:underline"
							href={"/login"}
						>
							Já possuí conta ?
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export { FormRegister };
