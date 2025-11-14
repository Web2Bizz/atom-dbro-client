import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface QuestLocationSectionProps {
	address: string
	onAddressChange: (address: string) => void
	onOpenMap: () => void
	city: string
}

export function QuestLocationSection({
	address,
	onAddressChange,
	onOpenMap,
	city,
}: QuestLocationSectionProps) {
	return (
		<div>
			<label
				htmlFor='quest-address'
				className='block text-sm font-medium text-slate-700 mb-2'
			>
				Адрес *
			</label>
			<div className='flex gap-2'>
				<Input
					id='quest-address'
					value={address}
					onChange={e => onAddressChange(e.target.value)}
					required
					placeholder='Например: ул. Ленина, 10'
					className='flex-1'
				/>
				<Button
					type='button'
					variant='outline'
					onClick={onOpenMap}
					disabled={!city}
				>
					Найти на карте
				</Button>
			</div>
		</div>
	)
}

