import React, { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export interface BadgeProps extends ComponentProps<'span'> {
	variant?:
		| 'primary'
		| 'secondary'
		| 'accent'
		| 'muted'
		| 'danger'
		| 'warning'
		| 'success'
	children?: string
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
	({ className, variant = 'accent', children, ...props }, ref) => {
		const variantClasses = {
			primary: 'bg-primary text-primary-foreground',
			secondary: 'bg-secondary text-secondary-foreground',
			accent: 'bg-accent text-accent-foreground',
			muted: 'bg-muted text-muted-foreground',
			danger: 'bg-danger/70 text-danger-foreground',
			warning: 'bg-warning/50 text-warning-foreground',
			success: 'bg-success/70 text-success-foreground',
		}

		return (
			<span
				className={twMerge(
					'max-w-24 inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
					'transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
					variantClasses[variant],
					className,
				)}
				{...props}
				ref={ref}
			>
				{children}
			</span>
		)
	},
)

Badge.displayName = 'Badge'

export { Badge }
