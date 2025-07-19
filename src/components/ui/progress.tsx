"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import type * as React from "react";

import { cn } from "@/lib/utils";

interface ProgressProps
	extends React.ComponentProps<typeof ProgressPrimitive.Root> {
	showValue?: boolean; // Nova prop para controlar a exibição do valor
}

function Progress({
	className,
	value,
	showValue = false,
	...props
}: ProgressProps) {
	const displayValue =
		typeof value === "number"
			? Math.max(0, Math.min(100, Math.round(value)))
			: 0;
	return (
		<div className="relative w-full">
			<ProgressPrimitive.Root
				data-slot="progress"
				className={cn(
					"bg-primary/20 relative h-4 w-full overflow-hidden rounded-full",
					className,
				)}
				{...props}
			>
				<ProgressPrimitive.Indicator
					data-slot="progress-indicator"
					className="bg-blue-600 h-full w-full flex-1 transition-all"
					style={{ transform: `translateX(-${100 - displayValue}%)` }}
				/>
			</ProgressPrimitive.Root>

			{showValue && (
				<span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">
					{displayValue}%
				</span>
			)}
		</div>
	);
}

export { Progress };
