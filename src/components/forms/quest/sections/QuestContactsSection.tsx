import { Button } from '@/components/ui/button'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import type { QuestFormData } from '../schemas/quest-form.schema'

export function QuestContactsSection() {
	const form = useFormContext<QuestFormData>()

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'contacts',
	})

	return (
		<div className='space-y-4'>
			<FormLabel>Контакты *</FormLabel>
			{fields.map((field, index) => (
				<div key={field.id} className='flex flex-col gap-2'>
					{/* Первая строка: select и кнопка удаления */}
					<div className='flex gap-2 items-end'>
						<FormField
							control={form.control}
							name={`contacts.${index}.name`}
							render={({ field: nameField }) => (
								<FormItem className='flex-1 min-w-0 sm:min-w-[140px]'>
									<FormControl>
										<select
											{...nameField}
											className='w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
										>
											<option value='Куратор'>Куратор</option>
											<option value='Телефон'>Телефон</option>
											<option value='Email'>Email</option>
											<option value='WhatsApp'>WhatsApp</option>
											<option value='Telegram'>Telegram</option>
											<option value='Вконтакте'>Вконтакте</option>
											<option value='TicTok'>TicTok</option>
											<option value='Другое'>Другое</option>
										</select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{fields.length > 1 && (
							<Button
								type='button'
								variant='outline'
								size='icon'
								onClick={() => remove(index)}
								className='h-9 w-9 shrink-0'
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						)}
					</div>
					{/* Вторая строка: input */}
					<FormField
						control={form.control}
						name={`contacts.${index}.value`}
						render={({ field: valueField }) => (
							<FormItem className='w-full'>
								<FormControl>
									<Input
										placeholder={
											form.watch(`contacts.${index}.name`) === 'Телефон'
												? '+7 (XXX) XXX-XX-XX'
												: form.watch(`contacts.${index}.name`) === 'Email'
												? 'email@example.com'
												: 'Значение'
										}
										type={
											form.watch(`contacts.${index}.name`) === 'Email'
												? 'email'
												: form.watch(`contacts.${index}.name`) === 'Телефон'
												? 'tel'
												: 'text'
										}
										{...valueField}
										className='w-full'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			))}
			<Button
				type='button'
				variant='outline'
				onClick={() => append({ name: 'Другое', value: '' })}
				size='sm'
				className='w-full sm:w-auto'
			>
				+ Добавить контакт
			</Button>
		</div>
	)
}
