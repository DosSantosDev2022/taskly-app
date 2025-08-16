import "@testing-library/jest-dom/vitest";
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { addCommentAction } from "@/actions/comment";
import { AddComment } from "@/components/pages/project";
import { toast } from "react-toastify";

// Mock das dependências externas
vi.mock("@/actions/comment", () => ({
	addComment: vi.fn(),
}));

vi.mock("react-toastify", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

// Mock do `useTransition` de forma mais direta e robusta para controlar o isPending
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

describe("AddComment", () => {
	// Description: Tests the functionality of the AddComment component, including modal interactions, form submission, and state handling.
	// Descrição: Testa a funcionalidade do componente AddComment, incluindo interações do modal, submissão do formulário e manipulação de estado.

	const mockProjectId = "project-123";
	const mockOnCommentAdded = vi.fn();
	const mockAddComment = vi.mocked(addCommentAction);

	beforeEach(() => {
		vi.clearAllMocks();
		// Configura o mock padrão para o useTransition antes de cada teste
		// O mock padrão é com isPending = false
		mockUseTransition.mockReturnValue([false, mockStartTransition]);
	});

	// --- Renderização Inicial e Modal ---
	it("should render the trigger button and open the dialog", () => {
		// Description: Verifies that the initial button is rendered and that clicking it opens the comment dialog.
		// Descrição: Verifica se o botão inicial é renderizado e se clicar nele abre o modal de comentário.
		render(<AddComment projectId={mockProjectId} />);

		const openButton = screen.getByRole("button", {
			name: /Adicionar Comentário/i,
		});
		expect(openButton).toBeInTheDocument();

		fireEvent.click(openButton);
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: /Novo Comentário/i }),
		).toBeInTheDocument();
	});

	// --- Submissão Bem-sucedida ---
	it("should successfully submit the comment and close the dialog", async () => {
		// Description: Simulates a successful comment submission, checking if the server action is called, success toast is shown, and the modal is closed.
		// Descrição: Simula uma submissão de comentário bem-sucedida, verificando se a server action é chamada, o toast de sucesso é exibido e o modal é fechado.
		mockAddComment.mockResolvedValue({
			success: true,
			message: "Comment added.",
		});

		render(
			<AddComment
				projectId={mockProjectId}
				onCommentAdded={mockOnCommentAdded}
			/>,
		);

		// Abre o modal
		fireEvent.click(
			screen.getByRole("button", { name: /Adicionar Comentário/i }),
		);

		// Preenche o campo de texto
		const commentInput = screen.getByLabelText(/Conteúdo do comentário/i);
		fireEvent.change(commentInput, {
			target: { value: "Este é um teste de comentário." },
		});

		const submitButton = screen.getByRole("button", {
			name: /Adicionar Comentário/i,
		});

		await act(async () => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			// Verifica se a server action foi chamada com os dados corretos
			expect(mockAddComment).toHaveBeenCalledWith(expect.any(FormData));
			const formData = mockAddComment.mock.calls[0][0] as FormData;
			expect(formData.get("content")).toBe("Este é um teste de comentário.");
			expect(formData.get("projectId")).toBe(mockProjectId);

			// Verifica o fluxo de sucesso
			expect(toast.success).toHaveBeenCalledWith(
				"Comentário adicionado com sucesso!",
				expect.any(Object),
			);
			expect(mockOnCommentAdded).toHaveBeenCalled();
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});
	});

	// --- Validação de Entrada ---
	it("should show an error toast if comment content is empty", async () => {
		// Description: Tests the client-side validation, ensuring an error toast is displayed and the server action is not called for an empty comment.
		// Descrição: Testa a validação no lado do cliente, garantindo que um toast de erro seja exibido e a server action não seja chamada para um comentário vazio.
		render(<AddComment projectId={mockProjectId} />);

		// Abre o modal
		fireEvent.click(
			screen.getByRole("button", { name: /Adicionar Comentário/i }),
		);

		const submitButton = screen.getByRole("button", {
			name: /Adicionar Comentário/i,
		});

		await act(async () => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(
				"O comentário não pode ser vazio.",
				expect.any(Object),
			);
			expect(mockAddComment).not.toHaveBeenCalled();
			// O modal deve permanecer aberto
			expect(screen.getByRole("dialog")).toBeInTheDocument();
		});
	});

	// --- Tratamento de Erro da Server Action ---
	it("should show an error toast if the server action fails", async () => {
		// Description: Simulates a failed server action and checks if an error toast is displayed and the modal remains open.
		// Descrição: Simula uma falha na server action e verifica se um toast de erro é exibido e o modal permanece aberto.
		mockAddComment.mockResolvedValue({
			success: false,
			message: "Erro de teste de servidor.",
		});

		render(<AddComment projectId={mockProjectId} />);

		// Abre o modal
		fireEvent.click(
			screen.getByRole("button", { name: /Adicionar Comentário/i }),
		);

		// Preenche o campo de texto
		const commentInput = screen.getByLabelText(/Conteúdo do comentário/i);
		fireEvent.change(commentInput, { target: { value: "Teste de erro." } });

		const submitButton = screen.getByRole("button", {
			name: /Adicionar Comentário/i,
		});

		await act(async () => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(mockAddComment).toHaveBeenCalled();
			expect(toast.error).toHaveBeenCalledWith(
				"Erro de teste de servidor.",
				expect.any(Object),
			);
			// O modal deve permanecer aberto
			expect(screen.getByRole("dialog")).toBeInTheDocument();
		});
	});
	// --- Estado de Carregamento (isPending) ---
	/*  it("should disable the textarea and button while isPending is true", async () => {
		 // Description: Verifies that the input field and submit button are disabled when the form submission is pending.
		 // Descrição: Verifica se o campo de texto e o botão de envio são desabilitados enquanto o formulário está em estado de envio.
 
		 // Configura o mock do useTransition para simular o estado de "pending"
		 // No click, isPending deve ser true, e a ação deve ser 'pendente'.
		 mockUseTransition.mockReturnValueOnce([true, mockStartTransition]);
 
		 render(<AddComment projectId={mockProjectId} />);
 
		 // Abre o modal para que o formulário seja renderizado
		 fireEvent.click(screen.getByRole("button", { name: /Adicionar Comentário/i }));
 
		 // Mock o startTransition para que ele não execute a função, mantendo o estado de isPending
		 mockUseTransition.mockImplementation(() => [true, vi.fn()]);
 
		 await act(async () => {
			 fireEvent.click(screen.getByRole("button", { name: /Adicionar Comentário/i }));
		 });
 
		 // A renderização é instantânea, então as verificações podem ser síncronas
		 const commentInput = screen.getByLabelText(/Conteúdo do comentário/i);
		 const submitButton = screen.getByRole("button", { name: /Adicionando.../i });
 
		 expect(commentInput).toBeDisabled();
		 expect(submitButton).toBeDisabled();
	 }); */
});
