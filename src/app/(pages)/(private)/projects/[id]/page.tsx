"use client";
// biome-ignore assist/source/organizeImports: <explanation>
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Dialog,
	DialogContent,
} from "@/components/ui";
import { getProjectById } from "@/lib/data";
import { notFound } from "next/navigation";
import { useState } from "react"; // 2. Importamos o useState
import { X } from "lucide-react";
import { AddComment, AddTask } from "@/components/pages";
import type { Task, Comment } from "@/@types";
import Image from "next/image";
import { format } from "date-fns";

interface ProjectDetailsPageProps {
	params: {
		id: string;
	};
}

export default function ProjectDetailsPage({
	params,
}: ProjectDetailsPageProps) {
	// A lógica para buscar o projeto continua a mesma
	const project = getProjectById(Number(params.id));

	// 3. Criamos um estado para armazenar a tarefa selecionada
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	if (!project) {
		notFound();
	}

	return (
		<div className="container mx-auto pt-24 p-4 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-6">
			{/* Coluna Principal com os detalhes do projeto e tarefas */}
			<div className="lg:col-span-7 space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="text-4xl">{project.name}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2">
							{/* tipo */}
							<p className="text-lg text-muted-foreground">
								{project.type} - {project.subtype}
							</p>
							{/* data de criação */}
							<span className="font-medium text-muted-foreground">
								<span className="font-bold text-foreground mr-1">
									Data de criação:
								</span>{" "}
								{format(project.creationDate, "dd/MM/yyyy")}
							</span>
							{/* data de prazo */}
							<span className="font-medium text-muted-foreground">
								<span className="font-bold text-foreground mr-1">
									Data de prazo:
								</span>{" "}
								{format(project.deadlineDate, "dd/MM/yyyy")}
							</span>
							{/* status */}
							<>
								<span className="font-bold text-foreground mr-1">Status: </span>
								<Badge>{project.status}</Badge>
							</>
						</div>
						<div className="prose dark:prose-invert mt-4">
							<p>{project.description}</p>
						</div>
					</CardContent>
				</Card>

				<Card className="space-y-4 p-4">
					<h2 className="font-bold text-xl">Problema</h2>
				</Card>

				{/* seção tipo e publico alvo ou algo do tipo */}

				<div className="flex items-center gap-2.5">
					<Card className="space-y-4 p-4 w-full">
						<h2 className="font-bold text-xl">Tipo</h2>
					</Card>

					<Card className="space-y-4 p-4 w-full ">
						<h2 className="font-bold text-xl">Publico alvo</h2>
					</Card>
				</div>

				{/* seção nicho ou algo do tipo */}

				<div className="flex items-center gap-2.5">
					<Card className="space-y-4 p-4 w-full">
						<h2 className="font-bold text-xl">Nicho</h2>
					</Card>
				</div>

				{/* Seção de Previews de Imagens */}
				{project.images && project.images.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Previews do Projeto</CardTitle>
						</CardHeader>
						<CardContent>
							{/* Grid responsivo para as miniaturas */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{project.images.map((image, index) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										key={index}
										className="cursor-pointer overflow-hidden rounded-lg border hover:opacity-80 transition-opacity"
										// Ao clicar, definimos a imagem que será aberta no modal
										onClick={() => setSelectedImage(image)}
									>
										{/** biome-ignore lint/performance/noImgElement: <explanation> */}
										<img
											src={image}
											alt={`Preview ${index + 1} do projeto ${project.name}`}
											className="aspect-video w-full h-full object-cover"
										/>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Componente Dialog para o Modal de Tela Cheia */}
				<Dialog
					// O modal estará aberto se 'selectedImage' tiver uma URL (não for null)
					open={!!selectedImage}
					// Quando o modal for fechado (pelo 'X' ou clique fora), limpamos o estado
					onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}
				>
					<DialogContent className="max-w-7xl w-full border-none p-0">
						{/* A imagem grande dentro do modal */}
						{selectedImage && (
							<div className="relative w-full aspect-video">
								<Image
									src={selectedImage}
									alt="Visualização ampliada da imagem do projeto"
									fill
									className="object-contain rounded-md"
								/>
							</div>
						)}
					</DialogContent>
				</Dialog>

				{/* 4. Seção com a lista de tarefas do projeto */}
				{project.tasks && project.tasks.length > 0 && (
					<Card>
						<CardHeader>
							<div className="flex border border-border rounded-md items-center justify-between p-3">
								<CardTitle>Tarefas do Projeto</CardTitle>
								<AddTask /> {/* Dialog para add tasks */}
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{project.tasks.map((task) => (
									<div
										key={task.id}
										className="flex justify-between items-center p-3 border rounded-md cursor-pointer hover:bg-muted"
										onClick={() =>
											setSelectedTask({
												...task,
												status:
													task.status === "Concluída" ||
													task.status === "Em Andamento" ||
													task.status === "Pendente"
														? task.status
														: "Pendente",
											})
										} // Ao clicar, atualiza o estado
									>
										<span className="font-medium">{task.title}</span>
										<span className="text-sm text-muted-foreground">
											{task.status}
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Seção commentários */}

				{project.comments && project.comments.length > 0 && (
					<Card>
						<CardHeader>
							<div className="flex border border-border rounded-md items-center justify-between p-3">
								<CardTitle>Comentários do Projeto</CardTitle>
								<AddComment /> {/* Dialog para add comentários */}
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{project.comments.map((comment) => (
									<div
										key={comment.id}
										className="flex justify-between items-center p-3 border rounded-md cursor-pointer hover:bg-muted"
										onClick={() => setSelectedComment(comment)} // Ao clicar, atualiza o estado
									>
										<span className="font-medium">{comment.title}</span>
										<p className="text-sm text-muted-foreground">
											{comment.content}
										</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* coluna seção detalhes tasks e comments */}
			<div className="lg:col-span-5">
				<div className="sticky top-24 space-y-6">
					{/* Detalhes da Tarefa */}
					{selectedTask && (
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle>Detalhes da Tarefa</CardTitle>
								<Button
									onClick={() => setSelectedTask(null)}
									className="p-1 rounded-full hover:scale-95"
								>
									<X className="h-3 w-3" />
								</Button>
							</CardHeader>
							<CardContent className="space-y-4">
								<h3 className="text-xl font-semibold">{selectedTask.title}</h3>
								<p>
									<span className="font-bold">Status: </span>
									{selectedTask.status}
								</p>
								<div>
									<p className="font-bold mb-1">Descrição:</p>
									<p className="text-muted-foreground">
										{selectedTask.details}
									</p>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Detalhes do Comentário */}
					{selectedComment && (
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle>Detalhes do Comentário</CardTitle>
								<Button
									onClick={() => setSelectedComment(null)}
									className="p-1 rounded-full hover:scale-95"
								>
									<X className="h-3 w-3" />
								</Button>
							</CardHeader>
							<CardContent className="space-y-4">
								<h3 className="text-xl font-semibold">
									{selectedComment.title}
								</h3>
								<div>
									<p className="font-bold mb-1">Conteúdo:</p>
									<p className="text-muted-foreground">
										{selectedComment.content}
									</p>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
