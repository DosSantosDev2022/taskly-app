import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Progress,
} from "@/components/ui";

import { notFound } from "next/navigation";
import { Calendar, SquarePen } from "lucide-react";
import { format } from "date-fns";
import { getProjectById } from "@/services/project"; // Server Action
import {
	WrapperLists,
	DetailsTasksAndComments,
	StatusButtonProject,
} from "@/components/pages";
import {
	getStatusLabelProject,
	getStatusProjectStyles,
	getTaskProgress,
} from "@/utils";
import Link from "next/link";

interface ProjectDetailsPageProps {
	params: {
		id: string;
	};
}

export default async function ProjectDetailsPage({
	params,
}: ProjectDetailsPageProps) {
	const project = await getProjectById(params.id);

	if (!project) {
		notFound();
	}

	const projectProgress = getTaskProgress(project.tasks);
	const status = getStatusLabelProject(project.status);

	return (
		<div className="container mx-auto pt-24 p-4 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-6">
			{/* Coluna 1 (da esquerda): Detalhes estáticos do projeto */}
			<div className="lg:col-span-7 space-y-4 self-start">
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-3xl">{project.name}</CardTitle>
							<Button variant={"ghost"} asChild>
								<Link href={`/projects/edit/${project.id}`}>
									<SquarePen />
								</Link>
							</Button>
						</div>
						<div className="flex items-center gap-2">
							<span className="font-bold text-foreground mr-1">Tipo:</span>
							<p className="text-lg text-muted-foreground">
								{project.type} - {project.type}
							</p>
						</div>
						{/* progressBar */}
						<div className="mt-2">
							<span className="font-bold text-foreground mr-1">Progresso</span>
							<Progress
								className="h-5"
								value={projectProgress}
								showValue={true}
							/>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2">
							<div className=" flex items-center gap-1 font-medium text-xs text-muted-foreground">
								<span className="font-bold text-foreground mr-1 flex items-center gap-1">
									<Calendar />
									Data de criação:
								</span>{" "}
								{format(project.createdAt, "dd/MM/yyyy")}
							</div>
							{project.deadlineDate && (
								<div className="font-medium text-muted-foreground text-xs flex items-center gap-1">
									<span className="font-bold text-foreground mr-1 flex items-center gap-1">
										<Calendar />
										Data de prazo:
									</span>{" "}
									{format(project.deadlineDate, "dd/MM/yyyy")}
								</div>
							)}
							<div className="flex items-center gap-1">
								<span className="font-bold text-foreground text-xs mr-1">
									Status:
								</span>
								<StatusButtonProject
									projectId={project.id}
									currentStatus={project.status}
								/>
							</div>
						</div>
						<div className="prose dark:prose-invert mt-4">
							<p>{project.description}</p>
						</div>
					</CardContent>
				</Card>
				{/* Seção Problemas */}
				<Card className="space-y-4 p-4">
					<h2 className="font-bold text-xl">Problema</h2>
				</Card>
				{/* Seção Tipo e Público Alvo */}
				<div className="flex items-center gap-2.5">
					<Card className="space-y-4 p-4 w-full">
						<h2 className="font-bold text-xl">Tipo</h2>
					</Card>
					<Card className="space-y-4 p-4 w-full ">
						<h2 className="font-bold text-xl">Publico alvo</h2>
					</Card>
				</div>
				{/* Seção Nicho */}
				<div className="flex items-center gap-2.5">
					<Card className="space-y-4 p-4 w-full">
						<h2 className="font-bold text-xl">Nicho</h2>
					</Card>
				</div>
				{/* Seção lista de tasks e comments */}
				<WrapperLists
					projectId={project.id}
					comments={project.comments}
					tasks={project.tasks}
				/>
			</div>

			<div className="lg:col-span-5 space-y-6">
				<DetailsTasksAndComments />
			</div>
		</div>
	);
}
