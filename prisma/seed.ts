// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid"; // Para gerar UUIDs

const prisma = new PrismaClient();

async function main() {
	console.log("Iniciando o seeding...");

	// --- 1. Limpeza de Dados (Ordem Importante Devido a Chaves Estrangeiras) ---
	console.log("Limpando dados existentes...");
	await prisma.comment.deleteMany({});
	await prisma.task.deleteMany({});
	await prisma.project.deleteMany({});
	await prisma.client.deleteMany({});
	// Se você tiver tabelas de autenticação (Next-Auth), considere limpá-las também
	// await prisma.account.deleteMany({});
	// await prisma.session.deleteMany({});
	await prisma.user.deleteMany({}); // Cuidado: isso removerá todos os usuários!
	console.log("Dados existentes limpos.");

	// --- 2. Criação de Usuário de Teste ---
	const hashedPassword = await hash("password123", 10);
	const testUser = await prisma.user.create({
		data: {
			id: uuidv4(), // Garante um UUID para o usuário
			name: "Usuário de Teste",
			email: "teste@example.com",
			password: hashedPassword,
			emailVerified: new Date(),
			image: "https://avatars.githubusercontent.com/u/8888888?v=4", // Opcional
		},
	});
	console.log(`Usuário de teste criado: ${testUser.name} (ID: ${testUser.id})`);

	// --- 3. Criação de Clientes ---
	const clientsData = [
		{
			id: uuidv4(),
			name: "Tech Solutions Ltda.",
			email: "contato@techsolutions.com",
			phone: "11987654321",
		},
		{
			id: uuidv4(),
			name: "Inovação Digital S.A.",
			email: "info@inovacaodigital.com",
			phone: "21912345678",
		},
		{
			id: uuidv4(),
			name: "Global Ventures",
			email: "support@globalventures.com",
			phone: "31998765432",
		},
		{
			id: uuidv4(),
			name: "Soluções Criativas Ltda.",
			email: "contato@solucoes-criativas.com",
			phone: "41912345678",
		},
		{
			id: uuidv4(),
			name: "Impacto Marketing Digital",
			email: "info@impacto-marketing.com",
			phone: "51998765432",
		},
	];

	const createdClients = [];
	for (const client of clientsData) {
		const newClient = await prisma.client.create({
			data: client,
		});
		createdClients.push(newClient);
		console.log(`Cliente criado: ${newClient.name} (ID: ${newClient.id})`);
	}

	// --- 4. Criação de Projetos (10 projetos vinculados a clientes e usuário) ---
	console.log("Criando projetos...");
	const projectTypes = ["WEB", "MOBILE", "SISTEMA"];
	const projectStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];

	for (let i = 0; i < 10; i++) {
		const randomClient =
			createdClients[Math.floor(Math.random() * createdClients.length)];
		const randomType =
			projectTypes[Math.floor(Math.random() * projectTypes.length)];
		const randomStatus =
			projectStatuses[Math.floor(Math.random() * projectStatuses.length)];

		const projectName = `Projeto ${i + 1} - ${randomClient.name}`;
		const projectDescription = `Descrição detalhada do ${projectName}. Este é um projeto de ${randomType} com o status ${randomStatus}.`;
		const deadlineDate = new Date();
		deadlineDate.setFullYear(
			deadlineDate.getFullYear() + (i % 2 === 0 ? 1 : 2),
		); // Alterna entre 1 e 2 anos no futuro

		const newProject = await prisma.project.create({
			data: {
				id: uuidv4(),
				name: projectName,
				description: projectDescription,
				type: randomType as any, // Conversão para o tipo enum do Prisma
				status: randomStatus as any, // Conversão para o tipo enum do Prisma
				userId: testUser.id,
				clientId: randomClient.id,
				deadlineDate: deadlineDate,
				// Exemplo de imagens (assumindo que 'images' é String[] no seu schema)
				// images: i % 3 === 0 ? [
				//   'https://via.placeholder.com/600x400/FF5733/FFFFFF?text=Preview+1',
				//   'https://via.placeholder.com/600x400/33FF57/FFFFFF?text=Preview+2',
				// ] : [],
				// Adicionar tarefas e comentários diretamente na criação do projeto
				tasks: {
					create: [
						{
							id: uuidv4(),
							title: `Tarefa ${i + 1}.1: Configurar ambiente`,
							description: `Descrição da tarefa de configuração do ambiente para o ${projectName}.`,
							status: "PENDING" as any,
						},
						{
							id: uuidv4(),
							title: `Tarefa ${i + 1}.2: Desenvolver feature X`,
							description: `Detalhes sobre o desenvolvimento da feature X no ${projectName}.`,
							status: "IN_PROGRESS" as any,
						},
						...(i % 2 === 0
							? [
									{
										id: uuidv4(),
										title: `Tarefa ${i + 1}.3: Testes de integração`,
										description: `Executar testes de integração para garantir a estabilidade do ${projectName}.`,
										status: "COMPLETED" as any,
									},
								]
							: []),
					],
				},
				comments: {
					create: [
						{
							id: uuidv4(),
							content: `Comentário ${i + 1}.1: Iniciando o projeto com otimismo.`,
							userId: testUser.id, // Comentários também precisam de um userId
						},
						...(i % 3 !== 0
							? [
									{
										id: uuidv4(),
										content: `Comentário ${i + 1}.2: Próximos passos definidos para o ${projectName}.`,
										userId: testUser.id,
									},
								]
							: []),
					],
				},
			},
		});
		console.log(`Projeto criado: ${newProject.name} (ID: ${newProject.id})`);
	}

	console.log("Seeding concluído com sucesso!");
}

main()
	.catch((e) => {
		console.error("Erro durante o seeding:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
