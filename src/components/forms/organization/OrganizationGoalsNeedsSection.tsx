import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface OrganizationGoalsNeedsSectionProps {
	goals: string[]
	needs: string[]
	onAddGoal: () => void
	onRemoveGoal: (index: number) => void
	onUpdateGoal: (index: number, value: string) => void
	onAddNeed: () => void
	onRemoveNeed: (index: number) => void
	onUpdateNeed: (index: number, value: string) => void
}

export function OrganizationGoalsNeedsSection({
	goals,
	needs,
	onAddGoal,
	onRemoveGoal,
	onUpdateGoal,
	onAddNeed,
	onRemoveNeed,
	onUpdateNeed,
}: OrganizationGoalsNeedsSectionProps) {
	return (
		<div className='space-y-4'>
			<div>
				<label className='block text-sm font-medium text-slate-700 mb-2'>
					Цели
				</label>
				{goals.map((goal, index) => (
					<div key={index} className='flex gap-2 mb-2'>
						<Input
							value={goal}
							onChange={e => onUpdateGoal(index, e.target.value)}
							placeholder={`Цель ${index + 1}`}
							className='flex-1'
						/>
						{goals.length > 1 && (
							<Button
								type='button'
								variant='outline'
								onClick={() => onRemoveGoal(index)}
							>
								Удалить
							</Button>
						)}
					</div>
				))}
				<Button type='button' variant='outline' onClick={onAddGoal} className='mt-2'>
					+ Добавить цель
				</Button>
			</div>

			<div>
				<label className='block text-sm font-medium text-slate-700 mb-2'>
					Актуальные нужды
				</label>
				{needs.map((need, index) => (
					<div key={index} className='flex gap-2 mb-2'>
						<Input
							value={need}
							onChange={e => onUpdateNeed(index, e.target.value)}
							placeholder={`Нужда ${index + 1}`}
							className='flex-1'
						/>
						{needs.length > 1 && (
							<Button
								type='button'
								variant='outline'
								onClick={() => onRemoveNeed(index)}
							>
								Удалить
							</Button>
						)}
					</div>
				))}
				<Button type='button' variant='outline' onClick={onAddNeed} className='mt-2'>
					+ Добавить нужду
				</Button>
			</div>
		</div>
	)
}

