import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui";
import type { Project } from "@prisma/client";
import { FolderKanban } from "lucide-react";
import Link from "next/link";

export const ProjectCard = ({ project }: { project: Project }) => {
	return (
		<Card className="flex flex-col h-full">
			<CardHeader className="flex flex-row items-start gap-4 space-y-0">
				<div className="space-y-1">
					<CardTitle>{project.name}</CardTitle>
					<CardDescription className="line-clamp-2">
						{project.description}
					</CardDescription>
				</div>
				<div className="p-2 bg-muted rounded-md ml-auto">
					<FolderKanban className="h-6 w-6" />
				</div>
			</CardHeader>
			<CardContent className="flex-grow">
				<p className="text-sm text-muted-foreground">
					Tipo:{" "}
					<span className="font-medium text-foreground">{project.type}</span>
				</p>
			</CardContent>
			<CardFooter>
				<Button asChild className="w-full">
					<Link href={`/projects/project/${project.id}`}>Ver mais</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};
