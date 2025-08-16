/**
 * @name stripHtmlTags
 * @description Remove todas as tags HTML de uma string de HTML, deixando apenas o texto puro.
 * @param {string} htmlString - A string de HTML a ser processada.
 * @returns {string} A string de texto sem as tags HTML.
 */
export const stripHtmlTags = (htmlString: string): string => {
	if (typeof window === "undefined" || !htmlString) {
		return ""; // Retorna string vazia no servidor para evitar hidratação inconsistente
	}
	const div = document.createElement("div");
	div.innerHTML = htmlString;
	return div.textContent || div.innerText || "";
};
