// src/components/pages/project/edit-comment-form.test.tsx

import { editCommentAction } from "@/actions/comment";
import { EditCommentForm } from "@/components/pages/project";
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
// Mock da Server Action `editComment`
vi.mock("@/actions/comment", () => ({
	editComment: vi.fn(),
}));

// Mock do `useTransition`
const mockStartTransition = vi.fn();
vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>();
	return {
		...actual,
		useTransition: () => [false, mockStartTransition],
	};
});

// Mock do `react-toastify`
vi.mock("react-toastify", () => ({
	...vi.importActual("react-toastify"),
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
	Bounce: vi.fn(), // Essencial para evitar o erro de `No "Bounce" export`
}));

// Mock dos callbacks
const mockOnClose = vi.fn();
const mockOnCommentEdited = vi.fn();

// Dados de mock para o comentário
const mockComment = {
	projectId: "project-x",
	id: "comment-1",
	content: "Conteúdo original do comentário",
	userId: "user-1",
	taskId: "task-1",
	createdAt: new Date(),
	updatedAt: new Date(),
};

// --- Suite de Testes ---
describe("EditCommentForm", () => {
	beforeEach(() => {
		// Limpa os mocks antes de cada teste
		vi.clearAllMocks();
		// Garante que a transição assíncrona seja executada imediatamente
		mockStartTransition.mockImplementation((fn) => fn());
	});

	it("should render the dialog with the correct content when open", () => {
		/* deve renderizar o diálogo com o conteúdo correto quando aberto */
		render(
			<EditCommentForm
				comment={mockComment}
				isOpen={true}
				onClose={mockOnClose}
				onCommentEdited={mockOnCommentEdited}
			/>,
		);

		expect(
			screen.getByRole("dialog", { name: /Editar Comentário/i }),
		).toBeInTheDocument();

		const textarea = screen.getByLabelText(/Conteúdo/i);
		expect(textarea).toHaveValue("Conteúdo original do comentário");

		expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Salvar alterações no comentário" }),
		).toBeInTheDocument();
	});

	it("should call onClose when the Cancel button is clicked", async () => {
		/* deve chamar onClose quando o botão Cancelar for clicado */
		render(
			<EditCommentForm
				comment={mockComment}
				isOpen={true}
				onClose={mockOnClose}
				onCommentEdited={mockOnCommentEdited}
			/>,
		);

		const cancelButton = screen.getByRole("button", { name: /Cancelar/i });
		fireEvent.click(cancelButton);

		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it("should successfully submit the form, show a success toast, and call callbacks", async () => {
		/* deve enviar o formulário com sucesso, mostrar um brinde de sucesso e chamar retornos de chamada */
		// Mock da Server Action para sucesso
		vi.mocked(editCommentAction).mockResolvedValue({
			success: true,
			message: "Comentário editado com sucesso!",
		});

		render(
			<EditCommentForm
				comment={mockComment}
				isOpen={true}
				onClose={mockOnClose}
				onCommentEdited={mockOnCommentEdited}
			/>,
		);

		const textarea = screen.getByLabelText(/Conteúdo/i);
		const submitButton = screen.getByRole("button", {
			name: /Salvar alterações/i,
		});

		const newContent = "Novo conteúdo do comentário";
		await act(async () => {
			fireEvent.change(textarea, { target: { value: newContent } });
		});

		await act(async () => {
			fireEvent.click(submitButton);
		});

		// Espera as ações assíncronas
		await waitFor(() => {
			// Verifica se a Server Action foi chamada com os dados corretos
			expect(editCommentAction).toHaveBeenCalledWith(
				mockComment.id,
				newContent,
			);
			// Verifica se o toast de sucesso foi exibido
			expect(toast.success).toHaveBeenCalledWith(
				"Comentário editado com sucesso!",
				expect.any(Object),
			);
			// Verifica se o callback de edição foi chamado com o novo conteúdo
			expect(mockOnCommentEdited).toHaveBeenCalledWith({ content: newContent });
			// Verifica se o callback de fechar foi chamado
			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});
	});

	it("should show an error toast if the submission fails", async () => {
		/* deve mostrar um erro de notificação se o envio falhar */
		// Mock da Server Action para falha
		const errorMessage = "Erro ao editar comentário";
		vi.mocked(editCommentAction).mockResolvedValue({
			success: false,
			errors: {},
			message: errorMessage,
		});

		render(
			<EditCommentForm
				comment={mockComment}
				isOpen={true}
				onClose={mockOnClose}
				onCommentEdited={mockOnCommentEdited}
			/>,
		);

		const textarea = screen.getByLabelText(/Conteúdo/i);
		const submitButton = screen.getByRole("button", {
			name: /Salvar alterações/i,
		});

		const newContent = "Conteúdo que vai falhar";
		await act(async () => {
			fireEvent.change(textarea, { target: { value: newContent } });
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			// Verifica se a Server Action foi chamada
			expect(editCommentAction).toHaveBeenCalledWith(
				mockComment.id,
				newContent,
			);
			// Verifica se o toast de erro foi exibido
			expect(toast.error).toHaveBeenCalledWith(
				errorMessage,
				expect.any(Object),
			);
			// Verifica se o callback de edição NÃO foi chamado
			expect(mockOnCommentEdited).not.toHaveBeenCalled();
			// Verifica se o modal NÃO foi fechado
			expect(mockOnClose).not.toHaveBeenCalled();
		});
	});

	it("should show validation errors when submitting an invalid form", async () => {
		/* deve mostrar erros de validação ao enviar um formulário inválido */
		render(
			<EditCommentForm
				comment={mockComment}
				isOpen={true}
				onClose={mockOnClose}
				onCommentEdited={mockOnCommentEdited}
			/>,
		);

		const textarea = screen.getByLabelText(/Conteúdo/i);
		const submitButton = screen.getByRole("button", {
			name: /Salvar alterações/i,
		});

		// Preenche com um valor inválido (vazio)
		await act(async () => {
			fireEvent.change(textarea, { target: { value: "" } });
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			// Verifica se a mensagem de erro de validação é exibida
			expect(
				screen.getByText(/O comentário deve ter no mínimo 10 caracteres./i),
			).toBeInTheDocument();
			// Verifica se a Server Action NÃO foi chamada
			expect(editCommentAction).not.toHaveBeenCalled();
		});
	});
});
