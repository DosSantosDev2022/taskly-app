import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/index";
import { notFound } from "next/navigation";
import { Calendar, CircleDollarSign, FileText, SquarePen } from "lucide-react";
import { format } from "date-fns";
import { getProjectById } from "@/actions/project/getProject";
import {
	WrapperLists,
	DetailsTasksAndComments,
	StatusButtonProject,
} from "@/components/pages";
import { getTaskProgress } from "@/utils";
import Link from "next/link";
import { ptBR } from "date-fns/locale";
import { formatPrice } from "@/utils/formatPrice";

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
		<div className="container mx-auto pt-24 p-4 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-6">
			{/* Coluna Principal (à esquerda em telas grandes): Detalhes e Listas */}
			<div className="lg:col-span-7 space-y-4 self-start">
				{/* Card de Detalhes Básicos do Projeto */}
				<Card className="rounded-lg shadow-sm">
					<CardHeader>
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
							<CardTitle className="text-3xl font-bold text-primary">
								{project.name}
							</CardTitle>
							<Button
								variant={"ghost"}
								asChild
								className="shrink-0" // Evita que o botão encolha em telas pequenas
								aria-label={`Editar projeto ${project.name}`} // Acessibilidade
							>
								<Link href={`/projects/project/edition/${project.id}`}>
									<SquarePen className="h-5 w-5" />
								</Link>
							</Button>
						</div>

						{/* Tipo do Projeto */}
						<div className="flex flex-col items-start gap-2 mt-2 text-base">
							<span className="font-bold text-foreground">
								Cliente:
								<span className="text-muted-foreground text-sm font-light ml-1">
									{project.client?.name}
								</span>
							</span>

							<span className="font-bold text-foreground">
								Tipo:
								<span className="text-muted-foreground text-sm font-light ml-1">
									{project.type}
								</span>
							</span>
						</div>
					</CardHeader>
					<CardContent>
						{/* Datas e Status */}
						<div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
							{/* Data de Criação */}
							<div className="flex items-center gap-1 font-medium text-muted-foreground">
								<span className="font-bold text-foreground flex items-center gap-1">
									<Calendar className="h-4 w-4 text-primary" /> Data de criação:
								</span>{" "}
								{format(project.createdAt, "dd/MM/yyyy", { locale: ptBR })}
							</div>

							{/* Data de Prazo (se existir) */}
							{project.deadlineDate && (
								<div className="font-medium text-muted-foreground flex items-center gap-1">
									<span className="font-bold text-foreground flex items-center gap-1">
										<Calendar className="h-4 w-4 text-primary" /> Data de prazo:
									</span>{" "}
									{format(project.deadlineDate, "dd/MM/yyyy", { locale: ptBR })}
								</div>
							)}

							{/* Status do Projeto */}
							<div className="flex items-center gap-1">
								<span className="font-bold text-foreground text-sm md:text-base mr-1">
									Status:
								</span>
								<StatusButtonProject
									projectId={project.id}
									currentStatus={project.status}
								/>
							</div>
						</div>

						{/* Descrição do Projeto */}
						<div className="prose dark:prose-invert mt-6 max-w-none text-base text-gray-700 dark:text-gray-300">
							{project.description ? (
								<p>{project.description}</p>
							) : (
								<p className="text-muted-foreground italic">
									Nenhuma descrição fornecida para este projeto.
								</p>
							)}
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
			<div className="lg:col-span-5 space-y-6 self-start sticky top-24">
				{/* Ajuste `top-24` para considerar o header fixo da aplicação */}
				<DetailsTasksAndComments />
			</div>
		</div>
	);
}
