import { Button } from '@/components/ui/button'
import { QuestStageForm, type StageFormData } from './QuestStageForm'

interface QuestStagesSectionProps {
	stages: StageFormData[]
	onAdd: () => void
	onRemove: (index: number) => void
	onUpdate: (index: number, field: keyof StageFormData, value: unknown) => void
}

export function QuestStagesSection({
	stages,
	onAdd,
	onRemove,
	onUpdate,
}: QuestStagesSectionProps) {
	return (
		<div>
			<div className='flex items-center justify-between mb-4'>
				<label className='block text-sm font-medium text-slate-700'>
					Этапы квеста *
				</label>
				<Button type='button' variant='outline' onClick={onAdd} size='sm'>
					+ Добавить этап
				</Button>
			</div>

			<div className='space-y-4'>
				{stages.map((stage, index) => (
					<QuestStageForm
						key={index}
						stage={stage}
						index={index}
						canRemove={stages.length > 1}
						onUpdate={(field, value) => onUpdate(index, field, value)}
						onRemove={() => onRemove(index)}
					/>
				))}
			</div>
		</div>
	)
}

