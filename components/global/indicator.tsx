import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import React from 'react'

// Variantes de cor e animação
const indicatorVariants = cva('absolute rounded-full', {
	variants: {
		color: {
			primary: 'bg-primary dark:bg-muted-foreground',
			secondary: 'bg-secondary dark:bg-secondary-foreground',
			success: 'bg-green-500 dark:bg-green-400',
			danger: 'bg-red-500 dark:bg-red-400',
			warning: 'bg-yellow-500 dark:bg-yellow-400',
		},
		animation: {
			none: '',
			pulse: 'animate-pulse',
			bounce: 'animate-bounce',
			ping: 'animate-ping',
		},
		size: {
			sm: 'w-2 h-2',
			md: 'w-3 h-3',
			lg: 'w-4 h-4',
		},
	},
	defaultVariants: {
		color: 'primary',
		animation: 'none',
		size: 'md',
	},
})

interface IndicatorBadgeProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
	VariantProps<typeof indicatorVariants> {
	className?: string
	positionClassName?: string
}

const Indicator = React.forwardRef<
	HTMLDivElement,
	IndicatorBadgeProps
>(
	(
		{
			className,
			positionClassName = 'left-4 -top-2 z-10 animate-pulse',
			color,
			animation,
			size,
			...props
		},
		ref,
	) => {
		return (
			<div
				ref={ref}
				className={twMerge(
					indicatorVariants({ color, animation, size }),
					positionClassName,
					className,
				)}
				{...props}
			/>
		)
	},
)

Indicator.displayName = 'Indicator'

export { Indicator }
