import { useTaskDetailsPanel } from "@/hooks/task";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TaskDetailsPanel } from "../tasks/task-details-panel";

// Mock do hook useTaskDetailsPanel para isolar o componente
vi.mock("@/hooks/task", () => ({
	useTaskDetailsPanel: vi.fn(),
}));

const mockTask = {
	id: "task-1",
	title: "Test Task",
	description: "<p>This is a test description.</p>",
	status: "Pendente" as "Pendente" | "Em Andamento" | "Concluída",
	type: "task" as const, // Ensure the type is the literal "task"
	projectId: "project-1",
};

const queryClient = new QueryClient();

describe("TaskDetailsPanel", () => {
	// Teste: Renderização inicial e conteúdo da tarefa
	// Translation: Initial rendering and task content
	it("should render the task details correctly", () => {
		vi.mocked(useTaskDetailsPanel).mockReturnValue({
			isUpdatingStatus: false,
			showConfirmDialog: false,
			showEditModal: false,
			isDeleting: false,
			handleStatusClick: vi.fn(),
			handleInitiateDelete: vi.fn(),
			handleConfirmDelete: vi.fn(),
			handleCancelDelete: vi.fn(),
			handleOpenEditModal: vi.fn(),
			handleCloseEditModal: vi.fn(),
			handleTaskEdited: vi.fn(),
			convertFriendlyStatusToPrisma: vi.fn(),
			clearSelection: vi.fn(),
		});

		render(<TaskDetailsPanel task={mockTask} />);

		expect(screen.getByText("Detalhes da Tarefa")).toBeInTheDocument();
		expect(screen.getByText("Título:")).toBeInTheDocument();
		expect(screen.getByText("Test Task")).toBeInTheDocument();
		expect(screen.getByText("Descrição:")).toBeInTheDocument();
		expect(screen.getByText("This is a test description.")).toBeInTheDocument();
		expect(screen.getByText("Status:")).toBeInTheDocument();
	});

	// Teste: Botões de ação devem ser renderizados e ter as labels corretas
	// Translation: Action buttons should be rendered and have the correct labels
	it("should render all action buttons with their tooltips", async () => {
		vi.mocked(useTaskDetailsPanel).mockReturnValue({
			isUpdatingStatus: false,
			showConfirmDialog: false,
			showEditModal: false,
			isDeleting: false,
			handleStatusClick: vi.fn(),
			handleInitiateDelete: vi.fn(),
			handleConfirmDelete: vi.fn(),
			handleCancelDelete: vi.fn(),
			handleOpenEditModal: vi.fn(),
			handleCloseEditModal: vi.fn(),
			handleTaskEdited: vi.fn(),
			convertFriendlyStatusToPrisma: vi.fn(),
			clearSelection: vi.fn(),
		});

		const user = userEvent.setup();
		render(<TaskDetailsPanel task={mockTask} />);

		// Verifica se os botões com os tooltips existem
		const editButton = screen.getByRole("button", { name: "Editar Tarefa" });
		const deleteButton = screen.getByRole("button", { name: "Deletar Tarefa" });
		const closeButton = screen.getByRole("button", { name: "Fechar Painel" });

		expect(editButton).toBeInTheDocument();
		expect(deleteButton).toBeInTheDocument();
		expect(closeButton).toBeInTheDocument();

		await user.hover(editButton);
		expect(
			await screen.findByRole("tooltip", { name: "Editar" }),
		).toBeInTheDocument();
	});

	// Teste: Botão de deletar deve estar desabilitado quando isDeleting for true
	// Translation: The delete button should be disabled when isDeleting is true
	it("should disable the delete button when isDeleting is true", () => {
		vi.mocked(useTaskDetailsPanel).mockReturnValue({
			isUpdatingStatus: false,
			showConfirmDialog: false,
			showEditModal: false,
			isDeleting: true,
			handleStatusClick: vi.fn(),
			handleInitiateDelete: vi.fn(),
			handleConfirmDelete: vi.fn(),
			handleCancelDelete: vi.fn(),
			handleOpenEditModal: vi.fn(),
			handleCloseEditModal: vi.fn(),
			handleTaskEdited: vi.fn(),
			convertFriendlyStatusToPrisma: vi.fn(),
			clearSelection: vi.fn(),
		});

		render(<TaskDetailsPanel task={mockTask} />);

		const deleteButton = screen.getByRole("button", { name: "Deletar Tarefa" });
		expect(deleteButton).toBeDisabled();
	});

	// Teste: o status da tarefa deve mostrar "Atualizando..." quando isUpdatingStatus for true
	// Translation: The task status should show "Updating..." when isUpdatingStatus is true
	it('should show "Atualizando..." when status is updating', () => {
		vi.mocked(useTaskDetailsPanel).mockReturnValue({
			isUpdatingStatus: true,
			showConfirmDialog: false,
			showEditModal: false,
			isDeleting: false,
			handleStatusClick: vi.fn(),
			handleInitiateDelete: vi.fn(),
			handleConfirmDelete: vi.fn(),
			handleCancelDelete: vi.fn(),
			handleOpenEditModal: vi.fn(),
			handleCloseEditModal: vi.fn(),
			handleTaskEdited: vi.fn(),
			convertFriendlyStatusToPrisma: vi.fn(),
			clearSelection: vi.fn(),
		});

		render(<TaskDetailsPanel task={mockTask} />);

		const statusText = screen.getByText("Atualizando...");
		expect(statusText).toBeInTheDocument();
	});

	// Teste: Chamada de handleOpenEditModal ao clicar no botão de edição
	// Translation: handleOpenEditModal should be called when clicking the edit button
	it("should call handleOpenEditModal when the edit button is clicked", async () => {
		const handleOpenEditModal = vi.fn();
		vi.mocked(useTaskDetailsPanel).mockReturnValue({
			isUpdatingStatus: false,
			showConfirmDialog: false,
			showEditModal: false,
			isDeleting: false,
			handleStatusClick: vi.fn(),
			handleInitiateDelete: vi.fn(),
			handleConfirmDelete: vi.fn(),
			handleCancelDelete: vi.fn(),
			handleOpenEditModal,
			handleCloseEditModal: vi.fn(),
			handleTaskEdited: vi.fn(),
			convertFriendlyStatusToPrisma: vi.fn(),
			clearSelection: vi.fn(),
		});

		const user = userEvent.setup();
		render(<TaskDetailsPanel task={mockTask} />);

		const editButton = screen.getByRole("button", { name: "Editar Tarefa" });
		await user.click(editButton);

		expect(handleOpenEditModal).toHaveBeenCalledTimes(1);
	});

	// Teste: Chamada de handleInitiateDelete ao clicar no botão de exclusão
	// Translation: handleInitiateDelete should be called when clicking the delete button
	it("should call handleInitiateDelete when the delete button is clicked", async () => {
		const handleInitiateDelete = vi.fn();
		vi.mocked(useTaskDetailsPanel).mockReturnValue({
			isUpdatingStatus: false,
			showConfirmDialog: false,
			showEditModal: false,
			isDeleting: false,
			handleStatusClick: vi.fn(),
			handleInitiateDelete,
			handleConfirmDelete: vi.fn(),
			handleCancelDelete: vi.fn(),
			handleOpenEditModal: vi.fn(),
			handleCloseEditModal: vi.fn(),
			handleTaskEdited: vi.fn(),
			convertFriendlyStatusToPrisma: vi.fn(),
			clearSelection: vi.fn(),
		});

		const user = userEvent.setup();
		render(<TaskDetailsPanel task={mockTask} />);

		const deleteButton = screen.getByRole("button", { name: "Deletar Tarefa" });
		await user.click(deleteButton);

		expect(handleInitiateDelete).toHaveBeenCalledTimes(1);
	});

	// Teste: Chamada de clearSelection ao clicar no botão de fechar
	// Translation: clearSelection should be called when clicking the close button
	it("should call clearSelection when the close button is clicked", async () => {
		const clearSelection = vi.fn();
		vi.mocked(useTaskDetailsPanel).mockReturnValue({
			isUpdatingStatus: false,
			showConfirmDialog: false,
			showEditModal: false,
			isDeleting: false,
			handleStatusClick: vi.fn(),
			handleInitiateDelete: vi.fn(),
			handleConfirmDelete: vi.fn(),
			handleCancelDelete: vi.fn(),
			handleOpenEditModal: vi.fn(),
			handleCloseEditModal: vi.fn(),
			handleTaskEdited: vi.fn(),
			convertFriendlyStatusToPrisma: vi.fn(),
			clearSelection,
		});

		const user = userEvent.setup();
		render(<TaskDetailsPanel task={mockTask} />);

		const closeButton = screen.getByRole("button", { name: "Fechar Painel" });
		await user.click(closeButton);

		expect(clearSelection).toHaveBeenCalledTimes(1);
	});

	// Teste: o componente ConfirmationDialog é renderizado quando showConfirmDialog é true
	// Translation: The ConfirmationDialog component is rendered when showConfirmDialog is true
	it("should render ConfirmationDialog when showConfirmDialog is true", () => {
		vi.mocked(useTaskDetailsPanel).mockReturnValue({
			isUpdatingStatus: false,
			showConfirmDialog: true,
			showEditModal: false,
			isDeleting: false,
			handleStatusClick: vi.fn(),
			handleInitiateDelete: vi.fn(),
			handleConfirmDelete: vi.fn(),
			handleCancelDelete: vi.fn(),
			handleOpenEditModal: vi.fn(),
			handleCloseEditModal: vi.fn(),
			handleTaskEdited: vi.fn(),
			convertFriendlyStatusToPrisma: vi.fn(),
			clearSelection: vi.fn(),
		});

		render(<TaskDetailsPanel task={mockTask} />);

		const confirmDialogTitle = screen.getByText("Deletar Tarefa");
		expect(confirmDialogTitle).toBeInTheDocument();
	});

	// Teste: o componente EditTaskModal é renderizado quando showEditModal é true
	// Translation: The EditTaskModal component is rendered when showEditModal is true
	it("should render EditTaskModal when showEditModal is true", () => {
		vi.mocked(useTaskDetailsPanel).mockReturnValue({
			isUpdatingStatus: false,
			showConfirmDialog: false,
			showEditModal: true,
			isDeleting: false,
			handleStatusClick: vi.fn(),
			handleInitiateDelete: vi.fn(),
			handleConfirmDelete: vi.fn(),
			handleCancelDelete: vi.fn(),
			handleOpenEditModal: vi.fn(),
			handleCloseEditModal: vi.fn(),
			handleTaskEdited: vi.fn(),
			convertFriendlyStatusToPrisma: vi.fn(),
			clearSelection: vi.fn(),
		});

		render(
			<QueryClientProvider client={queryClient}>
				<TaskDetailsPanel task={mockTask} />
			</QueryClientProvider>,
		);

		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});
});
