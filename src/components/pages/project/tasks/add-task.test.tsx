// src/components/pages/project/add-task.test.tsx

import { addTaskAction } from "@/actions/task";
import { AddTask } from "@/components/pages/project/add-task";
import "@testing-library/jest-dom/vitest";
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

// --- Mocks ---
// 1. Mocka o módulo completo de forma "auto-mocked"
vi.mock("@/actions/task", () => ({
	addTaskAction: vi.fn(),
}));

const mockAddTaskAction = vi.mocked(addTaskAction);
// 2. Importa o mock da função específica após o mock do módulo

// Agora, o mock de "react" pode usar as variáveis já inicializadas.
const mockStartTransition = vi.fn();
vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>();
	return {
		...actual,
		useTransition: () => [false, mockStartTransition],
	};
});

// Mock do `toast` (mantido como estava, está correto)
vi.mock("react-toastify", () => ({
	...vi.importActual("react-toastify"),
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

// Mock do `toast` para verificar as chamadas de sucesso e erro
vi.mock("react-toastify", () => ({
	...vi.importActual("react-toastify"),
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
	Bounce: vi.fn(),
}));

const mockProjectId = "project-123";
const userId = "3e1b2a2849508d81";

// --- Suite de Testes ---
describe("AddTask", () => {
	beforeEach(() => {
		// Limpa todos os mocks antes de cada teste
		vi.clearAllMocks();

		// Mock da função `scrollIntoView`
		window.HTMLElement.prototype.scrollIntoView = vi.fn();

		// Configura o mock do useTransition para não ser "pending" por padrão
		mockStartTransition.mockImplementation((fn) => {
			// Usamos `Promise.resolve` e `await` para garantir que a transição assíncrona seja
			// tratada corretamente pelo `act` e a UI se atualize.
			// Isso simula o comportamento de uma Server Action assíncrona de forma confiável.
			vi.useFakeTimers();
			fn();
			vi.runAllTimers();
			vi.useRealTimers();
		});

		// Mock da Server Action para retornar sucesso por padrão
		mockAddTaskAction.mockResolvedValue({
			success: true,
			newTask: {
				userId: userId,
				id: "task-1",
				title: "Nova Tarefa",
				description: "Descrição da tarefa",
				projectId: mockProjectId,
				status: "PENDING",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			message: "",
		});
	});

	it("should render the add task button", () => {
		/* deve renderizar o botão adicionar tarefa */
		render(<AddTask projectId={mockProjectId} />);
		const addTaskButton = screen.getByRole("button", { name: /Adicionar/i });
		expect(addTaskButton).toBeInTheDocument();
	});

	it("should open and close the dialog when the button is clicked", async () => {
		/* deve abrir e fechar a caixa de diálogo quando o botão for clicado */
		render(<AddTask projectId={mockProjectId} />);
		const openButton = screen.getByRole("button", { name: /Adicionar/i });

		// Abre o modal
		fireEvent.click(openButton);
		expect(screen.getByRole("dialog")).toBeInTheDocument();

		// Fecha o modal clicando no botão de fechar (implícito no shadcn) ou no overlay
		const closeButton = screen.getByRole("button", { name: "Close" });
		fireEvent.click(closeButton);
		await waitFor(() =>
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
		);
	});

	it("should successfully submit the form, show a success toast, and close the dialog", async () => {
		/* deve enviar o formulário com sucesso, mostrar um brinde de sucesso e fechar a caixa de diálogo */
		render(<AddTask projectId={mockProjectId} />);
		fireEvent.click(screen.getByRole("button", { name: /Adicionar/i }));

		const titleInput = screen.getByLabelText(/Título/i);
		const descriptionTextarea = screen.getByLabelText(/Descrição/i);
		const statusSelect = screen.getByLabelText(/Status da Tarefa/i);

		await act(async () => {
			fireEvent.change(titleInput, {
				target: { value: "Nova Tarefa de Teste" },
			});
			fireEvent.change(descriptionTextarea, {
				target: { value: "Essa é a descrição da nova tarefa." },
			});
			fireEvent.click(statusSelect);
		});

		const inProgressOption = await screen.findByRole("option", {
			name: "Em Andamento",
		});
		await act(async () => {
			fireEvent.click(inProgressOption);
		});

		expect(screen.getByLabelText(/Status da Tarefa/i)).toHaveTextContent(
			"Em Andamento",
		);

		const submitButton = screen.getByRole("button", {
			name: /Adicionar Tarefa/i,
		});

		await act(async () => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(addTaskAction).toHaveBeenCalledWith({
				title: "Nova Tarefa de Teste",
				description: "Essa é a descrição da nova tarefa.",
				projectId: mockProjectId,
				status: "IN_PROGRESS",
			});

			expect(toast.success).toHaveBeenCalledWith(
				"Tarefa cadastrada com sucesso!",
				expect.any(Object),
			);
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});
	});

	it("should show validation errors when submitting an empty form", async () => {
		/* deve mostrar erros de validação ao enviar um formulário vazio */
		render(<AddTask projectId={mockProjectId} />);

		// Abre o modal
		fireEvent.click(screen.getByRole("button", { name: /Adicionar/i }));
		const submitButton = screen.getByRole("button", {
			name: /Adicionar Tarefa/i,
		});

		// Tenta enviar o formulário vazio
		await act(async () => {
			fireEvent.click(submitButton);
		});

		// Verifica se os erros de validação do React Hook Form são exibidos
		await waitFor(() => {
			expect(screen.getByText(/O título é obrigatório/i)).toBeInTheDocument();
			expect(
				screen.getByText(/A descrição é obrigatória/i),
			).toBeInTheDocument();

			// Verifica que a Server Action NÃO foi chamada
			expect(mockAddTaskAction).not.toHaveBeenCalled();
		});
	});

	it("should show an error toast if the submission fails", async () => {
		/* deve mostrar um erro de notificação se o envio falhar */
		// Mock da Server Action para retornar falha
		const errorMessage =
			"Não foi possível adicionar a tarefa. Tente novamente.";
		mockAddTaskAction.mockResolvedValue({
			success: false,
			message: errorMessage,
			errors: { general: "Erro interno do servidor." },
		});

		render(<AddTask projectId={mockProjectId} />);

		// Abre o modal e preenche os campos
		fireEvent.click(screen.getByRole("button", { name: /Adicionar/i }));
		const titleInput = screen.getByLabelText(/Título/i);
		await act(async () => {
			fireEvent.change(titleInput, { target: { value: "Tarefa com Falha" } });
			fireEvent.change(screen.getByLabelText(/Descrição/i), {
				target: { value: "Essa tarefa deve falhar." },
			});
		});

		// Envia o formulário
		const submitButton = screen.getByRole("button", {
			name: /Adicionar Tarefa/i,
		});
		await act(async () => {
			fireEvent.click(submitButton);
		});

		// Verifica se a Server Action foi chamada e o toast de erro foi exibido
		await waitFor(() => {
			expect(mockAddTaskAction).toHaveBeenCalledWith({
				title: "Tarefa com Falha",
				description: "Essa tarefa deve falhar.",
				projectId: mockProjectId,
				status: "PENDING",
			});
			expect(toast.error).toHaveBeenCalledWith(
				errorMessage,
				expect.any(Object),
			);

			// Verifica se o modal ainda está aberto após a falha
			expect(screen.getByRole("dialog")).toBeInTheDocument();
		});
	});
});
