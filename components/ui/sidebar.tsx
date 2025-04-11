'use client'
import React, {
	createContext,
	type ElementRef,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import { ChevronFirst, ChevronLast } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { Button } from './button'

// Contextos de Sidebar e Dropdown
interface SideBarContextProps {
	isOpenSideBar: boolean
	toggle: () => void
}

interface DropDownContextProps {
	isOpenDropDown: boolean
	toggle: () => void
}

const SideBarContext = createContext<SideBarContextProps | undefined>(
	undefined,
)
const DropDownContext = createContext<DropDownContextProps | undefined>(
	undefined,
)

const useSideBarContext = () => {
	const context = useContext(SideBarContext)
	if (!context) {
		throw new Error(
			'useSideBarContext must be used within a SideBarProvider',
		)
	}
	return context
}

const useDropDownContext = () => {
	const context = useContext(DropDownContext)
	if (!context) {
		throw new Error(
			'useDropDownContext must be used within a DropDownProvider',
		)
	}
	return context
}

// Providers para Sidebar e Dropdown
const SideBarProvider = ({ children }: { children: ReactNode }) => {
	const [isOpenSideBar, setIsOpen] = useState(false)
	const toggle = () => setIsOpen((prev) => !prev)
	return (
		<SideBarContext.Provider value={{ isOpenSideBar, toggle }}>
			{children}
		</SideBarContext.Provider>
	)
}

const DropDownProvider = ({ children }: { children: ReactNode }) => {
	const [isOpenDropDown, setIsOpen] = useState(false)
	const toggle = () => setIsOpen((prev) => !prev)
	return (
		<DropDownContext.Provider value={{ isOpenDropDown, toggle }}>
			{children}
		</DropDownContext.Provider>
	)
}

const SideBarRoot = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<'div'>
>(({ className, ...props }, ref) => (
	<SideBarProvider>
		<div ref={ref} {...props} />
	</SideBarProvider>
))

const SideBar = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<'div'>
>(({ className, children, ...props }, ref) => {
	const { isOpenSideBar } = useSideBarContext()

	return (
		<div
			data-state={isOpenSideBar ? 'open' : 'closed'}
			aria-label='sidebar'
			ref={ref}
			{...props}
			className={twMerge(
				'hidden h-full flex-col justify-between border border-border bg-background p-4 lg:flex',
				'overflow-visible transition-all duration-500',
				isOpenSideBar ? 'fixed z-50 w-72 lg:relative lg:z-0' : 'w-20',
				className,
			)}
		>
			{children}
		</div>
	)
})

SideBar.displayName = 'SideBar'

const SideBarTrigger = React.forwardRef<
	ElementRef<typeof Button>,
	React.ComponentPropsWithRef<typeof Button>
>(({ className, ...props }, ref) => {
	const { toggle, isOpenSideBar } = useSideBarContext()
	return (
		<Button
			variants='accent'
			sizes='icon'
			onClick={toggle}
			aria-expanded={isOpenSideBar}
			{...props}
			className={twMerge(
				'absolute -right-6 top-2 z-20 p-1 duration-300 active:scale-95',
				className,
			)}
			ref={ref}
		>
			{isOpenSideBar ? <ChevronFirst /> : <ChevronLast />}
		</Button>
	)
})

SideBarTrigger.displayName = 'SideBarTrigger'

const SideBarLogo = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<'div'> & { label?: string; icon?: ReactNode }
>(({ className, label, icon, ...props }, ref) => {
	const { isOpenSideBar } = useSideBarContext()
	return (
		<div
			ref={ref}
			{...props}
			className={twMerge('flex w-full items-center  space-x-1', className)}
		>
			{icon}
			<span
				className={twMerge(
					'text-3xl font-extrabold text-primary dark:text-primary-foreground ',
					`overflow-hidden transition-all duration-300 ${isOpenSideBar ? 'ml-1 w-full' : 'w-0'}`,
				)}
			>
				{label}
			</span>
		</div>
	)
})

SideBarLogo.displayName = 'SideBarLogo'

const SideBarHeader = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<'div'> & { trigger?: boolean }
>(({ className, trigger = false, ...props }, ref) => {
	return (
		<div
			data-sidebar='Header'
			{...props}
			className={twMerge(
				'relative mb-10 flex w-full items-center justify-between gap-4 p-2',
				className,
			)}
			ref={ref}
		>
			{trigger && <SideBarTrigger />}
			{props.children}
		</div>
	)
})

SideBarHeader.displayName = 'SideBarHeader'

const SideBarContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<'div'>
>(({ className, ...props }, ref) => {
	return (
		<div
			data-sidebar='Content'
			{...props}
			ref={ref}
			className={twMerge(
				'custom-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto',
				className,
			)}
		/>
	)
})

SideBarContent.displayName = 'SideBarContent'

const SideBarFooter = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<'div'>
>(({ className, ...props }, ref) => {
	const { isOpenSideBar } = useSideBarContext()
	return (
		<div
			data-sidebar='Footer'
			ref={ref}
			{...props}
			className={twMerge(
				`${isOpenSideBar ? 'flex w-full flex-col items-start p-2' : 'hidden'}`,
				'',
				className,
			)}
		/>
	)
})

SideBarFooter.displayName = 'SideBarFooter'

const SideBarSeparator = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<'div'>
>(({ className, ...props }, ref) => (
	<div
		data-sidebar='separator'
		ref={ref}
		{...props}
		className={twMerge('mx-2 w-auto bg-border', className)}
	/>
))

SideBarSeparator.displayName = 'SideBarSeparator'

const SideBarLabel = React.forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithRef<'span'> & { label?: string }
>(({ className, label, ...props }, ref) => {
	const { isOpenSideBar } = useSideBarContext()
	return (
		isOpenSideBar && (
			<span
				data-sidebar='separator'
				ref={ref}
				{...props}
				className={twMerge(
					'ml-1 truncate text-sm font-medium text-muted',
					className,
				)}
			>
				{label}
			</span>
		)
	)
})

SideBarLabel.displayName = 'SideBarLabel'

const SideBarTooltip = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<'div'>
>(({ ...props }, ref) => {
	return (
		<div
			ref={ref}
			{...props}
			className={twMerge(
				'absolute left-16 z-50 ml-2',
				' whitespace-nowrap rounded-md bg-accent px-2 py-1.5 text-sm text-accent-foreground shadow-md',
				'invisible opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100',
			)}
		>
			{props.children}
		</div>
	)
})

SideBarTooltip.displayName = 'SideBarTooltip'

const SideBarNavigation = React.forwardRef<
	HTMLElement,
	React.ComponentPropsWithRef<'nav'>
>(({ className, ...props }, ref) => {
	return (
		<nav
			ref={ref}
			{...props}
			className={twMerge('space-y-3', className)}
		/>
	)
})

SideBarNavigation.displayName = 'SideBarNavigation'

//  Navegação links
const SideBarList = React.forwardRef<
	HTMLUListElement,
	React.ComponentPropsWithRef<'ul'>
>(({ className, children, ...props }, ref) => {
	return (
		<ul ref={ref} {...props} className={twMerge('space-y-3', className)}>
			{children}
		</ul>
	)
})
SideBarList.displayName = 'SideBarList'

const SideBarItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentPropsWithRef<'li'> & {
		icon?: ReactNode
		tooltip?: string
	}
>(({ className, children, icon, tooltip, ...props }, ref) => {
	const { isOpenSideBar } = useSideBarContext()

	return (
		<li
			ref={ref}
			{...props}
			className={twMerge(
				'group mt-1 cursor-pointer list-none rounded-md px-1.5 py-2',
				' text-sm text-foreground hover:bg-muted-hover',
				'flex items-center space-x-3 w-full justify-center',
				className,
				!isOpenSideBar && 'space-x-0 w-full',
			)}
		>
			<span className='relative'>{icon}</span>

			{!isOpenSideBar && <SideBarTooltip>{tooltip}</SideBarTooltip>}

			<span
				className={`overflow-hidden transition-all duration-300 ${isOpenSideBar ? 'w-full' : 'w-0'}`}
			>
				{children}
			</span>
		</li>
	)
})
SideBarItem.displayName = 'SideBarItem'

// Navegação Dropdown
const SideBarDropRoot = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<'div'>
>(({ className, ...props }, ref) => {
	return (
		<DropDownProvider>
			<div
				ref={ref}
				{...props}
				className={twMerge('mt-1 space-y-1', className)}
			/>
		</DropDownProvider>
	)
})

SideBarDropRoot.displayName = 'SideBarDropRoot'

const SideBarDropTrigger = React.forwardRef<
	ElementRef<typeof Button>,
	React.ComponentPropsWithRef<typeof Button> & {
		icon?: ReactNode
		tooltip?: string
	}
>(({ className, icon, tooltip, ...props }, ref) => {
	const { isOpenSideBar } = useSideBarContext()
	const { toggle } = useDropDownContext()
	return (
		<button
			variants='ghost'
			onClick={toggle}
			ref={ref}
			{...props}
			className={twMerge(
				'group mt-1 cursor-pointer w-full rounded-md px-1.5 py-2 flex items-center justify-center space-x-1',
				'text-sm text-foreground hover:bg-muted-hover',
				className,
				!isOpenSideBar && 'space-x-0 w-full',
			)}
		>
			<span className='relative'>{icon}</span>
			{!isOpenSideBar && <SideBarTooltip>{tooltip}</SideBarTooltip>}
			<span
				className={`flex items-start overflow-hidden transition-all duration-300 ${isOpenSideBar ? 'w-full' : 'w-0'}`}
			>
				{props.children}
			</span>
		</button>
	)
})
SideBarDropTrigger.displayName = 'SideBarDropTrigger'

const SideBarDropGroup = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<'div'>
>(({ className, children, ...props }, ref) => {
	const { isOpenDropDown } = useDropDownContext()
	const { isOpenSideBar } = useSideBarContext()
	return (
		isOpenDropDown && (
			<div
				ref={ref}
				{...props}
				className={twMerge(
					'flex flex-col space-y-1 rounded-md bg-background p-1.5',
					isOpenSideBar ? 'relative' : 'absolute shadow-md',
					'custom-scrollbar max-h-60 overflow-y-auto',
					'transition-all duration-300',
					'z-50  border border-accent',
					className,
				)}
			>
				{children}
			</div>
		)
	)
})
SideBarDropGroup.displayName = 'SideBarDropGroup'

const SideBarDropList = React.forwardRef<
	HTMLUListElement,
	React.ComponentPropsWithRef<'ul'>
>(({ className, children, ...props }, ref) => {
	return (
		<ul ref={ref} {...props} className={twMerge('mt-1', className)}>
			{children}
		</ul>
	)
})
SideBarDropList.displayName = 'SideBarDropList'

const SideBarDropItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentPropsWithRef<'li'>
>(({ className, children, ...props }, ref) => {
	return (
		<li
			ref={ref}
			{...props}
			className={twMerge(
				'flex cursor-pointer list-none truncate rounded-md px-1.5 py-2 text-sm text-muted-foreground hover:bg-muted-hover',
				className,
			)}
		>
			{children}
		</li>
	)
})
SideBarDropItem.displayName = 'SideBarDropItem'

export {
	SideBar,
	SideBarContent,
	SideBarDropGroup,
	SideBarDropItem,
	SideBarDropList,
	SideBarDropRoot,
	SideBarDropTrigger,
	SideBarFooter,
	SideBarHeader,
	SideBarItem,
	SideBarLabel,
	SideBarList,
	SideBarLogo,
	SideBarNavigation,
	SideBarRoot,
	SideBarSeparator,
	SideBarTrigger,
}
