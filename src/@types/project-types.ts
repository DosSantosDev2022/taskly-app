import { Task as PrismaTask, ProjectStatus, ProjectType } from "@prisma/client";

// --- Interfaces de Tipos Auxiliares ---

/**
 * @interface UserSummary
 * @description Define a estrutura resumida para informações de usuário, tipicamente usada em relacionamentos.
 */
export interface UserSummary {
	id?: string; // Adicionado id para consistência e uso em links/referências
	name: string | null;
	email: string | null;
}

/**
 * @interface ClientSummary
 * @description Define a estrutura resumida para informações de cliente, tipicamente usada em relacionamentos.
 */
export interface ClientSummary {
	id?: string; // Adicionado id para consistência e uso em links/referências
	name: string | null;
	email: string | null;
}

/**
 * @interface ProjectComment
 * @description Representa a estrutura de um comentário associado a um projeto.
 * Extende o tipo gerado pelo Prisma para comentários, se necessário, ou redefine para controle total.
 */
export interface ProjectComment {
	/** O identificador único do comentário. */
	id: string;
	/** Data e hora de criação do comentário. */
	createdAt: Date;
	/** Data e hora da última atualização do comentário. */
	updatedAt: Date;
	/** O ID do usuário que fez o comentário. */
	userId: string;
	/** O conteúdo textual do comentário. */
	content: string;
	/** O ID do projeto ao qual o comentário pertence. */
	projectId: string;
}

/**
 * @interface Task
 * @description Representa a estrutura de uma tarefa associada a um projeto.
 * Geralmente, pode ser um subconjunto ou o tipo completo gerado pelo Prisma.
 * Usamos `PrismaTask` e renomeamos para `Task` para clareza no domínio da aplicação.
 */
export interface Task extends PrismaTask {
	// Você pode adicionar ou omitir campos aqui se precisar de uma versão mais específica para o frontend.
	// Por exemplo, se Task do Prisma tem muitos campos, mas você só precisa de alguns:
	// id: string;
	// title: string;
	// completed: boolean;
	// ...
}

// --- Interfaces Principais ---

/**
 * @interface ProjectDetails
 * @description Define a estrutura detalhada de um projeto, incluindo seus relacionamentos.
 * Este tipo é ideal para ser usado no frontend para exibir informações completas do projeto.
 */
export interface ProjectDetails {
	/** O identificador único do projeto. */
	id: string;
	/** O nome do projeto. */
	name: string;
	/** Uma descrição detalhada do projeto, pode ser nula. */
	description: string | null;
	/** O tipo do projeto, conforme definido pelo enum ProjectType do Prisma. */
	type: ProjectType;
	/** O status atual do projeto, conforme definido pelo enum ProjectStatus do Prisma. */
	status: ProjectStatus;
	/** O ID do usuário responsável pelo projeto. */
	userId: string;
	/** O preço acordado para o projeto. */
	price: number;
	/** A data limite para a conclusão do projeto, pode ser nula. */
	deadlineDate: Date | null;
	/** Data e hora de criação do registro do projeto. */
	createdAt: Date;
	/** Data e hora da última atualização do registro do projeto. */
	updatedAt: Date;
	/** O ID do cliente associado ao projeto, pode ser nulo. */
	clientId: string | null;
	/** URL do contrato do projeto, pode ser nula. */
	contractUrl: string | null;
	/** Nome do arquivo do contrato, pode ser nulo. */
	contractFileName: string | null;
	/**
	 * Informações resumidas do usuário associado ao projeto.
	 * Opcional, pois pode não ser sempre incluído na consulta.
	 */
	user?: UserSummary | null;
	/**
	 * Informações resumidas do cliente associado ao projeto.
	 * Opcional, pois pode não ser sempre incluído na consulta.
	 */
	client?: ClientSummary | null;
	/**
	 * Lista de tarefas associadas ao projeto.
	 * Opcional, pois pode não ser sempre incluído na consulta.
	 */
	tasks?: Task[];
	/**
	 * Lista de comentários associados ao projeto.
	 * Opcional, pois pode não ser sempre incluído na consulta.
	 */
	comments?: ProjectComment[];
}
