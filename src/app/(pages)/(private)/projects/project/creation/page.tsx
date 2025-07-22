import { AddProjectForm } from "@/components/pages/project/forms/addProjectForm";
import db from "@/lib/prisma";

export default async function AddNewProjectPage() {
	const clients = await db.client.findMany();

	return (
		<div className="container mx-auto max-w-2xl pt-24 p-4 mt-20">
			<div className="space-y-4 mb-8">
				<h1 className="text-3xl font-bold">Adicionar Novo Projeto</h1>
				<p className="text-muted-foreground">
					Preencha os campos abaixo para cadastrar um novo projeto.
				</p>
			</div>

			<AddProjectForm clients={clients} />
		</div>
	);
}
