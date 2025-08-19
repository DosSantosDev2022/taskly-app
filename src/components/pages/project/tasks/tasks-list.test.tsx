import { TasksList } from "@/components/pages/project/tasks/tasks-list";
import { useProjectDetailsStore } from "@/store";
import type { Task as PrismaTask } from "@prisma/client";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// Mock das dependências externas
vi.mock("@/store", () => ({
	useProjectDetailsStore: vi.fn(),
}));

vi.mock("@/components/pages/project", () => ({
	AddTask: vi.fn(() => <div>Mocked AddTask</div>),
}));

vi.mock("@/utils", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/utils")>();
	return {
		...actual,
		formatStatus: vi.fn(actual.formatStatus),
		getStatusLabel: vi.fn(actual.getStatusLabel),
		getStatusStyles: vi.fn(actual.getStatusStyles),
	};
});

// Dados de mock
const mockTasks: PrismaTask[] = [
	{
		userId: "user-id-001",
		id: "task-1",
		title: "Initial setup of the project",
		description: "Setting up all necessary dependencies.",
		projectId: "project-1",
		createdAt: new Date(),
		updatedAt: new Date(),
		status: "PENDING",
	},
	{
		userId: "user-id-001",
		id: "task-2",
		title: "Implement user authentication",
		description: "Setting up the login and registration system.",
		projectId: "project-1",
		createdAt: new Date(),
		updatedAt: new Date(),
		status: "IN_PROGRESS",
	},
];

describe("TasksList", () => {
	// Teste para verificar se a lista de tarefas é renderizada corretamente com dados
	// Test to check if the task list is rendered correctly with data
	it("should render the task list with tasks", () => {
		// Mock do store com uma função de seleção
		const selectTaskMock = vi.fn();
		(
			useProjectDetailsStore as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue(selectTaskMock);

		render(<TasksList projectId="project-1" tasks={mockTasks} />);

		// Verifica se o cabeçalho e o componente AddTask estão presentes
		expect(screen.getByText("Tarefas")).toBeInTheDocument();
		expect(screen.getByText("Mocked AddTask")).toBeInTheDocument();

		// Verifica se cada tarefa da lista é renderizada
		expect(
			screen.getByText("Initial setup of the project"),
		).toBeInTheDocument();
		expect(
			screen.getByText("Implement user authentication"),
		).toBeInTheDocument();
	});

	// Teste para verificar se a mensagem de "nenhuma tarefa" é exibida quando a lista está vazia
	// Test to check if the "no tasks" message is displayed when the list is empty
	it("should display a message when there are no tasks", () => {
		// Mock do store
		(
			useProjectDetailsStore as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue(vi.fn());

		render(<TasksList projectId="project-1" tasks={[]} />);

		// Verifica se a mensagem de lista vazia é exibida
		expect(
			screen.getByText("Nenhuma tarefa cadastrada para este projeto."),
		).toBeInTheDocument();
	});

	// Teste para verificar se a função selectTask é chamada ao clicar em uma tarefa
	// Test to check if the selectTask function is called when a task is clicked
	it("should call selectTask when a task is clicked", async () => {
		// Mock do store com a função de seleção
		const selectTaskMock = vi.fn();
		(
			useProjectDetailsStore as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue(selectTaskMock);

		render(<TasksList projectId="project-1" tasks={mockTasks} />);

		const user = userEvent.setup();

		// Encontra a tarefa pelo seu aria-label e simula o clique
		const firstTaskButton = screen.getByRole("button", {
			name: "Editar tarefa: Initial setup of the project",
		});
		await user.click(firstTaskButton);

		// Verifica se a função selectTask foi chamada com os dados corretos da primeira tarefa
		expect(selectTaskMock).toHaveBeenCalledWith(mockTasks[0]);
	});
});
