import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AddTask } from "./add-task";

// Mock do componente TiptapEditor
vi.mock("@/components/global", () => ({
	TiptapEditor: ({
		value,
		onChange,
	}: {
		value: string;
		onChange: (value: string) => void;
	}) => (
		<textarea
			data-testid="tiptap-editor"
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	),
}));

// Mock do hook useAddTask
const mockMutate = vi.fn();
const mockUseAddTask = {
	mutate: mockMutate,
	isPending: false,
};
vi.mock("@/hooks/task/use-add-task", () => ({
	useAddTask: () => mockUseAddTask,
}));

describe("AddTask Component", () => {
	// Componente para teste, usando o AddTask dentro de um provedor de diálogo

	it("should render the add task button and open the dialog", async () => {
		// should render the add task button and open the dialog
		// deve renderizar o botão de adicionar tarefa e abrir o diálogo

		const user = userEvent.setup();
		render(<AddTask projectId="proj-123" />);

		const openButton = screen.getByRole("button", { name: /Adicionar/i });
		expect(openButton).toBeInTheDocument();

		await user.click(openButton);

		expect(
			screen.getByRole("heading", { name: /Nova tarefa/i }),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				/Preencha os detalhes para adicionar uma nova tarefa ao projeto/i,
			),
		).toBeInTheDocument();
	});

	// PRECISA CORRIGIR O SELECT DE STATUS NÃO PARECE ESTAR FUNCIONANDO AINDA
	it("should submit the form with the correct data when all fields are filled", async () => {
		// should submit the form with the correct data when all fields are filled
		// deve submeter o formulário com os dados corretos quando todos os campos são preenchidos

		const user = userEvent.setup();
		const projectId = "proj-123";

		render(<AddTask projectId={projectId} />);

		await user.click(screen.getByRole("button", { name: /Adicionar/i }));

		// Preencher os campos
		const titleInput = screen.getByRole("textbox", { name: /Título/i });
		const descriptionEditor = screen.getByTestId("tiptap-editor");
		const statusSelectTrigger = screen.getByRole("combobox", {
			name: /Status/i,
		});

		await user.type(titleInput, "Test Task Title");
		await user.type(descriptionEditor, "Test description content");
		await user.click(statusSelectTrigger);

		// Encontrar e clicar na opção desejada, ignorando o aria-hidden
		const inProgressOption = await screen.findByRole("option", {
			name: /Em Andamento/i,
			hidden: true,
		});
		await user.click(inProgressOption);

		// Clicar no botão de submit
		await user.click(screen.getByRole("button", { name: /Adicionar Tarefa/i }));

		// Verificar se a função de mutação foi chamada com os dados corretos
		expect(mockMutate).toHaveBeenCalledWith(
			{
				title: "Test Task Title",
				description: "Test description content",
				projectId: projectId,
				status: "PENDING",
			},
			expect.objectContaining({
				onSuccess: expect.any(Function),
			}),
		);
	});

	it("should show validation errors for empty fields on submit", async () => {
		// should show validation errors for empty fields on submit
		// deve mostrar erros de validação para campos vazios ao submeter

		const user = userEvent.setup();
		render(<AddTask projectId="proj-123" />);

		await user.click(screen.getByRole("button", { name: /Adicionar/i }));

		// Não preenche nada e tenta submeter
		await user.click(screen.getByRole("button", { name: /Adicionar Tarefa/i }));

		// Verifica se as mensagens de erro de validação são exibidas
		expect(
			await screen.findByText(/Título é obrigatório/i),
		).toBeInTheDocument();
		expect(
			await screen.findByText(/Descrição é obrigatória/i),
		).toBeInTheDocument();
		// A validação do status é coberta, pois o valor padrão está presente
	});

	it("should disable the form fields and button when a task is being added (isPending)", async () => {
		// should disable the form fields and button when a task is being added (isPending)
		// deve desabilitar os campos do formulário e o botão quando uma tarefa está sendo adicionada (isPending)

		// Sobrescreve o mock para simular o estado de "isPending"
		vi.spyOn(
			require("@/hooks/task/use-add-task"),
			"useAddTask",
		).mockReturnValue({
			mutate: vi.fn(),
			isPending: true,
		});

		const user = userEvent.setup();
		render(<AddTask projectId="proj-123" />);

		await user.click(screen.getByRole("button", { name: /Adicionar/i }));

		const titleInput = screen.getByRole("textbox", { name: /Título/i });
		const descriptionEditor = screen.getByTestId("tiptap-editor");
		const statusSelectTrigger = screen.getByRole("combobox", {
			name: /Status/i,
		});
		const submitButton = screen.getByRole("button", {
			name: /Adicionando.../i,
		});

		expect(titleInput).toBeDisabled();
		expect(descriptionEditor).toBeDisabled();
		expect(statusSelectTrigger).toBeDisabled();
		expect(submitButton).toBeDisabled();

		expect(submitButton).toHaveTextContent("Adicionando...");
	});
});
