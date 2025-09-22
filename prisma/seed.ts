// prisma/seed.ts

// 1. Importe o bcrypt
import * as bcrypt from "bcrypt";
import {
	PrismaClient,
	ProjectStatus,
	ProjectType,
	TaskStatus,
} from "@prisma/client";
import { faker } from "@faker-js/faker/locale/pt_BR";

const prisma = new PrismaClient();

async function main() {
	// A parte de limpeza do banco de dados continua a mesma...
	console.log("🧹 Limpando o banco de dados...");
	await prisma.comment.deleteMany({});
	await prisma.task.deleteMany({});
	await prisma.project.deleteMany({});
	await prisma.client.deleteMany({});
	await prisma.user.deleteMany({});
	console.log("✅ Banco de dados limpo.");

	// ----------------------------------------------------------------
	// 2. CRIAÇÃO DO USUÁRIO PRINCIPAL (COM SENHA HASHED)
	// ----------------------------------------------------------------
	console.log("👤 Criando usuário principal...");

	// 2a. Defina a nova senha forte
	const plainPassword = "SenhaForte@123";

	// 2b. Gere o hash da senha
	// O segundo argumento (10) é o "custo" do hash. 10 é um bom valor padrão.
	const hashedPassword = await bcrypt.hash(plainPassword, 10);
	console.log("🔒 Senha criptografada com sucesso.");

	const mainUser = await prisma.user.create({
		data: {
			name: "Usuário Admin",
			email: "admin@example.com",
			emailVerified: new Date(),
			// 2c. Salve o HASH da senha, e não a senha pura
			password: hashedPassword,
		},
	});
	console.log(`✅ Usuário principal criado com ID: ${mainUser.id}`);

	// O resto do script (criação de clientes, projetos, etc.) continua exatamente o mesmo...
	// ----------------------------------------------------------------
	// 3. CRIAÇÃO DOS CLIENTES
	// ----------------------------------------------------------------
	console.log("🏢 Criando 20 clientes...");
	const createdClients = [];
	for (let i = 0; i < 20; i++) {
		const client = await prisma.client.create({
			data: {
				name: faker.company.name(),
				email: faker.internet.email(),
				phone: faker.phone.number(),
				userId: mainUser.id,
			},
		});
		createdClients.push(client);
	}
	console.log("✅ 20 clientes criados.");

	// ----------------------------------------------------------------
	// 4. CRIAÇÃO DE PROJETOS, TAREFAS E COMENTÁRIOS
	// ----------------------------------------------------------------
	console.log(
		"🚀 Criando 20 projetos, cada um com 10 tarefas e 10 comentários...",
	);

	const projectTypes = Object.values(ProjectType);
	const projectStatuses = Object.values(ProjectStatus);
	const taskStatuses = Object.values(TaskStatus);

	for (let i = 0; i < 20; i++) {
		const project = await prisma.project.create({
			data: {
				name: faker.commerce.productName() + " Project",
				description: faker.lorem.paragraph(),
				price: parseFloat(faker.commerce.price({ min: 1000, max: 20000 })),
				deadlineDate: faker.date.future(),
				type: faker.helpers.arrayElement(projectTypes),
				status: faker.helpers.arrayElement(projectStatuses),
				userId: mainUser.id,
				clientId: createdClients[i].id,
				tasks: {
					createMany: {
						data: Array.from({ length: 10 }, () => ({
							title: faker.lorem.sentence(4),
							description: faker.lorem.paragraph(2),
							status: faker.helpers.arrayElement(taskStatuses),
							userId: mainUser.id,
						})),
					},
				},
				comments: {
					createMany: {
						data: Array.from({ length: 10 }, () => ({
							content: faker.lorem.sentence(),
							userId: mainUser.id,
						})),
					},
				},
			},
		});
		console.log(
			`   -> Projeto '${project.name}' criado com suas tarefas e comentários.`,
		);
	}
	console.log("✅ Projetos, tarefas e comentários criados com sucesso!");
}

main()
	.catch((e) => {
		console.error("❌ Ocorreu um erro ao popular o banco de dados:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
