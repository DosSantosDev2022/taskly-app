import React from 'react'

const Paragraph = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
	return (
		<p className='text-muted-foreground font-light' ref={ref} {...props} />
	)
})

export { Paragraph }
