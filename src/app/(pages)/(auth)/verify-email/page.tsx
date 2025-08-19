// src/app/verify-email/page.tsx
// Nenhum "use client" aqui, pois será um Server Component
import { EmailVerificationHandler } from "@/components/pages/auth/email-verification-handler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

export default function VerifyEmailPage() {
	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md text-center">
				<CardHeader>
					<CardTitle className="text-2xl">Verificação de E-mail</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<Suspense fallback={<div>Carregando...</div>}>
						<EmailVerificationHandler />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	);
}
