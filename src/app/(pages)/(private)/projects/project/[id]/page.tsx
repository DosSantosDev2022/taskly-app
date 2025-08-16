import { getProjectById } from "@/actions/project";
import { TiptapContentRenderer } from "@/components/global/tipTap/tiptap-content-renderer";
import {
	DetailCard,
	DetailsTasksAndComments,
	EditProjectModal,
	ProjectProgressCard,
	StatusButtonProject,
	TasksList,
} from "@/components/pages/project";
import { CommentsList } from "@/components/pages/project/comments/comments-list";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui";
import { formatPrice } from "@/utils";
import { checkDeadline } from "@/utils/check-deadline";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	Calendar,
	Check,
	CircleDollarSign,
	CircleX,
	FileText,
	FolderOpenDot,
	Text,
	User,
} from "lucide-react";
import { notFound } from "next/navigation";

interface ProjectDetailsPageProps {
	params: {
		id: string; // O ID do projeto a ser exibido, extraído da URL
	};
}

export default async function ProjectDetailsPage({
	params,
}: ProjectDetailsPageProps) {
	// Busca dos Dados do Projeto (Server Side)
	const project = await getProjectById(params.id);
	// Verificação de Existência do Projeto
	if (!project) {
		notFound();
	}

	// Renderização do Layout da Página
	return (
		<div className="container mx-auto p-4  grid grid-cols-1 lg:grid-cols-12 gap-6">
			{/* Coluna Principal (à esquerda em telas grandes): Detalhes e Listas */}
			<div className="lg:col-span-7 space-y-4 self-start overflow-y-auto max-h-[calc(100vh-theme(spacing.16))] scrollbar-custom  ">
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
						<div className="flex flex-col items-start gap-2 mt-4">
							{project.client?.name && (
								<div className="flex items-center gap-1">
									<User size={24} />
									<span className=" font-semibold text-foreground">
										Cliente:
									</span>
									<span className="text-foreground/80 text-base font-normal">
										{project.client.name}
									</span>
								</div>
							)}

							<div className="flex items-center gap-1">
								<FolderOpenDot size={24} />
								<span className=" font-semibold text-foreground">
									Tipo de projeto:
								</span>
								<span className="text-foreground/80 text-base font-normal">
									{project.type}
								</span>
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-6 pt-0">
						{/* Datas e Status - Container Principal */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
							{/* Item de Detalhe - Card de Criação */}
							<div className="flex items-center gap-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
								<Calendar className="h-6 w-6 text-primary" />
								<div className="flex flex-col">
									<span className="font-semibold text-foreground text-sm">
										Criação
									</span>
									<span className="text-muted-foreground font-light text-sm">
										{format(project.createdAt, "dd/MM/yyyy", { locale: ptBR })}
									</span>
								</div>
							</div>

							{/* Item de Detalhe - Card de Prazo (se existir) */}
							{project.deadlineDate && (
								<div className="flex items-center gap-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
									<Calendar className="h-6 w-6 text-primary" />
									<div className="flex flex-col">
										<span className="font-semibold text-foreground text-sm">
											Prazo
										</span>
										<span className="text-muted-foreground font-light text-sm">
											{format(project.deadlineDate, "dd/MM/yyyy", {
												locale: ptBR,
											})}
										</span>
									</div>
								</div>
							)}

							{/* Item de Detalhe - Card de Status */}
							<div className="flex items-center gap-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
								<div className="flex flex-col gap-3">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-foreground text-sm">
											Status:
										</span>
										<StatusButtonProject
											projectId={project.id}
											currentStatus={project.status}
										/>
									</div>
									{project.deadlineDate && (
										<div className="flex items-center gap-2">
											{checkDeadline(project.deadlineDate) ? (
												// Se estiver fora do prazo, mostra a mensagem em vermelho
												<span className="flex items-center gap-1 text-xs font-normal text-destructive">
													<CircleX size={14} />
													Prazo Expirado
												</span>
											) : (
												// Se estiver dentro do prazo, mostra a mensagem em verde
												<span className="flex items-center gap-1 text-xs font-normal text-green-600">
													<Check size={14} />
													Dentro do Prazo
												</span>
											)}
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Seção de Descrição */}
						<div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
							<div className="flex items-center gap-2 mb-8">
								<Text size={24} />
								<span className="font-bold text-foreground text-lg  block">
									Descrição do Projeto
								</span>
							</div>
							<div className="max-w-none text-base leading-relaxed text-muted dark:text-muted-foreground max-h-96 overflow-auto scrollbar-custom">
								{project.description ? (
									<TiptapContentRenderer content={project.description} />
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
					{/* Preço do projeto */}
					<DetailCard title="Valor do Projeto" icon={<CircleDollarSign />}>
						<span className="text-lg text-muted-foreground">
							{project.price ? formatPrice(project.price) : "R$ 0,00"}
						</span>
					</DetailCard>
					{/* Contrato */}
					<DetailCard title="Contrato" icon={<FileText />}>
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
					</DetailCard>
				</div>
				{/* Seção "Nicho" */}
				{/* 	<div className="flex items-center gap-4">
					<DetailCard title="Nicho de Mercado" icon={<FileText />}>
						<p className="text-muted-foreground mt-2">
							Em qual nicho de mercado este projeto se insere? (Em
							desenvolvimento)
						</p>
					</DetailCard>
				</div> */}

				<ProjectProgressCard tasks={project.tasks || []} />

				{/* Seção de Listas de Tarefas e Comentários */}
				<TasksList projectId={project.id} tasks={project.tasks || []} />

				<CommentsList
					projectId={project.id}
					comments={project.comments || []}
				/>
			</div>

			{/* Coluna Secundária (à direita em telas grandes): Detalhes de Tarefas/Comentários */}
			<div className="lg:col-span-5 space-y-6 self-start sticky top-0">
				<DetailsTasksAndComments />
			</div>
		</div>
	);
}
