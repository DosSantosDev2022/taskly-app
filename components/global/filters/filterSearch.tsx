'use client'

import { Input } from '@/components/ui'
import { LuSearch } from 'react-icons/lu'

const FilterSearch = () => {
	return (
		<Input
			className='w-56 h-10'
			placeholder='Buscar...'
			icon={<LuSearch />}
			onChange={() => console.log()}
		/>
	)
}

export { FilterSearch }
