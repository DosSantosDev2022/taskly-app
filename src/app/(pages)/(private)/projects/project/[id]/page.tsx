import { getProjectById } from "@/actions/project/getProject";
import {
	DetailsTasksAndComments,
	StatusButtonProject,
	WrapperLists,
} from "@/components/pages/project";
import { EditProjectModal } from "@/components/pages/project/editProjectModal";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/index";
import { getTaskProgress } from "@/utils";
import { formatPrice } from "@/utils/formatPrice";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, CircleDollarSign, FileText } from "lucide-react";
import { notFound } from "next/navigation";

// --- Tipagem das Props da Página ---
/**
 * @interface ProjectDetailsPageProps
 * @description Define as propriedades esperadas pela página de detalhes do projeto.
 */
interface ProjectDetailsPageProps {
	params: {
		id: string; // O ID do projeto a ser exibido, extraído da URL
	};
}

/**
 * @component ProjectDetailsPage
 * @description Página de detalhes de um projeto específico.
 * Carrega os dados do projeto no servidor (Server Component),
 * exibe suas informações, progresso, e as listas de tarefas e comentários.
 * Também permite a interação para edição do projeto e visualização de detalhes.
 */
export default async function ProjectDetailsPage({
	params,
}: ProjectDetailsPageProps) {
	// 1. Busca dos Dados do Projeto (Server Side)
	const project = await getProjectById(params.id);

	if (!project) {
		notFound();
	}

	// 2. Cálculo do Progresso da Tarefa
	const projectProgress = getTaskProgress(project.tasks);

	// 3. Renderização do Layout da Página
	return (
		<div className="container mx-auto p-4  grid grid-cols-1 lg:grid-cols-12 gap-6">
			{/* Coluna Principal (à esquerda em telas grandes): Detalhes e Listas */}
			<div className="lg:col-span-7 space-y-4 self-start overflow-y-auto max-h-[calc(100vh-theme(spacing.16))] scrollbar-custom p-1 ">
				{/* Card de Detalhes Básicos do Projeto */}
				<Card className="rounded-lg shadow-sm">
					<CardHeader className="">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-y-2 sm:gap-x-4">
							<CardTitle className="text-3xl lg:text-4xl font-extrabold text-primary break-words max-w-full">
								{project.name}
							</CardTitle>
							<EditProjectModal project={project} />
						</div>

						{/* Tipo do Projeto e Cliente */}
						<div className="flex flex-col items-start gap-2 mt-4 text-lg">
							{project.client?.name && (
								<span className="font-semibold text-foreground">
									Cliente:
									<span className="text-foreground/80 text-base font-normal ml-2">
										{project.client.name}
									</span>
								</span>
							)}

							<span className="font-semibold text-foreground">
								Tipo:
								<span className="text-foreground/80 text-base font-normal ml-2">
									{project.type}
								</span>
							</span>
						</div>
					</CardHeader>
					<CardContent className="p-6 pt-0">
						{/* Datas e Status */}
						<div className="flex flex-wrap items-center gap-x-3 text-sm md:text-base">
							{/* Data de Criação */}
							<div className="flex items-center gap-1 font-medium text-foreground">
								<Calendar className="h-4 w-4 text-primary" />
								<span className="font-semibold">Criação:</span>{" "}
								<span className="text-muted-foreground font-light">
									{format(project.createdAt, "dd/MM/yyyy", { locale: ptBR })}
								</span>
							</div>

							{/* Data de Prazo (se existir) */}
							{project.deadlineDate && (
								<div className="font-medium text-foreground flex items-center gap-1">
									<Calendar className="h-4 w-4 text-primary" />
									<span className="font-semibold">Prazo:</span>{" "}
									<span className="text-muted-foreground font-light">
										{format(project.deadlineDate, "dd/MM/yyyy", {
											locale: ptBR,
										})}
									</span>
								</div>
							)}

							{/* Status do Projeto */}
							<div className="flex items-center gap-2">
								<span className="font-semibold text-foreground text-sm md:text-base">
									Status:
								</span>
								<StatusButtonProject
									projectId={project.id}
									currentStatus={project.status}
								/>
							</div>
						</div>

						{/* Descrição do Projeto */}
						<div className="my-4 border border-accent/40 rounded p-3 bg-accent/40">
							<span className="font-semibold text-foreground text-sm md:text-lg ">
								Descrição:
							</span>
							<div className="prose dark:prose-invert mt-4 max-w-none text-base leading-relaxed text-gray-700 dark:text-gray-300">
								{project.description ? (
									<p>{project.description}</p>
								) : (
									<p className="text-muted-foreground italic">
										Nenhuma descrição fornecida para este projeto.
									</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Seção "Tipo" e "Público Alvo" */}
				<div className="flex flex-col sm:flex-row items-stretch gap-4">
					<Card className="rounded-lg shadow-sm p-4 w-full">
						<CardTitle className="flex gap-1 items-center font-semibold text-xl">
							<CircleDollarSign />
							Valor do Projeto
						</CardTitle>
						<span className="text-lg text-muted-foreground">
							{project.price ? formatPrice(project.price) : "R$ 0,00"}
						</span>
					</Card>
					<Card className="rounded-lg shadow-sm p-4 w-full">
						<CardTitle className="flex gap-1 items-center font-semibold text-xl">
							<FileText />
							Contrado
						</CardTitle>
						{project.contractFileName ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<span>{project.contractFileName}</span>
								</TooltipTrigger>
								<TooltipContent>Exportar</TooltipContent>
							</Tooltip>
						) : (
							<span className="text-muted-foreground">
								Nenhum contrato vinculado a este projeto
							</span>
						)}
					</Card>
				</div>

				{/* Seção "Nicho" */}
				<div className="flex items-center gap-4">
					<Card className="rounded-lg shadow-sm p-4 w-full">
						<CardTitle className="font-semibold text-xl">
							Nicho de Mercado
						</CardTitle>
						<p className="text-muted-foreground mt-2">
							Em qual nicho de mercado este projeto se insere? (Em
							desenvolvimento)
						</p>
					</Card>
				</div>

				{/* Seção de Listas de Tarefas e Comentários */}
				<WrapperLists
					projectId={project.id}
					comments={project.comments || []}
					tasks={project.tasks || []}
					projectProgress={projectProgress}
				/>
			</div>

			{/* Coluna Secundária (à direita em telas grandes): Detalhes de Tarefas/Comentários */}
			<div className="lg:col-span-5 space-y-6 self-start sticky top-0">
				<DetailsTasksAndComments />
			</div>
		</div>
	);
}
