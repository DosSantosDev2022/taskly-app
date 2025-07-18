// Tipagem para uma tarefa (boa prática)
export type Task = {
	id: number;
	title: string;
	status: "Concluída" | "Em Andamento" | "Pendente";
	description: string;
};

export type Comment = {
	id: number;
	/* title: string; */
	content: string;
}; /* Centralizar exportações */
