// src/app/verify-email/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { verifyEmailAction } from "@/actions/auth/register"; // Criação de um novo Server Action

export default function VerifyEmailPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [verificationStatus, setVerificationStatus] = useState<
		"idle" | "verifying" | "success" | "error"
	>("idle");
	const [message, setMessage] = useState<string>("");

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const token = searchParams.get("token");
		const email = searchParams.get("email");

		if (!token || !email) {
			setVerificationStatus("error");
			setMessage("Link de verificação inválido ou incompleto.");
			return;
		}

		const handleVerification = async () => {
			setVerificationStatus("verifying");
			try {
				// Chamada ao Server Action para verificar o e-mail
				const result = await verifyEmailAction(token, email);

				if (result.success) {
					setVerificationStatus("success");
					setMessage(result.message);
					// Opcional: Redirecionar após alguns segundos ou exibir botão de login
					// setTimeout(() => router.push('/login'), 3000);
				} else {
					setVerificationStatus("error");
					setMessage(result.message);
				}
			} catch (err) {
				console.error("Erro na verificação de e-mail:", err);
				setVerificationStatus("error");
				setMessage("Ocorreu um erro inesperado durante a verificação.");
			}
		};

		if (verificationStatus === "idle") {
			handleVerification();
		}
	}, [searchParams, router, verificationStatus]);

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md text-center">
				<CardHeader>
					<CardTitle className="text-2xl">Verificação de E-mail</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{verificationStatus === "verifying" && (
						<>
							<Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
							<p>Verificando seu e-mail...</p>
						</>
					)}
					{verificationStatus === "success" && (
						<>
							<CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
							<p className="text-green-500">{message}</p>
							<Button asChild className="w-full">
								<Link href="/login">Ir para o Login</Link>
							</Button>
						</>
					)}
					{verificationStatus === "error" && (
						<>
							<XCircle className="mx-auto h-8 w-8 text-red-500" />
							<p className="text-red-500">{message}</p>
							<Button asChild className="w-full variant-outline">
								<Link href="/register">Tentar novamente ou Cadastrar</Link>
							</Button>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
