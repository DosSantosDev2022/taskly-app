'use client'
import * as React from 'react'
import { type ReactNode, createContext, useContext, useState } from 'react'
import { X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { Button, type ButtonProps } from './button'
import { ImSpinner9 } from 'react-icons/im'

interface ModalContextProps {
	isOpen: boolean
	toggleOpen: () => void
	closeModal: () => void
}

const ModalContext = createContext<ModalContextProps | undefined>(
	undefined,
)

const useModalContext = () => {
	const context = useContext(ModalContext)
	if (!context) {
		throw new Error(
			'Modal components must be used withim a Modal provider',
		)
	}
	return context
}

const ModalProvider = ({
	children,
	open,
	onOpenChange,
}: {
	children: ReactNode
	open?: boolean
	onOpenChange?: (isOpen: boolean) => void
}) => {
	const [internalOpen, setInternalOpen] = useState(false)
	// Determina o estado atual com prioridade para o prop `open`
	const isOpen = open !== undefined ? open : internalOpen

	const toggleOpen = () => {
		const newState = !isOpen
		if (onOpenChange) {
			onOpenChange(newState)
		} else {
			setInternalOpen(newState)
		}
	}

	const closeModal = () => {
		if (onOpenChange) {
			onOpenChange(false)
		} else {
			setInternalOpen(false)
		}
	}

	return (
		<ModalContext.Provider value={{ isOpen, toggleOpen, closeModal }}>
			{children}
		</ModalContext.Provider>
	)
}

const ModalRoot = ({
	className,
	open,
	onOpenChange,
	...props
}: React.HTMLAttributes<HTMLDivElement> & {
	open?: boolean
	onOpenChange?: (isOpen: boolean) => void
}) => (
	<ModalProvider open={open} onOpenChange={onOpenChange}>
		<div
			aria-label='modal-root'
			className={twMerge('', className)}
			{...props}
		/>
	</ModalProvider>
)

ModalRoot.displayName = 'ModalRoot'

const ModalHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		aria-label='modal-header'
		className={twMerge(
			'flex w-full items-center justify-between gap-2 px-1 py-1.5',
			className,
		)}
		{...props}
	/>
)

ModalHeader.displayName = 'ModalHeader'

const ModalTitle = ({
	className,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
	<h4
		aria-label='modal-title'
		className={twMerge(
			'text-lg font-semibold leading-none tracking-tight text-foreground sm:text-xl',
			className,
		)}
		{...props}
	/>
)

ModalTitle.displayName = 'ModalTitle'

const ModalDescription = ({
	className,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
	<p
		aria-label='modal-title'
		className={twMerge(
			'px-1 py-1.5 text-sm text-muted-foreground',
			className,
		)}
		{...props}
	/>
)

ModalDescription.displayName = 'ModalDescription'

const ModalFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		aria-label='modal-footer'
		className={twMerge(
			'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
			className,
		)}
		{...props}
	/>
)
ModalFooter.displayName = 'ModalFooter'

const ModalOverlay = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		variant?: 'blur' | 'dark' | 'darkBlur'
	}
>(({ className, variant = 'blur', ...props }, ref) => {
	const { isOpen } = useModalContext()
	if (!isOpen) return null

	const variantClasses = {
		blur: 'backdrop-blur-sm',
		darkBlur: 'backdrop-blur-sm bg-black/50',
		dark: 'bg-black/50',
	}

	return (
		<div
			aria-label='Modal-Overlay'
			className={twMerge(
				'fixed inset-0 z-50',
				variantClasses[variant],
				className,
			)}
			ref={ref}
			{...props}
		/>
	)
})

ModalOverlay.displayName = 'ModalOverlay'

const ModalTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, ...props }, ref) => {
		const { toggleOpen } = useModalContext()

		return (
			<Button
				aria-label='modal-trigger'
				value={'text'}
				onClick={toggleOpen}
				className={twMerge('', className)}
				{...props}
				ref={ref}
			/>
		)
	},
)

ModalTrigger.displayName = 'ModalTrigger'

const ModalClose = React.forwardRef<
	HTMLButtonElement,
	ButtonProps & { icon?: boolean }
>(({ className, icon, ...props }, ref) => {
	const { toggleOpen } = useModalContext()
	return (
		<Button
			aria-label='modal-close'
			value={'text'}
			onClick={toggleOpen}
			className={twMerge('', className)}
			{...props}
			ref={ref}
		>
			{props.children}
			{icon && <X size={18} />}
		</Button>
	)
})
ModalClose.displayName = 'ModalClose'

const ModalContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	const { isOpen } = useModalContext()

	return (
		isOpen && (
			<div
				aria-label='modal-content'
				className='fixed inset-0 z-50 flex items-center justify-center'
			>
				<div
					data-state={isOpen ? 'open' : 'closed'}
					className={twMerge(
						'space-y-2 border border-border bg-background p-6 shadow-lg w-full max-w-2xl sm:rounded-lg sm:p-6',
						'data-[state=closed]:animate-modal-out data-[state=open]:animate-modal-in',
						'transition-all duration-200',
						className,
					)}
					ref={ref}
					{...props}
				/>
			</div>
		)
	)
})

ModalContent.displayName = 'ModalContent'

const ModalLoading = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	return (
		<div
			{...props}
			ref={ref}
			className={twMerge(
				'absolute inset-0 z-50 flex items-center justify-center',
				'bg-background/50 backdrop-blur-sm rounded-lg',
				className,
			)}
		>
			<ImSpinner9 size={64} className='text-primary animate-spin' />
		</div>
	)
})

ModalLoading.displayName = 'ModalLoading'

export {
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	ModalRoot,
	ModalTitle,
	ModalTrigger,
	useModalContext,
	ModalLoading,
}
