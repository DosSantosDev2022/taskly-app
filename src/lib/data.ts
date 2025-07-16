// src/lib/data.ts

// 1. Nossos dados simulados (mock)
const mockProjects = [
	{
		id: 1,
		name: "Desenvolvimento de E-commerce",
		description:
			"Um projeto completo para criação de uma loja virtual robusta...",
		type: "Web",
		subtype: "E-commerce",
	},
	{
		id: 2,
		name: "Aplicativo de Gestão de Tarefas",
		description: "Criação de um aplicativo móvel para iOS e Android...",
		type: "Mobile",
		subtype: "Produtividade",
	},
	{
		id: 3,
		name: "Landing Page para Startup",
		description: "Design e desenvolvimento de uma landing page otimizada...",
		type: "Web",
		subtype: "Marketing",
	},
	{
		id: 4,
		name: "Sistema de Blog com CMS",
		description:
			"Plataforma de blog customizada com um sistema de gerenciamento...",
		type: "Web",
		subtype: "Conteúdo",
		tasks: [
			{
				id: 101,
				title: "Configurar ambiente de desenvolvimento",
				status: "Concluída",
				details: "Instalar Node.js, pnpm, e configurar o repositório Git.",
			},
			{
				id: 102,
				title: "Criar componentes da UI",
				status: "Em Andamento",
				details:
					"Desenvolver os componentes de Card, Button, e Header com shadcn/ui.",
			},
			{
				id: 103,
				title: "Implementar autenticação de usuário",
				status: "Pendente",
				details:
					"Criar rotas de login, registro e recuperação de senha com NextAuth.",
			},
		],
		comments: [
			{
				id: 201,
				title: "Revisão de Design",
				content:
					'O design da página de produto precisa de mais contraste no botão "Comprar".',
			},
			{
				id: 202,
				title: "Sugestão de Funcionalidade",
				content:
					'Poderíamos adicionar uma seção de "Produtos Recomendados" baseada no histórico de navegação.',
			},
		],
		images: ["/preview.jpg", "/preview.jpg", "/preview.jpg", "/preview.jpg"],
	},

	// ... adicione quantos projetos quiser
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
