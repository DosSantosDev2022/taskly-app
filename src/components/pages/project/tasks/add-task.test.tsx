import { Task } from "@/@types/project-types";
import { CreateTaskInput } from "@/@types/zod";
import { AddTask } from "@/components/pages/project";
import { useAddTask } from "@/hooks/task/use-add-task";
import { UseMutationResult } from "@tanstack/react-query";
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, MockedFunction, vi } from "vitest";

// Mocking the child components.
// Mockando os componentes filhos.
vi.mock("@/components/global", () => ({
	TiptapEditor: ({
		value,
		onChange,
		disabled,
	}: {
		value: string;
		onChange: (value: string) => void;
		disabled?: boolean;
	}) => (
		<textarea
			data-testid="tiptap-editor-mock"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			disabled={disabled}
		/>
	),
}));

// Mocking the useAddTask hook. This is essential for resolving the TypeScript error.
// Mockando o hook useAddTask. Isso é essencial para resolver o erro de TypeScript.
vi.mock("@/hooks/task/use-add-task");
const mockedUseAddTask = useAddTask as MockedFunction<typeof useAddTask>;

// Defining a type for the mocked return value to satisfy TypeScript.
// Definindo um tipo para o valor de retorno mockado para satisfazer o TypeScript.
type MockedUseAddTaskResult = UseMutationResult<
	Task,
	Error,
	CreateTaskInput,
	unknown
>;

const mockUseAddTaskReturn = (
	isPending: boolean,
	onSuccess: () => void = vi.fn(),
) => {
	const mutateMock = vi.fn((_values, options) => {
		// Simulating the onSuccess callback.
		// Simulando o callback onSuccess.
		if (options && options.onSuccess) {
			options.onSuccess();
		}
	});

	return {
		mutate: mutateMock,
		isPending: isPending,
		isIdle: !isPending,
		isPaused: false,
		isSuccess: false,
		isError: false,
		error: null,
		data: undefined,
		status: isPending ? "pending" : "idle",
	} as unknown as MockedUseAddTaskResult;
};

describe("AddTask", () => {
	// Test the initial render and dialog behavior.
	// Testa a renderização inicial e o comportamento do diálogo.
	it("should render the add task button and open the dialog when clicked", async () => {
		const user = userEvent.setup();
		mockedUseAddTask.mockReturnValue(mockUseAddTaskReturn(false));

		render(<AddTask projectId="project-123" />);

		const addButton = screen.getByRole("button", { name: /Adicionar/i });
		expect(addButton).toBeInTheDocument();

		await user.click(addButton);

		const dialogTitle = screen.getByRole("heading", { name: /Nova tarefa/i });
		expect(dialogTitle).toBeInTheDocument();
	});

	// Test form submission with valid data.
	// Testa a submissão do formulário com dados válidos.
	it("should call mutate with the correct data on form submission", async () => {
		const user = userEvent.setup();
		const mockMutate = vi.fn();
		mockedUseAddTask.mockReturnValue({
			...mockUseAddTaskReturn(false),
			mutate: mockMutate,
		});
		const projectId = "project-123";

		render(<AddTask projectId={projectId} />);

		await user.click(screen.getByRole("button", { name: /Adicionar/i }));

		const titleInput = screen.getByLabelText(/Título/i);
		const descriptionEditor = screen.getByTestId("tiptap-editor-mock");
		const statusSelectTrigger = screen.getByRole("combobox", {
			name: /Status/i,
		});
		const submitButton = screen.getByRole("button", {
			name: /Adicionar Tarefa/i,
		});

		await user.type(titleInput, "Test Task");
		await user.type(descriptionEditor, "Test description");

		await user.click(statusSelectTrigger);
		await user.click(screen.getByRole("option", { name: "Em Andamento" }));

		await user.click(submitButton);

		const expectedValues = {
			title: "Test Task",
			description: "Test description",
			status: "IN_PROGRESS",
			projectId: "project-123",
		};

		expect(mockMutate).toHaveBeenCalledWith(
			expect.objectContaining(expectedValues),
			expect.any(Object),
		);
	});

	// Test form and modal behavior after successful submission.
	// Testa o comportamento do formulário e do modal após a submissão bem-sucedida.
	it("should reset the form and close the dialog on successful submission", async () => {
		const user = userEvent.setup();
		const mockMutate = vi.fn((_values, { onSuccess }) => {
			onSuccess();
		});
		mockedUseAddTask.mockReturnValue({
			...mockUseAddTaskReturn(false),
			mutate: mockMutate,
		});
		const projectId = "project-123";

		render(<AddTask projectId={projectId} />);

		await user.click(screen.getByRole("button", { name: /Adicionar/i }));

		const titleInput = screen.getByLabelText(/Título/i);
		const descriptionEditor = screen.getByTestId("tiptap-editor-mock");
		const submitButton = screen.getByRole("button", {
			name: /Adicionar Tarefa/i,
		});

		await user.type(titleInput, "Another Task");
		await user.type(descriptionEditor, "Another description");
		await user.click(submitButton);

		// Using waitFor to wait for the dialog to disappear.
		// Usando waitFor para esperar o diálogo desaparecer.
		await waitFor(() => {
			const dialogTitle = screen.queryByRole("heading", {
				name: /Nova tarefa/i,
			});
			expect(dialogTitle).not.toBeInTheDocument();
		});
	});

	// Test the loading state during submission.
	// Testa o estado de carregamento durante a submissão.
	it("should show loading state and disable inputs when form is submitting", async () => {
		const user = userEvent.setup();
		mockedUseAddTask.mockReturnValue(mockUseAddTaskReturn(true));
		const projectId = "project-123";

		render(<AddTask projectId={projectId} />);

		await user.click(screen.getByRole("button", { name: /Adicionar/i }));

		const titleInput = screen.getByLabelText(/Título/i);
		const descriptionEditor = screen.getByTestId("tiptap-editor-mock");
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

	// Test form validation (simulating a required field not filled).
	// Testa a validação do formulário (simulando um campo obrigatório não preenchido).
	it("should display validation errors for required fields", async () => {
		const user = userEvent.setup();
		mockedUseAddTask.mockReturnValue(mockUseAddTaskReturn(false));
		const projectId = "project-123";

		render(<AddTask projectId={projectId} />);

		await user.click(screen.getByRole("button", { name: /Adicionar/i }));
		const submitButton = screen.getByRole("button", {
			name: /Adicionar Tarefa/i,
		});
		await user.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText("O título da tarefa é obrigatório."),
			).toBeInTheDocument();
		});
		expect(useAddTask().mutate).not.toHaveBeenCalled();
	});
});
