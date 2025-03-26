import React, { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export interface BadgeProps extends ComponentProps<'span'> {
	variant?: 'primary' | 'secondary' | 'accent' | 'muted'
	size?: 'xs' | 'md' | 'lg' | 'xl' | 'full'
	children?: string
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
	(
		{ className, variant = 'accent', size = 'xs', children, ...props },
		ref,
	) => {
		const variantClasses = {
			primary: 'bg-primary text-primary-foreground',
			secondary: 'bg-secondary text-secondary-foreground',
			accent: 'bg-accent text-accent-foreground',
			muted: 'bg-muted text-muted-foreground',
		}
		const variantSizes = {
			xs: 'text-xs min-w-8 px-2 py-0.5',
			md: 'text-sm min-w-14 px-3 py-1',
			lg: 'text-base min-w-16 px-4 py-1.5',
			xl: 'text-lg min-w-24 px-5 py-2',
			full: 'w-full text-base px-6 py-2',
		}

		return (
			<span
				className={twMerge(
					'inline-flex items-center justify-center rounded-full  px-2.5 py-1.5 text-xs font-semibold',
					'transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
					variantClasses[variant],
					variantSizes[size],
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
