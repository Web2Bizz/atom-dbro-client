import { Input } from '@/components/ui/input'

interface QuestCuratorSectionProps {
	curatorName: string
	curatorPhone: string
	curatorEmail: string
	onChange: (field: 'curatorName' | 'curatorPhone' | 'curatorEmail', value: string) => void
}

export function QuestCuratorSection({
	curatorName,
	curatorPhone,
	curatorEmail,
	onChange,
}: QuestCuratorSectionProps) {
	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
			<div>
				<label
					htmlFor='curator-name'
					className='block text-sm font-medium text-slate-700 mb-2'
				>
					Имя куратора *
				</label>
				<Input
					id='curator-name'
					value={curatorName}
					onChange={e => onChange('curatorName', e.target.value)}
					required
				/>
			</div>

			<div>
				<label
					htmlFor='curator-phone'
					className='block text-sm font-medium text-slate-700 mb-2'
				>
					Телефон *
				</label>
				<Input
					id='curator-phone'
					type='tel'
					value={curatorPhone}
					onChange={e => onChange('curatorPhone', e.target.value)}
					required
					placeholder='+7 (XXX) XXX-XX-XX'
				/>
			</div>

			<div>
				<label
					htmlFor='curator-email'
					className='block text-sm font-medium text-slate-700 mb-2'
				>
					Email
				</label>
				<Input
					id='curator-email'
					type='email'
					value={curatorEmail}
					onChange={e => onChange('curatorEmail', e.target.value)}
					placeholder='email@example.com'
				/>
			</div>
		</div>
	)
}

