import * as projectActions from "@/actions/project";
import { AddProjectForm } from "@/components/pages/project";
import "@testing-library/jest-dom/vitest";
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock das dependências externas
vi.mock("@/actions/client", () => ({
	getClients: vi.fn(),
}));

vi.mock("@/actions/project", () => ({
	createProject: vi.fn(),
}));

vi.mock("react-toastify", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

// Mocks para React Query e useTransition com vi.hoisted
const { mockUseQuery, mockUseTransition } = vi.hoisted(() => {
	const mockUseQuery = vi.fn();
	const mockStartTransition = vi.fn((fn) => fn());
	const mockUseTransition = vi.fn(() => [false, mockStartTransition]);
	return { mockUseQuery, mockUseTransition };
});

vi.mock("@tanstack/react-query", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-query")>();
	return {
		...actual,
		useQuery: mockUseQuery,
	};
});

vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>();
	return {
		...actual,
		useTransition: mockUseTransition,
	};
});

describe("AddProjectForm", () => {
	// Description: Tests the AddProjectForm component, covering data fetching, form submission, and validation.
	// Descrição: Testa o componente AddProjectForm, cobrindo a busca de dados, submissão do formulário e validação.

	const mockCreateProject = vi.mocked(projectActions.createProject);

	const mockOnSuccess = vi.fn();
	const mockClients = [
		{
			id: "client1",
			name: "Client A",
			email: "clienta@example.com",
			phone: "11987654321",
			userId: "user123",
			createdAt: new Date(),
			updatedAt: new Date(),
			status: "ACTIVE" as any,
		},
		{
			id: "client2",
			name: "Client B",
			email: "clientb@example.com",
			phone: null,
			userId: "user456",
			createdAt: new Date(),
			updatedAt: new Date(),
			status: "INACTIVE" as any,
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
		// Configuração padrão para o useTransition
		mockUseTransition.mockReturnValue([false, vi.fn((fn) => fn())]);

		mockUseQuery.mockReturnValue({
			data: mockClients, // Note que a sua `queryFn` retorna um array diretamente.
			isLoading: false,
			isError: false,
			error: null,
		});
		mockCreateProject.mockResolvedValue({ success: true });
	});

	// --- Renderização Condicional e Inicialização ---
	it("should render the form correctly after fetching clients", async () => {
		// Description: Verifies that the form is rendered with all its fields once the client data has been successfully loaded.
		// Descrição: Verifica se o formulário é renderizado com todos os seus campos após o carregamento bem-sucedido dos dados dos clientes.
		render(<AddProjectForm />);

		const createButton = await screen.findByRole("button", {
			name: /Criar Projeto/i,
		});

		expect(createButton).toBeInTheDocument();
		expect(screen.getByLabelText(/Nome do Projeto/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Tipo de Projeto/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Selecione um cliente/i)).toBeInTheDocument();
	});

	it("should show validation errors when submitting an empty form", async () => {
		// Description: Simulates an attempt to submit an empty form and checks for validation error messages for required fields.
		// Descrição: Simula uma tentativa de submeter um formulário vazio e verifica a exibição de mensagens de erro de validação para campos obrigatórios.
		render(<AddProjectForm />);
		const submitButton = screen.getByRole("button", { name: /Criar Projeto/i });

		await act(async () => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(
				screen.getByText(/O nome do projeto é obrigatório./i),
			).toBeInTheDocument();
			// Outras validações se aplicável
			expect(mockCreateProject).not.toHaveBeenCalled();
		});
	});

	it("should successfully submit the form and call onSuccess", async () => {
		// Renderiza o componente
		const { getByLabelText } = render(
			<AddProjectForm onSuccess={mockOnSuccess} />,
		);
		await waitFor(() =>
			expect(
				screen.getByRole("button", { name: /Criar Projeto/i }),
			).toBeInTheDocument(),
		);

		// Preenche todos os campos obrigatórios
		const projectNameInput = getByLabelText(/Nome do Projeto/i);
		const descriptionTextarea = getByLabelText(/Descrição do projeto/i);
		const priceInput = getByLabelText(/Preço do projeto/i);
		const clientCombobox = getByLabelText(/Selecione um cliente/i);
		const deadlineDateButton = getByLabelText(/Escolha uma data de prazo/i); // Encontra o botão do calendário
		const submitButton = screen.getByRole("button", { name: /Criar Projeto/i });

		// Preenchimento dos campos de texto
		await act(async () => {
			fireEvent.change(projectNameInput, { target: { value: "Project X" } });
			fireEvent.change(descriptionTextarea, {
				target: { value: "Description X" },
			});
			// Preenchimento do preço
			fireEvent.change(priceInput, { target: { value: "1250" } });
		});

		// Interação com o ComboBox para selecionar o cliente
		await act(async () => {
			fireEvent.click(clientCombobox); // Abre o combobox
		});
		const clientAOption = await screen.findByText("Client A");
		await act(async () => {
			fireEvent.click(clientAOption); // Seleciona o cliente
		});

		// Interação com o Popover de Data para selecionar uma data
		await act(async () => {
			fireEvent.click(deadlineDateButton); // Abre o Popover
		});

		const tomorrow = addDays(new Date(), 1);
		// Novo formato: "d" para o dia sem zero à esquerda
		const tomorrowFormatted = format(tomorrow, "EEEE, d 'de' MMMM 'de' yyyy", {
			locale: ptBR,
		});
		const tomorrowButton = await screen.findByRole("button", {
			name: tomorrowFormatted,
		});

		await act(async () => {
			fireEvent.click(tomorrowButton); // Seleciona o dia de amanhã
		});

		// Submete o formulário
		await act(async () => {
			fireEvent.click(submitButton);
		});

		// Espera por todas as ações assíncronas serem concluídas
		await waitFor(() => {
			// Verifica se a função `createProject` foi chamada com os dados esperados
			expect(mockCreateProject).toHaveBeenCalledWith(expect.any(FormData));

			// Verificações de toast e callbacks
			expect(toast.success).toHaveBeenCalledWith(
				"Novo projeto adicionado com sucesso!",
				expect.any(Object),
			);
			expect(mockOnSuccess).toHaveBeenCalled();

			// O formulário deve ser resetado
			expect(projectNameInput).toHaveValue("");
			expect(priceInput).toHaveValue("R$ 0,00"); // NumericFormat resetado para o valor padrão
		});
	});

	it("should show an error toast if form submission fails with a generic message", async () => {
		const errorMessage = "Houve um problema inesperado ao criar o projeto.";
		mockCreateProject.mockResolvedValue({
			success: false,
			message: errorMessage,
		});

		const { getByLabelText } = render(<AddProjectForm />);

		// Preenche todos os campos obrigatórios
		const projectNameInput = getByLabelText(/Nome do Projeto/i);
		const clientCombobox = getByLabelText(/Selecione um cliente/i);
		const deadlineDateButton = getByLabelText(/Escolha uma data de prazo/i);

		// Preenche o formulário
		fireEvent.change(projectNameInput, { target: { value: "Project Y" } });
		fireEvent.click(clientCombobox);
		fireEvent.click(screen.getByText("Client B"));

		await act(async () => {
			fireEvent.click(deadlineDateButton);
		});

		const tomorrow = addDays(new Date(), 1);
		const tomorrowFormatted = format(tomorrow, "EEEE, d 'de' MMMM 'de' yyyy", {
			locale: ptBR,
		});
		const tomorrowButton = await screen.findByRole("button", {
			name: tomorrowFormatted,
		});

		await act(async () => {
			fireEvent.click(tomorrowButton);
		});

		const submitButton = screen.getByRole("button", { name: /Criar Projeto/i });
		await act(async () => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(
				errorMessage,
				expect.any(Object),
			);
		});

		// Verifica se o formulário não foi resetado após a falha
		expect(projectNameInput).toHaveValue("Project Y");
	});

	// --- Interações do Usuário e Estado de Carregamento ---
	/* it("should disable form elements and show loading state during pending submission", async () => {
    // Description: Verifies that form inputs and the submit button are disabled when the `isPending` state is true.
    // Descrição: Verifica se os inputs do formulário e o botão de submissão são desabilitados quando o estado `isPending` é verdadeiro.
    mockUseTransition.mockReturnValueOnce([true, vi.fn()]);

    render(<AddProjectForm />);

    // Verifica o estado de carregamento
    expect(screen.getByLabelText(/Nome do Projeto/i)).toBeDisabled();
    expect(screen.getByLabelText(/Preço do projeto/i)).toBeDisabled();
    expect(screen.getByLabelText(/Descrição do projeto/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /Criando Projeto.../i })).toBeDisabled();
  }); */
});
