// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react"; // Importe a função signIn do Next-Auth
import { useRouter } from "next/navigation"; // Para redirecionar após o login
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const loginSchema = z.object({
	email: z
		.string()
		.email({ message: "Email inválido." })
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
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const FormLogin = () => {
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<LoginFormInputs>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	//Função de submissão do formulário para login com e-mail e senha
	const onSubmit = async (data: LoginFormInputs) => {
		setError(null); // Limpa erros anteriores

		try {
			const result = await signIn("credentials", {
				redirect: false, // Não redireciona automaticamente, vamos lidar com isso manualmente
				email: data.email,
				password: data.password,
			});

			if (result?.error) {
				setError(result.error); // Mostra o erro do Next-Auth (e.g., "Credenciais inválidas")
				console.error("Erro de login:", result.error);
			} else if (result?.ok) {
				toast("Login efetuado com sucesso!", {
					autoClose: 3000,
					theme: "dark",
				});
				router.push("/projects"); // Ou router.refresh() para recarregar a sessão
				reset();
			}
		} catch (err) {
			console.error("Erro inesperado durante o login:", err);
			setError("Ocorreu um erro inesperado. Tente novamente.");
		}
	};

	return (
		<Card className="w-full max-w-xl">
			<CardHeader>
				<CardTitle className="text-2xl text-center">Login</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
					{error && <p className="text-destructive text-sm">{error}</p>}
					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? "Entrando..." : "Login"}
					</Button>
					<Button
						onClick={() => signIn("google", { callbackUrl: "/projects" })}
						type="button"
						className="w-full"
					>
						Login com Google
					</Button>
					<div className="flex justify-end">
						<Link
							className="text-sm font-light hover:underline"
							href={"/register"}
						>
							Não possuí conta ?
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export { FormLogin };
