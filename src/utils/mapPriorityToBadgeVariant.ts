// utils/priorityUtils.ts

import type { BadgeProps } from "@/components/ui/badge";

interface PriorityInfo {
	label: string;
	variant: BadgeProps["variant"];
}

export function getPriorityInfo(priority: string): PriorityInfo {
	const map: Record<string, PriorityInfo> = {
		urgent: { label: "Urgente", variant: "danger" },
		high: { label: "Alta", variant: "primary" },
		medium: { label: "Média", variant: "warning" },
		low: { label: "Baixa", variant: "secondary" },
	};

	return (
		map[priority.toLowerCase()] || { label: "Indefinida", variant: "accent" }
	);
}
