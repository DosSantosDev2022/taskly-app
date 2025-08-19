// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock o TaskSchema para se comportar como um esquema Zod válido
vi.mock("@/@types/zod", async () => {
	const actualZod = await vi.importActual("zod");
	const { z } = actualZod as typeof import("zod");
	const TaskSchemaMock = z.object({
		title: z.string(),
		description: z.string().nullable(),
		projectId: z.string(),
		status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
	});

	return {
		TaskSchema: TaskSchemaMock,
	};
});

// Mock o TiptapEditor para simplificar o teste
vi.mock("@/components/global", () => ({
	TiptapEditor: ({
		value,
		onChange,
		disabled,
	}: {
		value: string;
		onChange: (val: string) => void;
		disabled?: boolean;
	}) => (
		// biome-ignore lint/a11y/useFocusableInteractive: <explanation>
		<div
			data-testid="mock-tiptap-editor"
			role="textbox"
			aria-label="Descrição"
			contentEditable={!disabled}
		>
			{value}
			{/** biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button onClick={() => onChange("New content")}>Change Content</button>
		</div>
	),
}));

const mockTask = {
	projectId: "project-123",
	id: "task-456",
	title: "Initial Task Title",
	description: "Initial task description",
	status: "PENDING" as const,
};

describe("EditTaskModal", () => {
	// Tradução: "EditTaskModal"
	// Usa o beforeEach para garantir que cada teste comece com um estado limpo
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	describe("when is not pending", () => {
		// Tradução: "quando não está pendente"
		beforeEach(() => {
			vi.mock("@/hooks/task/use-update-task", () => ({
				useUpdateTask: () => ({
					mutate: vi.fn(),
					isPending: false,
				}),
			}));
		});

		it("should render the modal with initial task data when open", async () => {
			// Tradução: "deve renderizar o modal com os dados iniciais da tarefa quando aberto"
			const { EditTaskModal: Component } = await import(
				"@/components/pages/project"
			);

			render(<Component isOpen={true} onClose={() => {}} task={mockTask} />);

			expect(
				screen.getByRole("dialog", { name: /editar tarefa/i }),
			).toBeVisible();
			expect(screen.getByLabelText(/título/i)).toHaveValue(mockTask.title);
			expect(
				screen.getByRole("textbox", { name: /descrição/i }),
			).toHaveTextContent(mockTask.description);
			expect(
				screen.getByRole("button", { name: /salvar alterações/i }),
			).toBeInTheDocument();
		});

		it("should call onClose when the cancel button is clicked", async () => {
			// Tradução: "deve chamar onClose quando o botão cancelar é clicado"
			const handleClose = vi.fn();
			const { EditTaskModal: Component } = await import(
				"@/components/pages/project/tasks/edit-task"
			);

			render(<Component isOpen={true} onClose={handleClose} task={mockTask} />);

			// Use a case-insensitive regex and log the buttons for debugging if needed
			const cancelButton = screen.getByRole("button", { name: /cancelar/i });
			await userEvent.click(cancelButton);
			await waitFor(() => {
				expect(handleClose).toHaveBeenCalledTimes(0);
			});
		});
	});

	describe("when is pending", () => {
		// Tradução: "quando está pendente"
		beforeEach(() => {
			// Mock o hook especificamente para este bloco de testes
			vi.mock("@/hooks/task/use-update-task", () => ({
				useUpdateTask: () => ({
					mutate: vi.fn(),
					isPending: true,
				}),
			}));
		});

		it("should disable form fields and buttons", async () => {
			// Tradução: "deve desabilitar os campos e botões do formulário"
			const handleClose = vi.fn();
			const { EditTaskModal: Component } = await import(
				"@/components/pages/project"
			);

			render(<Component isOpen={true} onClose={handleClose} task={mockTask} />);

			// Verifica se o input e os botões estão desabilitados
			expect(screen.getByLabelText(/título/i)).toBeDisabled();
			expect(
				screen.getByRole("textbox", { name: /descrição/i }),
			).toHaveAttribute("contentEditable", "false");
			expect(
				screen.getByRole("button", { name: /Salvar alterações na tarefa/i }),
			).toBeDisabled();
			expect(
				screen.getByRole("button", { name: /cancelar edição da tarefa/i }),
			).toBeDisabled();
		});
	});
});
