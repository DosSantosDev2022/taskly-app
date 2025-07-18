// src/app/projects/[id]/_components/ProjectCommentList.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { AddComment } from "@/components/pages"; // Importe o modal de adição de comentários
import type { Comment as PrismaComment } from "@prisma/client";

// Definição dos tipos para o frontend
type SelectedComment = {
	id: string;
	content: string;
};

interface ProjectCommentListProps {
	comments: PrismaComment[];
	onSelectComment: (comment: SelectedComment) => void; // Callback para o pai
}

export function ProjectCommentList({
	comments,
	onSelectComment,
}: ProjectCommentListProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex border border-border rounded-md items-center justify-between p-3">
					<CardTitle>Comentários do Projeto</CardTitle>
					<AddComment />
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					{comments.length > 0 ? (
						comments.map((comment) => (
							<div
								key={comment.id}
								className="flex justify-between items-center p-3 border rounded-md cursor-pointer hover:bg-muted"
								onClick={() =>
									onSelectComment({
										id: comment.id,
										content: comment.content,
									})
								}
							>
								<span className="font-medium">{comment.id}</span>
								<p className="text-sm text-muted-foreground">
									{comment.content}
								</p>
							</div>
						))
					) : (
						<p className="text-center text-muted-foreground">
							Nenhum comentário cadastrado.
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
