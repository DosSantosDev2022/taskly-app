/**
 * Verifica se um projeto está fora do prazo.
 * * @param {Date | null} deadline - A data de prazo final do projeto. Pode ser `null` se não houver um prazo.
 * @returns {boolean} Retorna `true` se a data de prazo for anterior à data atual, indicando que o projeto está atrasado. Retorna `false` caso contrário ou se não houver um prazo.
 */

export function checkDeadline(deadline: Date | null): boolean {
	if (!deadline) return false;

	const currentDate = new Date();
	const deadlineDate = new Date(deadline);

	// Verifica se a data do prazo é anterior à data atual
	return deadlineDate < currentDate;
}
