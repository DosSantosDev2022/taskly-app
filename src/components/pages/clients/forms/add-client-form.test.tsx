import { createClient } from "@/actions/client";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { AddClientForm } from "./add-client-form";

// Mock the external dependencies
vi.mock("@/actions/client", () => ({
	createClient: vi.fn(),
}));

vi.mock("react-toastify", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(() => ({
		refresh: vi.fn(),
	})),
}));

// Mock the useTransition hook to immediately execute the callback
const mockStartTransition = vi.fn((fn) => fn());
vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>();
	return {
		...actual,
		useTransition: () => [false, mockStartTransition],
	};
});

describe("AddClientForm", () => {
	// Description: Tests the functionality of the AddClientForm component, including modal behavior, form submission, and validation.
	// Descrição: Testa a funcionalidade do componente AddClientForm, incluindo o comportamento do modal, submissão do formulário e validação.

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should open and close the modal correctly", async () => {
		// Description: Verifies that the modal is initially closed and opens when the "Add Client" button is clicked, then closes when the close button is pressed.
		// Descrição: Verifica se o modal está inicialmente fechado e se abre quando o botão "Adicionar Cliente" é clicado, e então fecha quando o botão de fechar é pressionado.

		render(<AddClientForm />);
		const addButton = screen.getByRole("button", {
			name: /adicionar cliente/i,
		});

		// 1. Initially, the modal content should not be in the document
		// 1. Inicialmente, o conteúdo do modal não deve estar no documento
		expect(
			screen.queryByRole("heading", { name: /Adicionar Novo Cliente/i }),
		).not.toBeInTheDocument();

		// 2. Click the button to open the modal
		// 2. Clica no botão para abrir o modal
		fireEvent.click(addButton);

		// 3. Wait for the modal title to appear
		// 3. Espera o título do modal aparecer
		const modalTitle = await screen.findByRole("heading", {
			name: /Adicionar Novo Cliente/i,
		});
		expect(modalTitle).toBeInTheDocument();

		// 4. Find the close button (it's often an icon-only button without a visible name)
		// 4. Encontra o botão de fechar (geralmente é um botão apenas com ícone, sem nome visível)
		const closeButton = screen.getByRole("button", { name: "Close" });

		// 5. Click the close button
		// 5. Clica no botão de fechar
		fireEvent.click(closeButton);

		// 6. Wait for the modal title to disappear from the document
		// 6. Espera o título do modal desaparecer do documento
		await waitFor(() => {
			expect(
				screen.queryByRole("heading", { name: /Adicionar Novo Cliente/i }),
			).not.toBeInTheDocument();
		});
	});

	it("should display client-side validation errors for empty required fields", async () => {
		// Description: Tests the client-side validation, ensuring that error messages appear for empty 'name' and 'email' fields.
		// Descrição: Testa a validação no lado do cliente, garantindo que mensagens de erro aparecem para os campos 'nome' e 'email' vazios.

		render(<AddClientForm />);
		const addButton = screen.getByRole("button", {
			name: /adicionar cliente/i,
		});
		fireEvent.click(addButton);

		const submitButton = screen.getByRole("button", {
			name: /salvar cliente/i,
		});
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText("O nome do cliente é obrigatório."),
			).toBeInTheDocument();
			expect(
				screen.getByText("Por favor, insira um endereço de e-mail válido."),
			).toBeInTheDocument();
		});
	});

	it("should successfully submit the form and close the modal on success", async () => {
		// Description: Tests the successful form submission flow, verifying that the server action is called, a success toast is shown, and the modal closes.
		// Descrição: Testa o fluxo de submissão do formulário com sucesso, verificando se o server action é chamado, um toast de sucesso é exibido e o modal é fechado.

		const mockCreateClient = vi.fn().mockResolvedValue({
			success: true,
			message: "Client added successfully!",
		});
		(createClient as Mock).mockImplementation(mockCreateClient);

		render(<AddClientForm />);
		fireEvent.click(screen.getByRole("button", { name: /adicionar cliente/i }));

		const nameInput = screen.getByLabelText(/nome/i);
		const emailInput = screen.getByLabelText(/email/i);
		const phoneInput = screen.getByLabelText(/telefone/i);
		const submitButton = screen.getByRole("button", {
			name: /salvar cliente/i,
		});

		fireEvent.change(nameInput, { target: { value: "John Doe" } });
		fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
		fireEvent.change(phoneInput, { target: { value: "11999999999" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockCreateClient).toHaveBeenCalled();
		});

		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(
				"Cliente adicionado com sucesso!",
				expect.any(Object),
			);
			expect(
				screen.queryByRole("heading", { name: /adicionar novo cliente/i }),
			).not.toBeInTheDocument();
		});
	});

	it("should display server-side validation errors and not close the modal on failure", async () => {
		// Description: Simulates a failed server action and checks if specific field errors and a general error toast are displayed, while the modal remains open.
		// Descrição: Simula uma falha no server action e verifica se erros de campo específicos e um toast de erro geral são exibidos, e o modal permanece aberto.

		const mockCreateClient = vi.fn().mockResolvedValue({
			success: false,
			message: "Erro ao adicionar cliente.",
			errors: {
				email: "Já existe um cliente com este email.",
			},
		});
		(createClient as Mock).mockImplementation(mockCreateClient);

		render(<AddClientForm />);
		fireEvent.click(screen.getByRole("button", { name: /adicionar cliente/i }));

		const nameInput = screen.getByLabelText(/nome/i);
		const emailInput = screen.getByLabelText(/email/i);
		const submitButton = screen.getByRole("button", {
			name: /salvar cliente/i,
		});

		fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
		fireEvent.change(emailInput, {
			target: { value: "jane.doe@existing.com" },
		});
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockCreateClient).toHaveBeenCalled();
		});

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(
				"Erro ao adicionar cliente.",
				expect.any(Object),
			);
			expect(
				screen.getByText("Já existe um cliente com este email."),
			).toBeInTheDocument();
			expect(
				screen.getByRole("heading", { name: /adicionar novo cliente/i }),
			).toBeInTheDocument(); // Modal should still be open
		});
	});
});
