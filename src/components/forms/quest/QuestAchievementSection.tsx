import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trophy, X } from 'lucide-react'

interface QuestAchievementSectionProps {
	customAchievement?: {
		icon: string
		title: string
		description: string
	}
	onChange: (
		achievement:
			| {
					icon: string
					title: string
					description: string
			  }
			| undefined
	) => void
}

export function QuestAchievementSection({
	customAchievement,
	onChange,
}: QuestAchievementSectionProps) {
	const hasAchievement = !!customAchievement

	const handleToggle = () => {
		if (hasAchievement) {
			onChange(undefined)
		} else {
			onChange({
				icon: '🏆',
				title: '',
				description: '',
			})
		}
	}

	const handleChange = (
		field: 'icon' | 'title' | 'description',
		value: string
	) => {
		if (!customAchievement) return
		onChange({
			...customAchievement,
			[field]: value,
		})
	}

	return (
		<div className='space-y-4 rounded-lg border border-slate-200 bg-white p-6'>
			<div className=' items-center justify-center sm:justify-between grid grid-rows-2 sm:flex '>
				<div className=' items-center gap-2 flex'>
					<Trophy className='h-5 w-5 text-amber-500' />
					<h3 className='text-lg font-semibold text-slate-900'>
						Пользовательское достижение
					</h3>
				</div>
				<Button
					type='button'
					variant={hasAchievement ? 'destructive' : 'outline'}
					size='sm'
					onClick={handleToggle}
				>
					{hasAchievement ? (
						<>
							<X className='h-4 w-4 mr-1' />
							Удалить
						</>
					) : (
						<>Добавить достижение</>
					)}
				</Button>
			</div>

			{hasAchievement && (
				<div className='space-y-4 rounded-lg border border-amber-200 bg-amber-50/50 p-4'>
					<p className='text-sm text-slate-600'>
						Это достижение будет выдано участникам квеста при его завершении на
						100%. Вы можете указать эмодзи, название и описание.
					</p>

					<div className='space-y-4'>
						{/* Эмодзи */}
						<div>
							<label
								htmlFor='achievement-icon'
								className='block text-sm font-medium text-slate-700 mb-2'
							>
								Эмодзи <span className='text-red-500'>*</span>
							</label>
							<div className='flex items-center gap-2'>
								<Input
									id='achievement-icon'
									type='text'
									value={customAchievement.icon}
									onChange={e => handleChange('icon', e.target.value)}
									placeholder='🏆'
									maxLength={2}
									className='w-20 text-2xl text-center'
								/>
								<div className='text-sm text-slate-500'>
									Введите эмодзи (1-2 символа)
								</div>
							</div>
						</div>

						{/* Название */}
						<div>
							<label
								htmlFor='achievement-title'
								className='block text-sm font-medium text-slate-700 mb-2'
							>
								Название достижения <span className='text-red-500'>*</span>
							</label>
							<Input
								id='achievement-title'
								type='text'
								value={customAchievement.title}
								onChange={e => handleChange('title', e.target.value)}
								placeholder='Герой экологии'
								maxLength={50}
							/>
						</div>

						{/* Описание */}
						<div>
							<label
								htmlFor='achievement-description'
								className='block text-sm font-medium text-slate-700 mb-2'
							>
								Описание достижения <span className='text-red-500'>*</span>
							</label>
							<textarea
								id='achievement-description'
								value={customAchievement.description}
								onChange={e => handleChange('description', e.target.value)}
								placeholder='Завершил квест по очистке парка от мусора'
								maxLength={200}
								rows={3}
								className='w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							/>
							<div className='text-xs text-slate-500 mt-1'>
								{customAchievement.description.length}/200 символов
							</div>
						</div>

						{/* Предпросмотр */}
						{customAchievement.icon &&
							customAchievement.title &&
							customAchievement.description && (
								<div className='rounded-lg border border-slate-200 bg-white p-4'>
									<p className='text-xs font-medium text-slate-500 mb-2'>
										Предпросмотр:
									</p>
									<div className='flex items-start gap-3'>
										<div className='text-3xl'>{customAchievement.icon}</div>
										<div className='flex-1'>
											<h4 className='font-semibold text-slate-900'>
												{customAchievement.title}
											</h4>
											<p className='text-sm text-slate-600 mt-1'>
												{customAchievement.description}
											</p>
										</div>
									</div>
								</div>
							)}
					</div>
				</div>
			)}

			{!hasAchievement && (
				<p className='text-sm text-slate-500'>
					Вы можете добавить пользовательское достижение, которое будет выдано
					участникам квеста при его завершении на 100%.
				</p>
			)}
		</div>
	)
}
