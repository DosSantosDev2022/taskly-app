// src/components/dashboard/MonthViewCalendar.tsx

"use client";

import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { Task } from "@prisma/client";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

// 1. Importe os componentes do Dialog e o useState
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getStatusVariant, getStatusLabelProject } from "@/utils";

interface MonthViewCalendarProps {
	tasks: Task[];
}

const statusColors = {
	PENDING: "var(--error)",
	IN_PROGRESS: "var(--warning)",
	COMPLETED: "var(--success)",
};

export function TasksCalendar({ tasks }: MonthViewCalendarProps) {
	// 2. Estados para controlar o modal
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
				color: statusColors[task.status],
				borderColor: statusColors[task.status],
				textColor: "var(--primary)",
			}));
	}, [tasks]);

	// 3. Função para lidar com o clique em um dia do calendário
	const handleDateClick = (arg: { date: Date }) => {
		const clickedDate = arg.date;

		// Filtra as tarefas para encontrar as que correspondem ao dia clicado
		const dayTasks = tasks.filter(
			(task) => task.dueDate && isSameDay(task.dueDate, clickedDate),
		);

		// Atualiza os estados
		setSelectedDate(clickedDate);
		setTasksForSelectedDay(dayTasks);
		setIsModalOpen(true); // Abre o modal
	};

	return (
		<div className="full-calendar-container">
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				headerToolbar={{
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,timeGridWeek,timeGridDay",
				}}
				events={events}
				height="auto"
				locale="pt-br"
				buttonText={{
					today: "Hoje",
					month: "Mês",
					week: "Semana",
					day: "Dia",
				}}
				dayMaxEvents={true}
				// 4. Conecte a função de clique ao evento do FullCalendar
				dateClick={handleDateClick}
			/>

			{/* 5. O Modal (Dialog) para exibir as tarefas */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>
							Tarefas para{" "}
							{selectedDate
								? format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
										locale: ptBR,
									})
								: ""}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
						{tasksForSelectedDay.length > 0 ? (
							tasksForSelectedDay.map((task) => (
								<div
									key={task.id}
									className="p-3 border rounded-lg bg-muted/50"
								>
									<p className="font-medium text-sm leading-tight mb-1 text-foreground">
										{task.title}
									</p>
									<Badge variant={getStatusVariant(task.status)}>
										{getStatusLabelProject(task.status)}
									</Badge>
								</div>
							))
						) : (
							<p className="text-sm text-muted-foreground text-center">
								Nenhuma tarefa agendada para este dia.
							</p>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
