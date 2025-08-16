// src/utils/html-parser.ts

/**
 * @name stripHtmlTags
 * @description Remove todas as tags HTML de uma string.
 * @param {string} htmlString A string HTML para ser limpa.
 * @returns {string} A string com as tags HTML removidas.
 */
export const stripHtmlTags = (htmlString: string): string => {
	// Cria um novo elemento div para parsear o HTML
	const doc = new DOMParser().parseFromString(htmlString, "text/html");
	// Retorna o texto do corpo, que contém apenas o conteúdo textual
	return doc.body.textContent || "";
};
