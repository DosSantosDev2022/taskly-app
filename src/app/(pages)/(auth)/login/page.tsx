// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react"; // Importe a função signIn do Next-Auth
import { useRouter } from "next/navigation"; // Para redirecionar após o login
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState(""); // Se você usa senha
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null); // Limpa erros anteriores

		try {
			const result = await signIn("credentials", {
				redirect: false, // Não redireciona automaticamente, vamos lidar com isso manualmente
				email,
				password, // Se você usa senha
				/* callbackUrl: "/projects", */
			});

			if (result?.error) {
				setError(result.error); // Mostra o erro do Next-Auth (e.g., "Credenciais inválidas")
				console.error("Erro de login:", result.error);
			} else if (result?.ok) {
				// Login bem-sucedido, redireciona para o dashboard ou outra página
				router.push("/projects"); // Ou router.refresh() para recarregar a sessão
			}
		} catch (err) {
			console.error("Erro inesperado durante o login:", err);
			setError("Ocorreu um erro inesperado. Tente novamente.");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl text-center">Login</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Senha</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required // Remova se você não usa senha para este usuário de teste
							/>
						</div>
						{error && <p className="text-red-500 text-sm">{error}</p>}
						<Button type="submit" className="w-full">
							Entrar
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
