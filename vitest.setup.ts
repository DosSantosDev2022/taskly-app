// vitest.setup.ts
import { vi } from "vitest";

// Mock da API ResizeObserver, necessária para o JSDOM
class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserver);

// Mock da função hasPointerCapture, necessária para interações do Radix UI
Object.defineProperty(HTMLElement.prototype, "hasPointerCapture", {
	value: () => false,
	writable: true,
});

// Adiciona o mock para a função scrollIntoView
Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
	value: () => {},
	writable: true,
});
