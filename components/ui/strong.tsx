import React from 'react'

const Strong = React.forwardRef<
	HTMLElement,
	React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => {
	return (
		<strong className='text-foreground font-bold' ref={ref} {...props} />
	)
})

export { Strong }
