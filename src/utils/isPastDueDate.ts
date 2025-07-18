export function isPastDueDate(dueDate?: Date | string) {
	if (!dueDate) return false;

	const due = new Date(dueDate);
	const now = new Date();

	// Ignora a hora, compara só ano/mês/dia
	due.setHours(0, 0, 0, 0);
	now.setHours(0, 0, 0, 0);

	return due < now;
}
