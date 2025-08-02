import { updateClientStatus } from "@/actions/client";
import { StatusButtonClient } from "@/components/pages/clients/status-button-client";
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

// Mock das dependências externas
vi.mock("@/actions/client", () => ({
	updateClientStatus: vi.fn(),
}));

vi.mock("react-toastify", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

vi.mock("@/utils", () => ({
	formatClientStatus: vi.fn((status) =>
		status === "ACTIVE" ? "Ativo" : "Inativo",
	),
	getStatusClientStyles: vi.fn((status) =>
		status === "ACTIVE"
			? "bg-green-100 text-green-800"
			: "bg-red-100 text-red-800",
	),
}));

// Use vi.hoisted para criar e inicializar os mocks de hooks.
const { mockStartTransition, mockUseTransition } = vi.hoisted(() => {
	const mockStartTransition = vi.fn((fn) => fn());
	const mockUseTransition = vi.fn(() => [false, mockStartTransition]);
	return { mockStartTransition, mockUseTransition };
});

// Agora, o mock de "react" pode usar as variáveis já inicializadas.
vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>();
	return {
		...actual,
		useTransition: mockUseTransition,
	};
});

describe("StatusButtonClient", () => {
	// Description: Tests the functionality of the StatusButtonClient component, including rendering, status updates, and UI changes based on `isPending`.
	// Descrição: Testa a funcionalidade do componente StatusButtonClient, incluindo renderização, atualizações de status e mudanças na UI baseadas no `isPending`.

	const mockClientId = "client123";
	const mockUpdateClientStatus = vi.mocked(updateClientStatus);

	beforeEach(() => {
		vi.clearAllMocks();
		mockUseTransition.mockReturnValue([false, mockStartTransition]);
	});

	// --- Renderização Inicial ---
	it("should render correctly with the ACTIVE status", () => {
		// Description: Verifies that the component renders the correct formatted text and styles for a client with 'ACTIVE' status.
		// Descrição: Verifica se o componente renderiza o texto formatado e os estilos corretos para um cliente com status 'ACTIVE'.
		render(
			<StatusButtonClient clientId={mockClientId} currentStatus="ACTIVE" />,
		);

		expect(screen.getByText("Ativo")).toBeInTheDocument();
		expect(screen.getByText("Ativo")).toHaveClass(
			"bg-green-100 text-green-800",
		);
	});

	it("should render correctly with the INACTIVE status", () => {
		// Description: Verifies that the component renders the correct formatted text and styles for a client with 'INACTIVE' status.
		// Descrição: Verifica se o componente renderiza o texto formatado e os estilos corretos para um cliente com status 'INACTIVE'.
		render(
			<StatusButtonClient clientId={mockClientId} currentStatus="INACTIVE" />,
		);

		expect(screen.getByText("Inativo")).toBeInTheDocument();
		expect(screen.getByText("Inativo")).toHaveClass("bg-red-100 text-red-800");
	});

	// --- Interação e Ações ---
	it("should call updateClientStatus with 'INACTIVE' status when 'ACTIVE' button is clicked", async () => {
		// Description: Simulates a click on the 'ACTIVE' button and checks if the server action is called with the next status ('INACTIVE').
		// Descrição: Simula um clique no botão 'ACTIVE' e verifica se a server action é chamada com o próximo status ('INACTIVE').
		mockUpdateClientStatus.mockResolvedValue({
			success: true,
			message: "Status do cliente atualizado!",
		});

		render(
			<StatusButtonClient clientId={mockClientId} currentStatus="ACTIVE" />,
		);
		const button = screen.getByText("Ativo");

		await act(async () => {
			fireEvent.click(button);
		});

		await waitFor(() => {
			expect(mockUpdateClientStatus).toHaveBeenCalledWith({
				id: mockClientId,
				status: "INACTIVE",
			});
			expect(toast.success).toHaveBeenCalledWith(
				"Status do cliente atualizado!",
				expect.any(Object),
			);
		});
	});

	it("should call updateClientStatus with 'ACTIVE' status when 'INACTIVE' button is clicked", async () => {
		// Description: Simulates a click on the 'INACTIVE' button and checks if the server action is called with the next status ('ACTIVE').
		// Descrição: Simula um clique no botão 'INACTIVE' e verifica se a server action é chamada com o próximo status ('ACTIVE').
		mockUpdateClientStatus.mockResolvedValue({
			success: true,
			message: "Status do cliente atualizado!",
		});

		render(
			<StatusButtonClient clientId={mockClientId} currentStatus="INACTIVE" />,
		);
		const button = screen.getByText("Inativo");

		await act(async () => {
			fireEvent.click(button);
		});

		await waitFor(() => {
			expect(mockUpdateClientStatus).toHaveBeenCalledWith({
				id: mockClientId,
				status: "ACTIVE",
			});
			expect(toast.success).toHaveBeenCalledWith(
				"Status do cliente atualizado!",
				expect.any(Object),
			);
		});
	});

	// --- Estados de Carregamento e Erro ---
	it("should show loading state and disable the button while pending", () => {
		// Description: Checks if the component displays a loading indicator and becomes disabled when `isPending` is true.
		// Descrição: Verifica se o componente exibe um indicador de carregamento e é desabilitado quando `isPending` é verdadeiro.
		mockUseTransition.mockReturnValueOnce([true, mockStartTransition]);

		render(
			<StatusButtonClient clientId={mockClientId} currentStatus="ACTIVE" />,
		);

		const button = screen.getByText("...");
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass("opacity-70 cursor-not-allowed");
	});

	it("should show an error toast on failed status update", async () => {
		// Description: Simulates a failed status update from the server and verifies that an error toast is displayed.
		// Descrição: Simula uma falha na atualização de status do servidor e verifica se um toast de erro é exibido.
		mockUpdateClientStatus.mockResolvedValue({
			success: false,
			message: "Erro de teste.",
		});

		render(
			<StatusButtonClient clientId={mockClientId} currentStatus="ACTIVE" />,
		);
		const button = screen.getByText("Ativo");

		await act(async () => {
			fireEvent.click(button);
		});

		await waitFor(() => {
			expect(mockUpdateClientStatus).toHaveBeenCalled();
			expect(toast.error).toHaveBeenCalledWith(
				"Erro ao atualizar status do cliente.",
				expect.any(Object),
			);
		});
	});
});
