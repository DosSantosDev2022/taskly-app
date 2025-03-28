import React from 'react'
import { twMerge } from 'tailwind-merge'

const Card = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
	return (
		<div
			aria-label='card-root'
			ref={ref}
			className={twMerge(
				'space-y-3 rounded-lg border border-border bg-background p-4 shadow-sm',
				className,
			)}
			{...props}
		/>
	)
})

Card.displayName = 'Card'

const CardHeader = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
	<div
		aria-label='card-header'
		ref={ref}
		className={twMerge('flex flex-col space-y-1.5', className)}
		{...props}
	/>
))

CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
	HTMLHeadingElement,
	React.ComponentPropsWithoutRef<'h3'>
>(({ className, ...props }, ref) => (
	<h3
		aria-label='card-title'
		ref={ref}
		className={twMerge(
			'text-2xl font-semibold leading-none tracking-tight text-foreground',
			className,
		)}
		{...props}
	/>
))

CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.ComponentPropsWithoutRef<'p'>
>(({ className, ...props }, ref) => (
	<p
		aria-label='card-description'
		ref={ref}
		className={twMerge('text-sm text-muted-foreground', className)}
		{...props}
	/>
))

CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
	<div
		aria-label='card-content'
		ref={ref}
		className={twMerge('flex flex-col items-start', className)}
		{...props}
	/>
))

CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
	<div
		aria-label='card-footer'
		ref={ref}
		className={twMerge('flex items-center gap-2 sm:gap-3', className)}
		{...props}
	/>
))

CardFooter.displayName = 'CardFooter'

export {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
}
