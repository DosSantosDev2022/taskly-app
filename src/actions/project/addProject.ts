// src/actions/project.ts
"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import db from "@/lib/prisma";
// MUDANÇA AQUI: Importar o schema do local correto
import { formSchema } from "@/@types/forms/projectSchema"; // <--- Corrigido o caminho de importação
import type { ProjectType, ProjectStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function createProject(formData: FormData) {
	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		throw new Error("Usuário não autenticado.");
	}
	const userId = session.user.id;

	const name = formData.get("name") as string;
	const description = formData.get("description") as string;
	const type = formData.get("type") as string;
	const status = formData.get("status") as string;
	const deadlineDateString = formData.get("deadlineDate") as string | null;
	const clientId = formData.get("clientId") as string | null;

	const parsedType = type.toUpperCase() as ProjectType;
	const parsedStatus = status.toUpperCase() as ProjectStatus;

	const deadlineDate = deadlineDateString ? new Date(deadlineDateString) : null;

	try {
		const validatedFields = formSchema.safeParse({
			name,
			description,
			type: parsedType,
			status: parsedStatus,
			deadlineDate: deadlineDate,
			clientId: clientId || null,
		});

		if (!validatedFields.success) {
			console.error(
				"Validação falhou:",
				validatedFields.error.flatten().fieldErrors,
			);
			throw new Error("Dados inválidos para o projeto.");
		}

		const {
			name: validatedName,
			description: validatedDescription,
			type: validatedType,
			status: validatedStatus,
			deadlineDate: validatedDeadlineDate,
			clientId: validatedClientId,
		} = validatedFields.data;

		console.log("Dados que serão enviados ao Prisma para criar o projeto:");
		console.log({
			name: validatedName,
			description: validatedDescription,
			type: validatedType,
			status: validatedStatus,
			userId: userId,
			deadlineDate: validatedDeadlineDate,
			clientId: validatedClientId,
		});

		await db.project.create({
			data: {
				name: validatedName,
				description: validatedDescription,
				type: validatedType,
				status: validatedStatus,
				userId: userId,
				deadlineDate: validatedDeadlineDate,
				clientId: validatedClientId,
			},
		});

		revalidatePath("/projects");
		revalidatePath("/dashboard");
		redirect("/projects"); // Adicionado um redirecionamento após o sucesso
	} catch (error) {
		console.error("Erro ao criar projeto:", error);
		throw new Error("Falha ao criar o projeto.");
	}
}
