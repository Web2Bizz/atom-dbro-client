import { Button } from '@/components/ui/button'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFieldArray, useFormContext } from 'react-hook-form'
import type { QuestFormData } from '../schemas/quest-form.schema'

export function QuestSocialsSection() {
	const form = useFormContext<QuestFormData>()

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'socials',
	})

	return (
		<div>
			<div className='flex items-center justify-between mb-2'>
				<FormLabel>Социальные сети (необязательно)</FormLabel>
				<Button
					type='button'
					variant='outline'
					onClick={() => append({ name: 'VK', url: '' })}
					size='sm'
				>
					+ Добавить
				</Button>
			</div>

			<div className='space-y-2'>
				{fields.map((field, index) => (
					<div key={field.id} className='gap-2 items-start grid grid-rows-2 grid-cols-3 sm:flex'>
						<FormField
							control={form.control}
							name={`socials.${index}.name`}
							render={({ field: nameField }) => (
								<FormItem>
									<FormControl>
										<select
											value={nameField.value ?? 'VK'}
											onChange={e =>
												nameField.onChange(
													e.target.value as 'VK' | 'Telegram' | 'Website'
												)
											}
											className='h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm'
										>
											<option value='VK'>VK</option>
											<option value='Telegram'>Telegram</option>
											<option value='Website'>Website</option>
										</select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={`socials.${index}.url`}
							render={({ field: urlField }) => (
								<FormItem className='col-span-2'>
									<FormControl>
										<Input
											type='url'
											{...urlField}
											value={urlField.value ?? ''}
											placeholder='https://...'
											className='flex-1'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => remove(index)}
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

