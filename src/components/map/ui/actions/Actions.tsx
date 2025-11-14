import { Button } from '@/components/ui/button'
import { FilterIcon, ListIcon } from 'lucide-react'

export const Actions = () => {
	return (
		<div className='absolute top-20 right-5 z-999 bg-background flex flex-col gap-2 p-2 rounded-lg shadow-lg'>
			<Button variant='ghost'>
				<FilterIcon className='w-4 h-4' />
			</Button>
			<Button variant='ghost'>
				<ListIcon className='w-4 h-4' />
			</Button>
		</div>
	)
}
