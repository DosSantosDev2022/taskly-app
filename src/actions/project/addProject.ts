// src/actions/project.ts
"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import db from "@/lib/prisma"; // Importe a instância do Prisma
import { formSchema } from "@/@types/forms/projectSchema"; // Seu schema Zod
import type { ProjectType, ProjectStatus } from "@prisma/client"; // Importar os enums do Prisma
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function createProject(formData: FormData) {
	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		throw new Error("Usuário não autenticado."); // Ou redirecione para login
	}
	const userId = session.user.id;

	// Extrair os dados do FormData
	const name = formData.get("name") as string;
	const description = formData.get("description") as string;
	const type = formData.get("type") as string; // Vem como string, precisa mapear para ProjectType
	const status = formData.get("status") as string; // Vem como string, precisa mapear para ProjectStatus
	const deadlineDateString = formData.get("deadlineDate") as string | null;
	const clientId = formData.get("clientId") as string | null;

	// Mapear strings para os enums do Prisma
	const parsedType = type.toUpperCase() as ProjectType;
	const parsedStatus = status.toUpperCase() as ProjectStatus;

	// Converte a data (se existir) para o tipo DateTime do Prisma
	const deadlineDate = deadlineDateString ? new Date(deadlineDateString) : null;

	try {
		// Validação dos campos usando Zod
		const validatedFields = formSchema.safeParse({
			name,
			description,
			type: parsedType,
			status: parsedStatus,
			deadlineDate: deadlineDate,
			clientId: clientId || null, // Garante null se for string vazia ou undefined */
		});

		if (!validatedFields.success) {
			// Você pode retornar os erros para o cliente se quiser
			console.error(
				"Validação falhou:",
				validatedFields.error.flatten().fieldErrors,
			);
			throw new Error("Dados inválidos para o projeto."); // Melhorar tratamento de erro
		}

		const {
			name: validatedName,
			description: validatedDescription,
			type: validatedType,
			status: validatedStatus,
			deadlineDate: validatedDeadlineDate,
			clientId: validatedClientId,
		} = validatedFields.data;

		// --- LOG DOS DADOS FINAIS PARA O PRISMA ---
		console.log("Dados que serão enviados ao Prisma para criar o projeto:");
		console.log({
			name: validatedName,
			description: validatedDescription,
			type: validatedType,
			status: validatedStatus,
			userId: userId, // Confirme se este userId está lá
			deadlineDate: validatedDeadlineDate,
			clientId: validatedClientId,
		});
		// --- FIM DO LOG ---

		const newProject = await db.project.create({
			data: {
				name: validatedName,
				description: validatedDescription,
				type: validatedType, // Usar o enum já validado
				status: validatedStatus, // Usar o enum já validado
				userId: userId, // O ID do usuário logado
				deadlineDate: validatedDeadlineDate,
				clientId: validatedClientId,
			},
		});

		// Revalida o cache da rota de listagem de projetos para que os novos dados apareçam
		revalidatePath("/projects");
		revalidatePath("/dashboard"); // Se tiver um dashboard que lista projetos
	} catch (error) {
		console.error("Erro ao criar projeto:", error);
		// Em um cenário real, você pode querer lançar um erro mais específico
		// ou retornar uma mensagem de erro para o frontend.
		throw new Error("Falha ao criar o projeto.");
	}
}
