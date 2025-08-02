import { format } from "date-fns";

export const formatDate = (date: Date | string, pattern = "dd/MM/yyyy") => {
	const parsedDate = new Date(date);

	// biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
	if (isNaN(parsedDate.getTime())) {
		return "-"; // ou '', ou 'Data inválida', depende do que você preferir exibir
	}

	return format(parsedDate, pattern);
};
