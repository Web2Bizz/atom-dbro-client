import { ASSISTANCE_OPTIONS } from '@/constants'
import type { AssistanceTypeId } from '@/types/common'

interface OrganizationAssistanceSectionProps {
	assistance: AssistanceTypeId[]
	onToggle: (id: AssistanceTypeId) => void
}

export function OrganizationAssistanceSection({
	assistance,
	onToggle,
}: OrganizationAssistanceSectionProps) {
	return (
		<div>
			<label className='block text-sm font-medium text-slate-700 mb-2'>
				Вид помощи *
			</label>
			<div className='grid grid-cols-2 gap-2'>
				{ASSISTANCE_OPTIONS.map(option => (
					<label
						key={option.id}
						className='flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-50'
					>
						<input
							type='checkbox'
							checked={assistance.includes(option.id)}
							onChange={() => onToggle(option.id)}
							className='w-4 h-4 rounded border-slate-300 text-blue-600'
						/>
						<span className='text-sm text-slate-700'>{option.label}</span>
					</label>
				))}
			</div>
		</div>
	)
}

