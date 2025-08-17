import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MessageError } from "./message-errors";

// Props
const messageErrorProps = {
	message: "Título do Componente",
};

describe("Test the Message Error component", () => {
	// Teste 1: O componente é renderizado com sucesso
	it("must render the component without errors", () => {
		// Renderiza o componente com as props genéricas
		render(<MessageError {...messageErrorProps} />);
		// Verifica se o elemento principal está no documento
		const componentElement = screen.getByText("Título do Componente");
		expect(componentElement).toBeInTheDocument();
	});

	// Teste 2: O componente exibe o conteúdo de texto correto
	it("should display the correct text provided via props", () => {
		// Renderiza o componente
		render(<MessageError {...messageErrorProps} />);
		// Verifica se o texto do título está presente
		const titleElement = screen.getByText(messageErrorProps.message);
		expect(titleElement).toBeInTheDocument();
	});
});
