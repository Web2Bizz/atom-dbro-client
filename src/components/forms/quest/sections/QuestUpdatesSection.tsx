import { Button } from '@/components/ui/button'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MediaUpload } from '../../shared/MediaUpload'
import { Plus, X } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import type { QuestFormData } from '../schemas/quest-form.schema'

export function QuestUpdatesSection() {
	const form = useFormContext<QuestFormData>()

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'updates',
	})

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h3 className='text-lg font-semibold text-slate-900'>
					Обновления квеста
				</h3>
				<Button
					type='button'
					variant='outline'
					onClick={() =>
						append({
							id: `update-${Date.now()}-${Math.random()}`,
							title: '',
							content: '',
							images: [],
						})
					}
					size='sm'
				>
					<Plus className='h-4 w-4 mr-1' />
					Добавить обновление
				</Button>
			</div>

			{fields.length === 0 ? (
				<div className='bg-slate-50 border border-slate-200 rounded-lg p-8 text-center'>
					<p className='text-slate-600 mb-4'>
						Пока нет обновлений. Добавьте первое обновление, чтобы рассказать о
						прогрессе квеста.
					</p>
					<Button
						type='button'
						variant='outline'
						onClick={() =>
							append({
								id: `update-${Date.now()}-${Math.random()}`,
								title: '',
								content: '',
								images: [],
							})
						}
					>
						<Plus className='h-4 w-4 mr-2' />
						Добавить обновление
					</Button>
				</div>
			) : (
				<div className='space-y-4'>
					{fields.map((field, index) => (
						<UpdateForm
							key={field.id}
							index={index}
							onRemove={() => remove(index)}
						/>
					))}
				</div>
			)}
		</div>
	)
}

function UpdateForm({
	index,
	onRemove,
}: {
	index: number
	onRemove: () => void
}) {
	const form = useFormContext<QuestFormData>()

	return (
		<div className='border border-slate-200 rounded-lg p-6 bg-white space-y-4'>
			<div className='flex items-center justify-between mb-4'>
				<h4 className='text-base font-semibold text-slate-900'>
					Обновление {index + 1}
				</h4>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={onRemove}
					className='text-red-600 hover:text-red-700 hover:border-red-300'
				>
					<X className='h-4 w-4 mr-1' />
					Удалить
				</Button>
			</div>

			<FormField
				control={form.control}
				name={`updates.${index}.title`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							Заголовок <span className='text-red-500'>*</span>
						</FormLabel>
						<FormControl>
							<Input
								placeholder='Например: Завершен первый этап!'
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name={`updates.${index}.content`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							Текст обновления <span className='text-red-500'>*</span>
						</FormLabel>
						<FormControl>
							<textarea
								{...field}
								placeholder='Расскажите о прогрессе квеста...'
								rows={4}
								className='w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm'
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name={`updates.${index}.images`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Фотографии (необязательно)</FormLabel>
						<FormControl>
							<MediaUpload
								images={field.value || []}
								onImagesChange={newImages => {
									field.onChange(newImages)
								}}
								maxImages={5}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	)
}

