import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function useHandleSearchChange(searchParams: string) {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)

    const params = new URLSearchParams(searchParams)
    value ? params.set('search', value) : params.delete('search')

    router.push(`?${params.toString()}`)
  }

  return {
    searchTerm,
    setSearchTerm,
    handleSearchChange,
  }
}
