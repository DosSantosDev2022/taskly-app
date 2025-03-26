import type React from 'react'
import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const TextArea = forwardRef<
	HTMLTextAreaElement,
	React.ComponentPropsWithRef<'textarea'> & {
		variants?: 'success' | 'error' | 'default'
	}
>(({ className, variants = 'default', ...props }, ref) => {
	const variantClasses = {
		default: 'focus-within:ring-2 focus-within:ring-ring',
		success: 'focus-within:ring-2 focus-within:ring-success',
		error: 'focus-within:ring-2 focus-within:ring-danger',
	}
	return (
		<textarea
			{...props}
			ref={ref}
			className={twMerge(
				'w-full rounded border border-border bg-transparent px-3 py-4 font-light text-muted-foreground',
				'outline-none placeholder:text-muted-foreground',
				'transition-all duration-300',
				variantClasses[variants],
				className,
			)}
		/>
	)
})
TextArea.displayName = 'textArea'

export { TextArea }
