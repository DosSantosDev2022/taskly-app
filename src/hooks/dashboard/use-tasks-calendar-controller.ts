// src/hooks/useTasksCalendarController.ts
import { renderEventContent } from "@/components/pages/dashboard/render-event-content";
import type { Task } from "@prisma/client";
import { isSameDay } from "date-fns";
import { useMemo, useState } from "react";

interface UseTasksCalendarControllerProps {
	tasks: Task[];
}

export const useTasksCalendarController = ({
	tasks,
}: UseTasksCalendarControllerProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [tasksForSelectedDay, setTasksForSelectedDay] = useState<Task[]>([]);

	const events = useMemo(() => {
		return tasks
			.filter((task) => task.dueDate !== null)
			.map((task) => ({
				id: task.id,
				title: task.title,
				start: task.dueDate!,
				allDay: true,
				extendedProps: {
					status: task.status,
				},
			}));
	}, [tasks]);

	const handleDateClick = (arg: { date: Date }) => {
		const clickedDate = arg.date;
		const dayTasks = tasks.filter(
			(task) => task.dueDate && isSameDay(task.dueDate, clickedDate),
		);
		setSelectedDate(clickedDate);
		setTasksForSelectedDay(dayTasks);
		setIsModalOpen(true);
	};

	return {
		isModalOpen,
		setIsModalOpen,
		selectedDate,
		tasksForSelectedDay,
		events,
		handleDateClick,
		renderEventContent,
	};
};
