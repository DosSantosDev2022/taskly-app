// src/components/dashboard/DashboardCalendar.tsx

"use client";

import * as React from "react";
import {
	ChevronDownIcon,
	ChevronLeft,
	ChevronLeftIcon,
	ChevronRight,
	ChevronRightIcon,
} from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { CalendarDayButton } from "@/components/ui";

// 1. O tipo de props permanece o mesmo
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// 2. Renomeamos a função para DashboardCalendar
function DashboardCalendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps) {
	return (
		<DayPicker
			mode="single"
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			classNames={{
				// 3. A NOSSA CUSTOMIZAÇÃO ESPECÍFICA DO DASHBOARD
				table: "w-full border-collapse space-y-1",

				// O resto das classes do componente original
				months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
				month: "space-y-4",
				caption: "flex justify-center pt-1 relative items-center",
				caption_label: "text-sm font-medium",
				nav: "space-x-1 flex items-center",
				nav_button: cn(
					buttonVariants({ variant: "outline" }),
					"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
				),
				nav_button_previous: "absolute left-1",
				nav_button_next: "absolute right-1",
				head_row: "flex",
				head_cell:
					"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
				row: "flex w-full mt-2",
				cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
				day: cn(
					buttonVariants({ variant: "ghost" }),
					"h-9 w-9 p-0 font-normal aria-selected:opacity-100",
				),
				day_selected:
					"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
				day_today: "bg-accent text-accent-foreground",
				day_outside: "text-muted-foreground opacity-50",
				day_disabled: "text-muted-foreground opacity-50",
				day_range_middle:
					"aria-selected:bg-accent aria-selected:text-accent-foreground",
				day_hidden: "invisible",
				...classNames,
			}}
			components={{
				Root: ({ className, rootRef, ...props }) => {
					return (
						<div
							data-slot="calendar"
							ref={rootRef}
							className={cn(className)}
							{...props}
						/>
					);
				},
				Chevron: ({ className, orientation, ...props }) => {
					if (orientation === "left") {
						return (
							<ChevronLeftIcon className={cn("size-4", className)} {...props} />
						);
					}

					if (orientation === "right") {
						return (
							<ChevronRightIcon
								className={cn("size-4", className)}
								{...props}
							/>
						);
					}

					return (
						<ChevronDownIcon className={cn("size-4", className)} {...props} />
					);
				},
				DayButton: CalendarDayButton,
				WeekNumber: ({ children, ...props }) => {
					return (
						<td {...props}>
							<div className="flex size-(--cell-size) items-center justify-center text-center">
								{children}
							</div>
						</td>
					);
				},
			}}
			{...props}
		/>
	);
}
// 4. Atualizamos o displayName e a exportação
DashboardCalendar.displayName = "DashboardCalendar";

export { DashboardCalendar };
