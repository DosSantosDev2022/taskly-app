import Link from "next/link";
import { ProjectCard } from "@/components/pages";
import {
	Button,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui";
import { getProjects } from "@/services/project";

export default async function ProjectsPage() {
	const projects = await getProjects();
	return (
		<div className="container mx-auto mt-20 p-4">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
				{/* Coluna Principal: Lista de Projetos */}
				<div className="md:col-span-8">
					<div className="flex items-center justify-between w-full  mb-6">
						<h2 className="text-2xl font-bold tracking-tight">Meus projetos</h2>
						<Button asChild>
							<Link href={"/projects/project/creation"}>
								Adicionar novo projeto
							</Link>
						</Button>
					</div>

					{/* Grid para os cards de projetos */}
					{/* Este grid é responsivo DENTRO da coluna principal */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Usamos .map() para percorrer os dados e criar um card para cada projeto */}
						{projects.map((project) => (
							<ProjectCard key={project.id} project={project} />
						))}
					</div>
				</div>

				{/* Coluna Lateral: Filtros */}
				<div className="md:col-span-4">
					<div className="sticky top-20 p-4 border rounded-lg bg-card">
						<h3 className="text-lg font-semibold mb-4">Navegue por tipo</h3>

						<div className="space-y-4">
							{/* Filtro por Tipo de Projeto */}
							<div>
								<span className="text-sm font-medium">Tipo de projeto</span>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Selecione um tipo" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="web">Web</SelectItem>
										<SelectItem value="mobile">Mobile</SelectItem>
										<SelectItem value="desktop">Desktop</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Filtro por Subtipo */}
							<div>
								<span className="text-sm font-medium">Subtipo</span>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Selecione um subtipo" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="e-commerce">E-commerce</SelectItem>
										<SelectItem value="produtividade">Produtividade</SelectItem>
										<SelectItem value="marketing">Marketing</SelectItem>
										<SelectItem value="conteudo">Conteúdo</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
