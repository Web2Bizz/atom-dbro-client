import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export type SocialFormData = {
	name: 'VK' | 'Telegram' | 'Website'
	url: string
}

interface QuestSocialsSectionProps {
	socials: SocialFormData[]
	onAdd: () => void
	onRemove: (index: number) => void
	onUpdate: (index: number, field: 'name' | 'url', value: string) => void
}

export function QuestSocialsSection({
	socials,
	onAdd,
	onRemove,
	onUpdate,
}: QuestSocialsSectionProps) {
	return (
		<div>
			<div className='flex items-center justify-between mb-2'>
				<label className='block text-sm font-medium text-slate-700'>
					Социальные сети (необязательно)
				</label>
				<Button type='button' variant='outline' onClick={onAdd} size='sm'>
					+ Добавить
				</Button>
			</div>

			<div className='space-y-2'>
				{socials.map((social, index) => (
					<div
						key={index}
						className='gap-2 items-start grid grid-rows-2 grid-cols-3 sm:flex '
					>
						<select
							value={social.name}
							onChange={e => onUpdate(index, 'name', e.target.value)}
							className=' h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm'
						>
							<option value='VK'>VK</option>
							<option value='Telegram'>Telegram</option>
							<option value='Website'>Website</option>
						</select>
						<Input
							type='url'
							value={social.url}
							onChange={e => onUpdate(index, 'url', e.target.value)}
							placeholder='https://...'
							className='flex-1 col-span-2'
						/>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => onRemove(index)}
							className='col-span-3 row-start-2'
						>
							Удалить
						</Button>
					</div>
				))}
			</div>
		</div>
	)
}
