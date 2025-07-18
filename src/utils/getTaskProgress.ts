import type { Task } from "@/@types/prismaSchema";

export function getTaskProgress(tasks?: Task[]): number {
	if (!tasks || tasks.length === 0) return 0;

	const total = tasks.length;
	const completed = tasks.filter((task) => task.status === "done").length;

	return Math.round((completed / total) * 100);
}
