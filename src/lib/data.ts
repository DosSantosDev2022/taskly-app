// src/lib/data.ts

// 1. Nossos dados simulados (mock)
const mockProjects = [
	{
		id: 11,
		name: "Plataforma de Cursos Online",
		description:
			"Desenvolvimento de uma plataforma EAD completa com upload de vídeos, quizzes interativos, fórum de discussões e emissão de certificados digitais para os alunos.",
		type: "web",
		subtype: "EdTech",
		creationDate: new Date("2025-05-10T10:00:00Z"), // Data de Criação
		deadlineDate: new Date("2025-10-30T23:59:59Z"), // Data de Prazo
		status: "in_progress", // "pending", "in_progress", "completed"
		images: [
			"https://placehold.co/800x600/31343C/FFFFFF/png?text=Tela+Inicial",
			"https://placehold.co/800x600/5A67D8/FFFFFF/png?text=Player+de+Video",
		],
		clientId: "2", // ID correspondente a "Innovate Solutions"
		tasks: [
			{
				id: 301,
				title: "Modelar banco de dados",
				status: "Concluída",
				details: "Definir tabelas de usuários, cursos e matrículas.",
			},
			{
				id: 302,
				title: "Criar tela de login",
				status: "Em Andamento",
				details: "Implementar o fluxo de autenticação.",
			},
		],
		comments: [
			{
				id: 401,
				title: "Sugestão de cor",
				content:
					"A paleta de cores primária poderia ser mais vibrante para atrair o público jovem.",
			},
		],
	},
	{
		id: 12,
		name: "App de Agendamento para Barbearias",
		description:
			"Aplicativo móvel para iOS e Android que permite aos clientes agendar horários com seus barbeiros preferidos, escolher serviços e realizar o pagamento de forma antecipada.",
		type: "mobile",
		subtype: "Serviços / Lifestyle",
		creationDate: new Date("2025-06-20T09:00:00Z"),
		deadlineDate: new Date("2025-11-25T23:59:59Z"),
		status: "pending",
		images: [
			"https://placehold.co/800x600/9F7AEA/FFFFFF/png?text=App+Preview+1",
			"https://placehold.co/800x600/4FD1C5/FFFFFF/png?text=App+Preview+2",
		],
		clientId: "3", // ID correspondente a "Creative Minds"
		tasks: [],
		comments: [],
	},
	{
		id: 13,
		name: "Dashboard de Análise de Vendas",
		description:
			"Sistema web interno para a equipe de vendas visualizar métricas em tempo real. Inclui gráficos dinâmicos de faturamento, análise de produtos mais vendidos e performance por vendedor.",
		type: "web",
		subtype: "Business Intelligence",
		creationDate: new Date("2025-02-15T14:00:00Z"),
		deadlineDate: new Date("2025-07-10T23:59:59Z"), // Prazo no passado
		status: "completed",
		images: [
			"https://placehold.co/800x600/F6AD55/FFFFFF/png?text=Dashboard+Principal",
		],
		clientId: "1", // ID correspondente a "Tech Corp"
		tasks: [
			{
				id: 501,
				title: "Integrar com API de vendas",
				status: "Concluída",
				details: "Conectar ao endpoint principal de vendas.",
			},
			{
				id: 502,
				title: "Desenvolver gráficos",
				status: "Concluída",
				details: "Usar Chart.js para criar os dashboards.",
			},
			{
				id: 503,
				title: "Publicar em produção",
				status: "Concluída",
				details: "Fazer o deploy final na Vercel.",
			},
		],
		comments: [],
	},
];

// 2. Função para buscar TODOS os projetos
// No futuro, esta função será um "Server Action" async que busca dados do seu BD.
export const getProjects = () => {
	console.log("Buscando todos os projetos...");
	// Simula um delay de rede, se desejar
	// await new Promise(resolve => setTimeout(resolve, 1000));
	return mockProjects;
};

// 3. Função para buscar UM projeto pelo ID
// No futuro, esta também será um "Server Action" async com "WHERE id = ..."
export const getProjectById = (id: number) => {
	console.log(`Buscando projeto com ID: ${id}`);
	return mockProjects.find((project) => project.id === id);
};
