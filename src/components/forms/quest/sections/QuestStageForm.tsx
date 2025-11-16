import { Button } from '@/components/ui/button'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import type { QuestFormData } from '../schemas/quest-form.schema'

interface QuestStageFormProps {
	index: number
	canRemove: boolean
	onRemove: () => void
}

export function QuestStageForm({
	index,
	canRemove,
	onRemove,
}: QuestStageFormProps) {
	const form = useFormContext<QuestFormData>()

	const hasFinancial = form.watch(`stages.${index}.hasFinancial`)
	const hasVolunteers = form.watch(`stages.${index}.hasVolunteers`)
	const hasItems = form.watch(`stages.${index}.hasItems`)

	return (
		<div className='border border-slate-200 rounded-lg p-4 bg-slate-50'>
			<div className='flex items-center justify-between mb-3'>
				<h3 className='text-sm font-semibold text-slate-900'>Этап {index + 1}</h3>
				{canRemove && (
					<Button type='button' variant='outline' size='sm' onClick={onRemove}>
						Удалить
					</Button>
				)}
			</div>

			<div className='space-y-3'>
				<FormField
					control={form.control}
					name={`stages.${index}.title`}
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-xs font-medium text-slate-600'>
								Название этапа *
							</FormLabel>
							<FormControl>
								<Input
									placeholder='Например: Закупка материалов'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name={`stages.${index}.description`}
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-xs font-medium text-slate-600'>
								Описание этапа *
							</FormLabel>
							<FormControl>
								<textarea
									{...field}
									rows={2}
									className='w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm'
									placeholder='Описание этапа...'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='grid grid-cols-2 gap-3'>
					<FormField
						control={form.control}
						name={`stages.${index}.status`}
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-xs font-medium text-slate-600'>
									Статус
								</FormLabel>
								<FormControl>
									<select
										value={field.value}
										onChange={e => field.onChange(e.target.value)}
										className='w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm'
									>
										<option value='pending'>Ожидает</option>
										<option value='in_progress'>В процессе</option>
										<option value='completed'>Завершен</option>
									</select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name={`stages.${index}.progress`}
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-xs font-medium text-slate-600'>
									Прогресс (%)
								</FormLabel>
								<FormControl>
									<Input
										type='number'
										min={0}
										max={100}
										{...field}
										value={field.value || 0}
										onChange={e => field.onChange(Number(e.target.value))}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Требования */}
				<div className='space-y-2 pt-2 border-t border-slate-200'>
					<p className='text-xs font-medium text-slate-600 mb-2'>
						Требования этапа (необязательно)
					</p>

					<div className='space-y-4 pr-4'>
						<FormField
							control={form.control}
							name={`stages.${index}.hasFinancial`}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<label className='flex items-center gap-2'>
											<input
												type='checkbox'
												checked={field.value || false}
												onChange={e => field.onChange(e.target.checked)}
												className='w-4 h-4 rounded border-slate-300'
											/>
											<span className='text-xs text-slate-700'>
												Требуется финансовая поддержка
											</span>
										</label>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{hasFinancial && (
							<FormField
								control={form.control}
								name={`stages.${index}.financialNeeded`}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												type='number'
												min={0}
												{...field}
												value={field.value || ''}
												onChange={e => field.onChange(Number(e.target.value))}
												placeholder='Сумма (руб.)'
												className='ml-6'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name={`stages.${index}.hasVolunteers`}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<label className='flex items-center gap-2'>
											<input
												type='checkbox'
												checked={field.value || false}
												onChange={e => field.onChange(e.target.checked)}
												className='w-4 h-4 rounded border-slate-300'
											/>
											<span className='text-xs text-slate-700'>
												Требуются волонтеры
											</span>
										</label>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{hasVolunteers && (
							<FormField
								control={form.control}
								name={`stages.${index}.volunteersNeeded`}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												type='number'
												min={0}
												{...field}
												value={field.value || ''}
												onChange={e => field.onChange(Number(e.target.value))}
												placeholder='Количество волонтеров'
												className='ml-6'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name={`stages.${index}.hasItems`}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<label className='flex items-center gap-2'>
											<input
												type='checkbox'
												checked={field.value || false}
												onChange={e => field.onChange(e.target.checked)}
												className='w-4 h-4 rounded border-slate-300'
											/>
											<span className='text-xs text-slate-700'>
												Требуются предметы/материалы
											</span>
										</label>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{hasItems && (
							<div className='ml-6 space-y-2'>
								<FormField
									control={form.control}
									name={`stages.${index}.itemName`}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													placeholder='Название предмета'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`stages.${index}.itemsNeeded`}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type='number'
													min={0}
													{...field}
													value={field.value || ''}
													onChange={e => field.onChange(Number(e.target.value))}
													placeholder='Количество'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}
					</div>

					<FormField
						control={form.control}
						name={`stages.${index}.deadline`}
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-xs font-medium text-slate-600'>
									Дедлайн (необязательно)
								</FormLabel>
								<FormControl>
									<Input type='date' {...field} value={field.value || ''} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>
		</div>
	)
}

