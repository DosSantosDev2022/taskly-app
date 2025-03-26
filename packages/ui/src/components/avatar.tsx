import React, { type ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'

const AvatarContainer = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<'div'>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={twMerge('flex w-full items-start space-x-2', className)}
		{...props}
	/>
))

AvatarContainer.displayName = 'AvatarContainer'

const AvatarWrapper = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<'div'>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={twMerge('grid flex-1 text-left leading-tight', className)}
		{...props}
	/>
))

AvatarWrapper.displayName = 'AvatarWrapper'

const AvatarName = React.forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithRef<'span'>
>(({ className, ...props }, ref) => {
	return (
		<span
			ref={ref}
			{...props}
			className={twMerge(
				'truncate text-sm  font-semibold  text-muted-foreground',
				className,
			)}
		/>
	)
})

AvatarName.displayName = 'AvatarName'

const AvatarLabel = React.forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithRef<'span'>
>(({ className, ...props }, ref) => {
	return (
		<span
			ref={ref}
			{...props}
			className={twMerge(
				'truncate text-xs font-normal text-muted-foreground',
				className,
			)}
		/>
	)
})

AvatarLabel.displayName = 'AvatarLabel'

// Componente Avatar
const Avatar = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={twMerge(
			'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
			className,
		)}
		{...props}
	/>
))

Avatar.displayName = 'Avatar'

// Componente AvatarImage
const AvatarImage = React.forwardRef<
	HTMLImageElement,
	ComponentPropsWithRef<'img'>
>(({ className, ...props }, ref) => (
	<img
		ref={ref}
		aria-hidden
		alt='User avatar'
		className={twMerge(
			'aspect-square h-full w-full object-cover',
			className,
		)}
		{...props}
	/>
))

AvatarImage.displayName = 'AvatarImage'

// Componente AvatarFallback
const AvatarFallback = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
	<div
		ref={ref}
		className={twMerge(
			'flex h-full w-full items-center justify-center rounded-full bg-muted-foreground',
			className,
		)}
		{...props}
	>
		{children}
	</div>
))

AvatarFallback.displayName = 'AvatarFallback'

export {
	Avatar,
	AvatarContainer,
	AvatarFallback,
	AvatarImage,
	AvatarLabel,
	AvatarName,
	AvatarWrapper,
}
