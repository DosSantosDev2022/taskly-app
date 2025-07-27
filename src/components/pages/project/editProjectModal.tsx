// src/components/modals/EditProjectModal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { EditProjectForm } from "@/components/pages"; // Ajuste o path conforme sua estrutura
import type { ProjectForClient } from "@/actions/project/getProject";

interface EditProjectModalProps {
	project: ProjectForClient;
	triggerButtonText?: string;
}

export const EditProjectModal = ({
	project,
	triggerButtonText = "Editar Projeto",
}: EditProjectModalProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{/* Este botão aciona o modal */}
				<Button variant="outline">{triggerButtonText}</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Editar Projeto</DialogTitle>
					<DialogDescription>
						Atualize os campos abaixo para editar o projeto.
					</DialogDescription>
				</DialogHeader>

				{/* O formulário de edição é o conteúdo do modal */}
				<EditProjectForm project={project} onSuccess={() => setIsOpen(false)} />
			</DialogContent>
		</Dialog>
	);
};
