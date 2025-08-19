// src/components/auth/email-verification-handler.tsx
"use client";

import { verifyEmailAction } from "@/actions/auth/register";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * @description Componente cliente para lidar com a lógica de verificação de e-mail.
 * @returns {JSX.Element} O formulário de verificação ou uma mensagem.
 */
export function EmailVerificationHandler() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [verificationStatus, setVerificationStatus] = useState<
		"idle" | "verifying" | "success" | "error"
	>("idle");
	const [message, setMessage] = useState<string>("");

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
				const result = await verifyEmailAction(token, email);

				if (result.success) {
					setVerificationStatus("success");
					setMessage(result.message);
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
		<div className="space-y-4">
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
		</div>
	);
}
