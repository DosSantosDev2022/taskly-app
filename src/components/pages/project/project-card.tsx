// src/components/ProjectCard.tsx (exemplo)
// biome-ignore assist/source/organizeImports: <explanation>
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui";
import { FolderKanban } from "lucide-react";
import Link from "next/link";

// Tipando as props para melhor manutenibilidade
type Project = {
	id: number;
	name: string;
	description: string;
	type: string;
};

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
				{/*
          BEST PRACTICE: Use 'asChild' para que o Button renderize como o seu filho (o Link),
          mas mantendo todo o estilo do botão. Isso é ótimo para acessibilidade e SEO.
        */}
				<Button asChild className="w-full">
					<Link href={`/projects/${project.id}`}>Ver mais</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};
