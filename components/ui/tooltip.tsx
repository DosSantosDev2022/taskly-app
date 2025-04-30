'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
	content?: string
	position?:
		| 'top-start'
		| 'top-center'
		| 'top-end'
		| 'bottom-start'
		| 'bottom-center'
		| 'bottom-end'
		| 'left-start'
		| 'left-center'
		| 'left-end'
		| 'right-start'
		| 'right-center'
		| 'right-end'
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
	(
		{ content, position = 'top-center', className, children, ...props },
		ref,
	) => {
		const positionClasses = {
			'top-start': 'bottom-full mb-2 left-0',
			'top-center': 'bottom-full mb-2 left-1/2 -translate-x-1/2',
			'top-end': 'bottom-full mb-2 right-0',

			'bottom-start': 'top-full mt-2 left-0',
			'bottom-center': 'top-full mt-2 left-1/2 -translate-x-1/2',
			'bottom-end': 'top-full mt-2 right-0',

			'left-start': 'right-full mr-2 top-0',
			'left-center': 'right-full mr-2 top-1/2 -translate-y-1/2',
			'left-end': 'right-full mr-2 bottom-0',

			'right-start': 'left-full ml-2 top-0',
			'right-center': 'left-full ml-2 top-1/2 -translate-y-1/2',
			'right-end': 'left-full ml-2 bottom-0',
		}
		return (
			<div className='relative group'>
				{children}
				<div
					ref={ref}
					{...props}
					className={twMerge(
						'absolute z-50 whitespace-nowrap rounded-md bg-secondary left- px-2 py-1.5 text-sm text-secondary-foreground shadow-md',
						'opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200',
						positionClasses[position],
						className,
					)}
				>
					{content}
				</div>
			</div>
		)
	},
)

Tooltip.displayName = 'Tooltip'

export { Tooltip }
