// components/modals/AddProjectModal.tsx
"use client";

import { AddProjectForm } from "@/components/pages/project";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export const AddProjectModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{/* Este botão aciona o modal */}
				<Button variant={"secondary"}>
					<PlusCircle className="h-4 w-4" />
					Novo Projeto
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Adicionar Novo Projeto</DialogTitle>
					<DialogDescription>
						Preencha os campos abaixo para cadastrar um novo projeto.
					</DialogDescription>
				</DialogHeader>

				{/* O formulário agora é o conteúdo do modal, e ele gerencia seu próprio carregamento de clientes */}
				<AddProjectForm onSuccess={() => setIsOpen(false)} />
			</DialogContent>
		</Dialog>
	);
};
