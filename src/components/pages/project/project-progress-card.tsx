// src/components/pages/project/ProjectProgressCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getTaskProgress } from "@/utils";
import type { Task as PrismaTask } from "@prisma/client";

interface ProjectProgressCardProps {
	tasks: PrismaTask[];
}

const ProjectProgressCard = ({ tasks }: ProjectProgressCardProps) => {
	const projectProgress = getTaskProgress(tasks);

	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex items-center gap-4">
					<span className="font-bold text-foreground text-base">
						Progresso:
					</span>
					<Progress
						className="h-5 flex-grow bg-gray-200 dark:bg-gray-700 [&>div]:bg-green-500"
						value={projectProgress}
						showValue={true} // Adicionado `showValue` para exibir a porcentagem
						aria-label={`Progresso do projeto: ${projectProgress}%`}
					/>
				</div>
			</CardContent>
		</Card>
	);
};

export { ProjectProgressCard };
