import { ProjectProgressCard } from "@/components/pages/project/project-progress-card";
import { getTaskProgress } from "@/utils";
import type { Task as PrismaTask } from "@prisma/client";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock do módulo getTaskProgress para controlar o valor de retorno nos testes.
// Mocking the getTaskProgress module to control the return value in tests.
vi.mock("@/utils", () => ({
	getTaskProgress: vi.fn(),
}));

describe("ProjectProgressCard", () => {
	// Teste para verificar se o componente renderiza corretamente com o progresso calculado.
	// Test to check if the component renders correctly with the calculated progress.
	it("should render the component with the correct progress value", () => {
		const tasks: PrismaTask[] = [
			{
				id: "1",
				status: "COMPLETED",
				createdAt: new Date(),
				title: "Task 1",
				userId: "user-1",
				projectId: "project-1",
				description: "descrição-project-1",
				updatedAt: new Date(),
			},
			{
				id: "2",
				status: "IN_PROGRESS",
				createdAt: new Date(),
				title: "Task 2",
				userId: "user-1",
				projectId: "project-1",
				description: "descrição-project-2",
				updatedAt: new Date(),
			},
		];

		vi.mocked(getTaskProgress).mockReturnValue(50);

		render(<ProjectProgressCard tasks={tasks} />);

		// Verifica se a label de progresso é renderizada com o valor esperado.
		// Check if the progress label is rendered with the expected value.
		const progressLabel = screen.getByText("50%");
		expect(progressLabel).toBeInTheDocument();

		// Verifica se a barra de progresso tem o rótulo de acessibilidade correto.
		// Check if the progress bar has the correct accessibility label.
		const progressBar = screen.getByRole("progressbar", {
			name: "Progresso do projeto: 50%",
		});
		expect(progressBar).toBeInTheDocument();
	});

	// Teste para verificar se o componente exibe 0% quando não há tarefas.
	// Test to check if the component displays 0% when there are no tasks.
	it("should display 0% progress when there are no tasks", () => {
		const tasks: PrismaTask[] = [];

		// Define o valor de retorno mockado para a função getTaskProgress
		// Set the mocked return value for the getTaskProgress function
		vi.mocked(getTaskProgress).mockReturnValue(0);

		render(<ProjectProgressCard tasks={tasks} />);

		// Verifica se o texto 0% e o rótulo de acessibilidade são exibidos corretamente.
		// Check if the 0% text and accessibility label are displayed correctly.
		const progressLabel = screen.getByText("0%");
		expect(progressLabel).toBeInTheDocument();

		const progressBar = screen.getByRole("progressbar", {
			name: "Progresso do projeto: 0%",
		});
		expect(progressBar).toBeInTheDocument();
	});

	// Teste para verificar se o componente exibe 100% quando todas as tarefas estão completas.
	// Test to check if the component displays 100% when all tasks are complete.
	it("should display 100% progress when all tasks are completed", () => {
		const tasks: PrismaTask[] = [
			{
				id: "1",
				status: "COMPLETED",
				createdAt: new Date(),
				title: "Task 1",
				userId: "user-1",
				projectId: "project-1",
				description: "descrição-project-1",
				updatedAt: new Date(),
			},
			{
				id: "2",
				status: "IN_PROGRESS",
				createdAt: new Date(),
				title: "Task 2",
				userId: "user-1",
				projectId: "project-1",
				description: "descrição-project-2",
				updatedAt: new Date(),
			},
		];

		// Define o valor de retorno mockado para a função getTaskProgress
		// Set the mocked return value for the getTaskProgress function
		vi.mocked(getTaskProgress).mockReturnValue(100);

		render(<ProjectProgressCard tasks={tasks} />);

		// Verifica se o texto 100% e o rótulo de acessibilidade são exibidos corretamente.
		// Check if the 100% text and accessibility label are displayed correctly.
		const progressLabel = screen.getByText("100%");
		expect(progressLabel).toBeInTheDocument();

		const progressBar = screen.getByRole("progressbar", {
			name: "Progresso do projeto: 100%",
		});
		expect(progressBar).toBeInTheDocument();
	});

	// Teste para verificar se o componente renderiza sem problemas se o array de tarefas for nulo ou indefinido.
	// Test to check if the component renders without issues if the tasks array is null or undefined.
	it("should not break if the tasks array is null or undefined", () => {
		vi.mocked(getTaskProgress).mockReturnValue(0);

		const { rerender } = render(<ProjectProgressCard tasks={null as any} />);

		const nullTasksProgressBar = screen.getByRole("progressbar", {
			name: "Progresso do projeto: 0%",
		});
		expect(nullTasksProgressBar).toBeInTheDocument();

		// Rerenderiza com tarefas indefinidas para garantir a robustez.
		// Rerender with undefined tasks to ensure robustness.
		rerender(<ProjectProgressCard tasks={undefined as any} />);
		const undefinedTasksProgressBar = screen.getByRole("progressbar", {
			name: "Progresso do projeto: 0%",
		});
		expect(undefinedTasksProgressBar).toBeInTheDocument();
	});
});
