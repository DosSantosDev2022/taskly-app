'use client'
import { TbListDetails } from 'react-icons/tb'

import {
	PopoverRoot,
	PopoverTrigger,
	PopoverContent,
} from '@/components/global/popover'
import { MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui'
import { useState } from 'react'

interface ActionTableProps {
	id: string
	path: string
}

const ActionTable = ({ id, path }: ActionTableProps) => {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<PopoverRoot isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
			<PopoverTrigger sizes='icon' variants='link'>
				<MoreVertical size={18} />
			</PopoverTrigger>
			<PopoverContent
				alignment='bottom'
				className='w-40 bg-background rounded shadow-lg p-1.5 space-y-2'
			>
				<Button className='h-8' sizes='full' asChild variants='ghost'>
					<Link href={`/${path}/${id}`} className='block text-sm'>
						<TbListDetails />
						Ver detalhes
					</Link>
				</Button>
				<Button className='text-sm h-8' sizes='full' variants='ghost'>
					Excluir
				</Button>
				<Button className='text-sm h-8' sizes='full' variants='ghost'>
					Ver detalhes
				</Button>
			</PopoverContent>
		</PopoverRoot>
	)
}

export { ActionTable }
