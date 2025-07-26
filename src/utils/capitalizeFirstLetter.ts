// src/lib/utils.ts

/**
 * Formata uma string para ter a primeira letra maiúscula e o restante minúscula.
 * Ex: "WEB" -> "Web", "mobile" -> "Mobile", "siStEMa" -> "Sistema"
 * @param text A string a ser formatada.
 * @returns A string formatada.
 */
export function capitalizeFirstLetter(text: string): string {
	if (!text) return ""; // Retorna string vazia se o texto for nulo ou vazio
	const lowercased = text.toLowerCase();
	return lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
}

// Se você já tem formatDate, ele estaria aqui também:
// export function formatDate(dateString: string): string { /* ... */ }
