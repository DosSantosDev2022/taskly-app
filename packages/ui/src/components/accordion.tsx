'use client'
import type React from 'react'
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface AccordionContextProps {
	isOpen: boolean
	toggleOpen: () => void
}

const AccordionContext = createContext<AccordionContextProps | undefined>(
	undefined,
)

const useAccordionContext = () => {
	const context = useContext(AccordionContext)
	if (!context) {
		throw new Error(
			'Accordion components must be used within a Accordion provider',
		)
	}
	return context
}

const AccordionProvider = ({ children }: { children: ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false)
	const toggleOpen = () => setIsOpen((prev) => !prev)

	return (
		<AccordionContext.Provider value={{ isOpen, toggleOpen }}>
			{children}
		</AccordionContext.Provider>
	)
}

const AccordionContainer = ({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<AccordionProvider>
		<div {...props} className={twMerge('relative w-full', className)}>
			{children}
		</div>
	</AccordionProvider>
)

const AccordionTrigger = ({
	className,
	children,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	const { toggleOpen, isOpen } = useAccordionContext()
	const triggerId = 'accordion-trigger'
	const contentId = 'accordion-content'
	return (
		<button
			{...props}
			aria-expanded={isOpen}
			aria-controls={contentId}
			id={triggerId}
			onClick={toggleOpen}
			className={twMerge(
				'flex h-16 w-full items-center justify-between gap-2',
				'rounded-t-md border border-border px-4 py-2 focus:outline-none',
				className,
			)}
		>
			{children}
			<ChevronDownIcon
				className={twMerge(
					'h-4 w-4 shrink-0 transition-transform duration-500 ease-in-out',
					` ${isOpen ? 'rotate-180' : ''}`,
					'text-foreground',
				)}
			/>
		</button>
	)
}

const AccordionContent = ({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	const { isOpen } = useAccordionContext()
	const contentId = 'accordion-content'
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (contentRef.current) {
			const contentHeight = contentRef.current.scrollHeight
			contentRef.current.style.setProperty(
				'--accordion-content-height',
				`${contentHeight}px`,
			)
		}
	}, [])

	return (
		<div
			aria-label='accordion-content'
			data-state={isOpen ? 'open' : 'closed'}
			aria-hidden={!isOpen}
			id={contentId}
			{...props}
			className={twMerge(
				'overflow-hidden transition-all',
				isOpen
					? 'data-[state=open]:animate-accordion-down'
					: 'h-0 data-[state=closed]:animate-accordion-up',
				className,
			)}
			ref={contentRef}
		>
			<div className='my-1 rounded-b-md px-4 py-2'>{children}</div>
		</div>
	)
}

const AccordionQuestion = ({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
	<span
		className={twMerge(
			'text-start text-sm font-semibold text-foreground sm:text-lg',
			className,
		)}
		{...props}
	/>
)
AccordionQuestion.displayName = 'AccordionQuestion'

const AccordionAnswer = ({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
	<span
		className={twMerge(
			'text-start text-sm text-foreground sm:text-lg',
			className,
		)}
		{...props}
	/>
)
AccordionAnswer.displayName = 'AccordionAnswer'

export {
	AccordionAnswer,
	AccordionContainer,
	AccordionContent,
	AccordionContext,
	AccordionQuestion,
	AccordionTrigger,
}
