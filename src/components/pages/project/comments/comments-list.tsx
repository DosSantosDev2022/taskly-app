// src/components/pages/project/ProjectCommentsList.tsx
"use client";

import { AddComment } from "@/components/pages/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectDetailsStore } from "@/store";
import { formatDate } from "@/utils";
import type { Comment as PrismaComment } from "@prisma/client";
import { MessageCircleMore } from "lucide-react";

interface ProjectCommentsListProps {
	projectId: string;
	comments: PrismaComment[];
}

const CommentsList = ({ projectId, comments }: ProjectCommentsListProps) => {
	const selectComment = useProjectDetailsStore((state) => state.selectComment);

	return (
		<Card className="rounded-lg shadow-sm mb-10">
			<CardHeader>
				<div className="flex flex-col sm:flex-row border border-border rounded-md items-center justify-between p-3 gap-2">
					<CardTitle className="flex items-center gap-1 text-xl font-semibold mb-0 sm:mb-0">
						<MessageCircleMore />
						Comentários
					</CardTitle>
					<AddComment projectId={projectId} />
				</div>
			</CardHeader>
			<CardContent className="pt-4">
				<div className="space-y-2 max-h-96 overflow-y-auto scrollbar-custom p-1">
					{comments && comments.length > 0 ? (
						comments.map((comment) => (
							<Button
								key={comment.id}
								variant={"ghost"}
								onClick={() => selectComment(comment)}
								className="w-full h-14 flex flex-col items-start border rounded-md cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 text-left line-clamp-1"
								aria-label={`Visualizar comentário: ${comment.content.substring(0, 50)}...`}
							>
								<span className="text-xs font-light text-muted-foreground">
									<span className="font-bold text-foreground">
										Comentado em:
									</span>{" "}
									{formatDate(comment.createdAt)}
								</span>
								<p className="text-sm text-muted-foreground truncate line-clamp-2">
									{comment.content}
								</p>
							</Button>
						))
					) : (
						<p className="text-center text-muted-foreground py-4">
							Nenhum comentário cadastrado para este projeto.
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export { CommentsList };
