// src/app/project/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import { getProjectById } from "@/services/project"; // Server Action para buscar projeto
import { EditProjectForm } from "@/components/pages"; // Componente do formulário

interface EditProjectPageProps {
	params: {
		id: string;
	};
}

export default async function EditProjectPage({
	params,
}: EditProjectPageProps) {
	const project = await getProjectById(params.id);
	console.log("params", params);

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
	};

	const mockClients = [
		{
			id: "a9f04538-f934-4e4f-8d7d-fa85fd1eb741",
			name: "Tech Solutions Ltda.",
		},
		{
			id: "029efec5-e893-4c23-9b9b-ae22033a83d9",
			name: "Inovação Digital S.A.",
		},
		{ id: "f26da8dd-397f-413e-b9ed-d647b050d190", name: "Global Ventures" },
	];

	return (
		<div className="container mx-auto max-w-2xl pt-24 p-4 mt-20">
			<div className="space-y-4 mb-8">
				<h1 className="text-3xl font-bold">Editar Projeto</h1>
				<p className="text-muted-foreground">Atualize os dados do projeto.</p>
			</div>
			<EditProjectForm
				projectId={project.id}
				defaultValues={defaultValues}
				clients={mockClients}
			/>
		</div>
	);
}
