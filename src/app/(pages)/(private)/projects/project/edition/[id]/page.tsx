// src/app/project/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import { getProjectById } from "@/actions/project/getProject"; // Server Action para buscar projeto
import { EditProjectForm } from "@/components/pages"; // Componente do formulário
import { getClients } from "@/actions/client/getClients";

interface EditProjectPageProps {
	params: {
		id: string;
	};
}

export default async function EditProjectPage({
	params,
}: EditProjectPageProps) {
	const { clients } = await getClients();

	const project = await getProjectById(params.id);

	if (!project) {
		notFound();
	}

	// Prepara os valores padrão para o formulário
	const defaultValues = {
		name: project.name,
		description: project.description || "",
		type: project.type,
		status: project.status,
		deadlineDate: project.deadlineDate
			? new Date(project.deadlineDate)
			: new Date(),
		clientId: project.clientId || undefined,
		price: typeof project.price === "number" ? project.price : 0,
	};

	return (
		<div className="container mx-auto max-w-2xl pt-24 p-4 mt-20">
			<div className="space-y-4 mb-8">
				<h1 className="text-3xl font-bold">Editar Projeto</h1>
				<p className="text-muted-foreground">Atualize os dados do projeto.</p>
			</div>
			<div className="mb-10">
				<EditProjectForm
					projectId={project.id}
					defaultValues={defaultValues}
					clients={clients}
				/>
			</div>
		</div>
	);
}
