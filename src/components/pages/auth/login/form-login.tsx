"use client";
import { LoginFormInputs, loginSchema } from "@/@types/zod";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Input,
	Label,
} from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react"; // Importe a função signIn do Next-Auth
import Link from "next/link";
import { useRouter } from "next/navigation"; // Para redirecionar após o login
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";

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
				setError(result.error);
				console.error("Erro de login:", result.error);
			} else if (result?.ok) {
				toast("Login efetuado com sucesso!", {
					autoClose: 3000,
					theme: "dark",
				});
				router.push("/dashboard");
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
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4"
					noValidate
				>
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
						<FaGoogle />
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
