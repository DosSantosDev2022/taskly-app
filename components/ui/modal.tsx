'use client'
import * as React from 'react'
import { type ReactNode, createContext, useContext, useState } from 'react'
import { X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

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
			className={twMerge('w-full', className)}
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

const ModalTrigger = React.forwardRef<
	HTMLButtonElement,
	React.HTMLAttributes<HTMLButtonElement> & {
		size?: 'sm' | 'lg' | 'xl' | 'full'
	}
>(({ className, size = 'full', ...props }, ref) => {
	const { toggleOpen } = useModalContext()
	const variantClasses = {
		sm: 'w-24',
		lg: 'w-36',
		xl: 'w-48',
		full: 'w-fulll',
	}

	return (
		<button
			aria-label='modal-trigger'
			value={'text'}
			onClick={toggleOpen}
			className={twMerge(
				' flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border px-2 py-1.5 text-sm',
				'bg-background text-foreground hover:bg-muted-hover ',
				'ring-offset-primary duration-300  focus:ring-ring active:scale-95',
				variantClasses[size],
				className,
			)}
			{...props}
			ref={ref}
		/>
	)
})

ModalTrigger.displayName = 'ModalTrigger'

const ModalClose = React.forwardRef<
	HTMLButtonElement,
	React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
	const { toggleOpen } = useModalContext()
	return (
		<button
			aria-label='modal-close'
			value={'text'}
			onClick={toggleOpen}
			className={twMerge(
				'flex h-7 w-7 items-center justify-center rounded-md bg-primary  text-primary-foreground hover:bg-primary-hover',
				className,
			)}
			{...props}
			ref={ref}
		>
			<X size={18} />
		</button>
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
						'w-3/4 space-y-2 border border-border bg-background p-3 shadow-lg sm:w-1/2 sm:rounded-lg sm:p-6',
						'data-[state=closed]:animate-modal-out data-[state=open]:animate-modal-in',
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
}
