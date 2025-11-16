import { Button } from '@/components/ui/button'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { QuestStageForm } from './QuestStageForm'
import type { QuestFormData } from '../schemas/quest-form.schema'

export function QuestStagesSection() {
	const form = useFormContext<QuestFormData>()

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'stages',
	})

	return (
		<div>
			<div className='flex items-center justify-between mb-4'>
				<label className='block text-sm font-medium text-slate-700'>
					Этапы квеста *
				</label>
				<Button
					type='button'
					variant='outline'
					onClick={() =>
						append({
							title: '',
							description: '',
							status: 'pending',
							progress: 0,
						})
					}
					size='sm'
				>
					+ Добавить этап
				</Button>
			</div>

			<div className='space-y-4'>
				{fields.map((field, index) => (
					<QuestStageForm
						key={field.id}
						index={index}
						canRemove={fields.length > 1}
						onRemove={() => remove(index)}
					/>
				))}
			</div>
		</div>
	)
}

