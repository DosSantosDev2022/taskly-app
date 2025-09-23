"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { Task } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useTasksCalendarController } from "@/hooks/dashboard";
import { getProjectStatusVariant, getTaskStatusLabel } from "@/utils";
import { twMerge } from "tailwind-merge";

interface MonthViewCalendarProps {
	tasks: Task[];
}

export function TasksCalendar({ tasks }: MonthViewCalendarProps) {
	const {
		isModalOpen,
		setIsModalOpen,
		selectedDate,
		tasksForSelectedDay,
		events,
		handleDateClick,
		renderEventContent,
	} = useTasksCalendarController({ tasks });

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
				eventContent={renderEventContent}
				height="auto"
				locale="pt-br"
				buttonText={{
					today: "Hoje",
					month: "Mês",
					week: "Semana",
					day: "Dia",
				}}
				dayMaxEvents={true}
				dateClick={handleDateClick}
			/>
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
									<p
										className={twMerge(
											`font-medium text-sm leading-tight mb-1 text-foreground`,
										)}
									>
										{task.title}
									</p>
									<Badge variant={getProjectStatusVariant(task.status)}>
										{getTaskStatusLabel(task.status)}
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
