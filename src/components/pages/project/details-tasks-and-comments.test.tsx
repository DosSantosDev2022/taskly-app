import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DetailsTasksAndComments } from "./details-tasks-and-comments";

// Mocks the components from @/components/pages/project to simplify testing
vi.mock("@/components/pages/project", () => ({
	TaskDetailsPanel: vi.fn(() => <div>Task Details Panel Mock</div>),
	CommentDetailsPanel: vi.fn(() => <div>Comment Details Panel Mock</div>),
}));

// Mocks the UI components from @/components/ui to correctly render their children
vi.mock("@/components/ui", () => ({
	Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	CardContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

// Define types for selectedItem to match possible values
type TaskItem = { type: "task"; id: string; name: string };
type CommentItem = { type: "comment"; id: string; content: string };
type SelectedItem = TaskItem | CommentItem | null;

// Mocks the Zustand store hook
const mockStore: { selectedItem: SelectedItem } = {
	selectedItem: null,
};
vi.mock("@/store", () => ({
	useProjectDetailsStore: vi.fn((selector) => selector(mockStore)),
}));

describe("DetailsTasksAndComments", () => {
	// Tests that the component renders a message when no item is selected
	// Testa que o componente renderiza uma mensagem quando nenhum item é selecionado
	it("should render a message when no item is selected", () => {
		// Limpa o mock e define o estado para este teste
		mockStore.selectedItem = null;
		vi.clearAllMocks();

		render(<DetailsTasksAndComments />);

		// Verifica se a mensagem de "Clique para ver os detalhes" está na tela
		expect(
			screen.getByText(
				"Clique em uma tarefa ou comentário para ver os detalhes.",
			),
		).toBeInTheDocument();
		expect(
			screen.queryByText(/Task Details Panel Mock/),
		).not.toBeInTheDocument();
		expect(
			screen.queryByText(/Comment Details Panel Mock/),
		).not.toBeInTheDocument();
	});

	// Tests that the component renders the TaskDetailsPanel when a task is selected
	// Testa que o componente renderiza o TaskDetailsPanel quando uma tarefa é selecionada
	it("should render TaskDetailsPanel when a task is selected", () => {
		mockStore.selectedItem = { type: "task", id: "1", name: "Test Task" };
		vi.clearAllMocks();

		render(<DetailsTasksAndComments />);
		expect(screen.getByText("Task Details Panel Mock")).toBeInTheDocument();
		expect(
			screen.queryByText("Comment Details Panel Mock"),
		).not.toBeInTheDocument();
		expect(
			screen.queryByText(
				"Clique em uma tarefa ou comentário para ver os detalhes.",
			),
		).not.toBeInTheDocument();
	});

	// Tests that the component renders the CommentDetailsPanel when a comment is selected
	// Testa que o componente renderiza o CommentDetailsPanel quando um comentário é selecionado
	it("should render CommentDetailsPanel when a comment is selected", () => {
		mockStore.selectedItem = {
			type: "comment",
			id: "2",
			content: "Test Comment",
		};
		vi.clearAllMocks();

		render(<DetailsTasksAndComments />);
		expect(screen.getByText("Comment Details Panel Mock")).toBeInTheDocument();
		expect(
			screen.queryByText("Task Details Panel Mock"),
		).not.toBeInTheDocument();
		expect(
			screen.queryByText(
				"Clique em uma tarefa ou comentário para ver os detalhes.",
			),
		).not.toBeInTheDocument();
	});
});
