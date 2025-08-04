import { updateClient } from "@/actions/client";
import { Client } from "@prisma/client";
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
import { EditClientForm } from "./edit-client-form";

// Mock das dependências externas
vi.mock("@/actions/client", () => ({
	updateClient: vi.fn(),
}));

vi.mock("react-toastify", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
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

describe("EditClientForm", () => {
	// Description: Tests the functionality of the EditClientForm component, including data initialization, form submission, and server action handling.
	// Descrição: Testa a funcionalidade do componente EditClientForm, incluindo inicialização de dados, submissão do formulário e manipulação de ações do servidor.

	const mockClient: Client = {
		userId: "afafafafafafafafaf",
		id: "1",
		name: "John Doe",
		email: "john.doe@example.com",
		phone: "11999999999",
		createdAt: new Date(),
		updatedAt: new Date(),
		status: "ACTIVE",
	};

	const mockOnClose = vi.fn();
	const mockUpdateClient = vi.mocked(updateClient);

	beforeEach(() => {
		vi.clearAllMocks();
		mockUseTransition.mockReturnValue([false, mockStartTransition]);
	});

	it("should render the form with the client's data when open", () => {
		// Description: Verifies that the form fields are pre-filled with the data of the client being edited when the modal is open.
		// Descrição: Verifica se os campos do formulário são preenchidos com os dados do cliente sendo editado quando o modal está aberto.
		render(
			<EditClientForm
				isOpen={true}
				onClose={mockOnClose}
				client={mockClient}
			/>,
		);

		expect(screen.getByLabelText(/Nome/i)).toHaveValue(mockClient.name);
		expect(screen.getByLabelText(/Email/i)).toHaveValue(mockClient.email);
		expect(screen.getByLabelText(/Telefone/i)).toHaveValue(mockClient.phone);
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	it("should call the onClose function when the cancel button is clicked", () => {
		// Description: Tests the cancellation flow, ensuring the modal's onClose callback is triggered when the "Cancelar" button is clicked.
		// Descrição: Testa o fluxo de cancelamento, garantindo que o callback onClose do modal seja acionado quando o botão "Cancelar" é clicado.
		render(
			<EditClientForm
				isOpen={true}
				onClose={mockOnClose}
				client={mockClient}
			/>,
		);
		const cancelButton = screen.getByRole("button", { name: /Cancelar/i });

		fireEvent.click(cancelButton);
		expect(mockOnClose).toHaveBeenCalled();
	});

	it("should successfully submit the form and close the modal on success", async () => {
		// Description: Simulates a successful form submission, verifying that the server action is called, a success toast is shown, and the modal closes.
		// Descrição: Simula uma submissão de formulário bem-sucedida, verificando que o server action é chamado, um toast de sucesso é exibido e o modal fecha.
		mockUpdateClient.mockResolvedValue({
			success: true,
			message: "Client updated successfully!",
		});

		render(
			<EditClientForm
				isOpen={true}
				onClose={mockOnClose}
				client={mockClient}
			/>,
		);

		const submitButton = screen.getByRole("button", {
			name: /Salvar Alterações/i,
		});

		// Simula a submissão do formulário
		await act(async () => {
			fireEvent.click(submitButton);
		});

		// Espera que a Server Action seja chamada
		await waitFor(() => {
			expect(mockUpdateClient).toHaveBeenCalled();
			const formData = mockUpdateClient.mock.calls[0][0] as FormData;
			expect(formData.get("id")).toBe(mockClient.id);
			expect(formData.get("name")).toBe(mockClient.name);
			expect(formData.get("email")).toBe(mockClient.email);
		});

		// Espera que o toast e o onClose sejam chamados
		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(
				"Cliente atualizado com sucesso!",
				expect.any(Object),
			);
			expect(mockOnClose).toHaveBeenCalled();
		});
	});

	it("should display server-side validation errors and not close the modal on failure", async () => {
		// Description: Simulates a failed server action, checking if specific field errors and a general error toast are displayed, while the modal remains open.
		// Descrição: Simula uma falha no server action, verificando se erros de campo específicos e um toast de erro geral são exibidos, e o modal permanece aberto.
		mockUpdateClient.mockResolvedValue({
			success: false,
			message: "Erro ao atualizar cliente.",
			errors: {
				email: "Já existe um cliente com este email.",
			},
		});

		render(
			<EditClientForm
				isOpen={true}
				onClose={mockOnClose}
				client={mockClient}
			/>,
		);
		const submitButton = screen.getByRole("button", {
			name: /Salvar Alterações/i,
		});

		await act(async () => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(mockUpdateClient).toHaveBeenCalled();
			expect(toast.error).toHaveBeenCalledWith(
				"Erro ao atualizar cliente.",
				expect.any(Object),
			);
			expect(
				screen.getByText("Já existe um cliente com este email."),
			).toBeInTheDocument();
			expect(mockOnClose).not.toHaveBeenCalled(); // O modal não deve ser fechado
		});
	});

	it("should show client-side validation errors for invalid data", async () => {
		// Description: Tests client-side validation, ensuring error messages appear when a user tries to submit a form with invalid data.
		// Descrição: Testa a validação no lado do cliente, garantindo que mensagens de erro aparecem quando o usuário tenta submeter o formulário com dados inválidos.
		const invalidClient = { ...mockClient, email: "invalid-email" };
		render(
			<EditClientForm
				isOpen={true}
				onClose={mockOnClose}
				client={invalidClient}
			/>,
		);

		const emailInput = screen.getByLabelText(/Email/i);
		const submitButton = screen.getByRole("button", {
			name: /Salvar Alterações/i,
		});

		// Simula a digitação de um e-mail inválido
		fireEvent.change(emailInput, { target: { value: "invalid-email" } });
		// Simula a perda de foco para acionar a validação onBlur
		fireEvent.blur(emailInput);

		await waitFor(() => {
			expect(
				screen.getByText("Por favor, insira um endereço de e-mail válido."),
			).toBeInTheDocument();
		});

		// Clica no botão de submissão para garantir que a validação não está sendo ignorada
		await act(async () => {
			fireEvent.click(submitButton);
		});

		// A validação do formulário deve ser ativada e impedir a submissão
		await waitFor(() => {
			expect(mockUpdateClient).not.toHaveBeenCalled();
			expect(mockOnClose).not.toHaveBeenCalled();
		});
	});

	/*  it("should disable inputs and buttons while isPending is true", () => {
     // Description: Verifies that form inputs and buttons are disabled during a pending server action, preventing multiple submissions.
     // Descrição: Verifica se os inputs e botões do formulário são desabilitados durante uma ação pendente do servidor, prevenindo múltiplas submissões.
     // Mock do useTransition para simular o estado de "pending"
     mockUseTransition.mockReturnValueOnce([true, vi.fn()]);
 
     render(<EditClientForm isOpen={true} onClose={mockOnClose} client={mockClient} />);
 
     expect(screen.getByLabelText(/Nome/i)).toBeDisabled();
     expect(screen.getByLabelText(/Email/i)).toBeDisabled();
     expect(screen.getByLabelText(/Telefone/i)).toBeDisabled();
     expect(screen.getByRole("button", { name: /Cancelar/i })).toBeDisabled();
     expect(screen.getByRole("button", { name: /Salvando.../i })).toBeDisabled();
   }); */
});
