"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { formSchema } from "@/@types/forms/projectSchema";

export async function updateProject(
	projectId: string,
	prevState: any,
	formData: FormData,
) {
	const parsed = formSchema.safeParse({
		name: formData.get("name"),
		description: formData.get("description"),
		type: formData.get("type"),
		status: formData.get("status"),
		deadlineDate: formData.get("deadlineDate")
			? new Date(formData.get("deadlineDate") as string)
			: undefined,
		clientId: formData.get("clientId") || undefined,
	});

	if (!parsed.success) {
		console.error("Validation Error:", parsed.error.flatten().fieldErrors);
		return {
			errors: parsed.error.flatten().fieldErrors,
		};
	}

	const { name, description, type, status, deadlineDate, clientId } =
		parsed.data;

	try {
		await db.project.update({
			where: { id: projectId },
			data: {
				name,
				description,
				type,
				status,
				deadlineDate,
				clientId,
			},
		});

		revalidatePath(`/projects/${projectId}`);
	} catch (error) {
		console.error("Failed to update project:", error);
		return { message: "Failed to update project." };
	}
}
