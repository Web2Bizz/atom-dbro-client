import { Button } from '@/components/ui/button'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext, useFieldArray } from 'react-hook-form'
import type { OrganizationFormData } from '../schemas/organization-form.schema'

export function OrganizationGoalsNeedsSection() {
	const form = useFormContext<OrganizationFormData>()

	const {
		fields: goalFields,
		append: appendGoal,
		remove: removeGoal,
	} = useFieldArray({
		control: form.control,
		name: 'goals',
	})

	const {
		fields: needFields,
		append: appendNeed,
		remove: removeNeed,
	} = useFieldArray({
		control: form.control,
		name: 'needs',
	})

	return (
		<div className='space-y-4'>
			<div>
				<FormLabel>Цели</FormLabel>
				{goalFields.map((field, index) => (
					<FormField
						key={field.id}
						control={form.control}
						name={`goals.${index}`}
						render={({ field: goalField }) => (
							<FormItem className='mb-2'>
								<FormControl>
									<div className='flex gap-2'>
										<Input
											{...goalField}
											placeholder={`Цель ${index + 1}`}
											className='flex-1'
										/>
										{goalFields.length > 1 && (
											<Button
												type='button'
												variant='outline'
												onClick={() => removeGoal(index)}
											>
												Удалить
											</Button>
										)}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				))}
				<Button
					type='button'
					variant='outline'
					onClick={() => appendGoal('')}
					className='mt-2'
				>
					+ Добавить цель
				</Button>
			</div>

			<div>
				<FormLabel>Актуальные нужды</FormLabel>
				{needFields.map((field, index) => (
					<FormField
						key={field.id}
						control={form.control}
						name={`needs.${index}`}
						render={({ field: needField }) => (
							<FormItem className='mb-2'>
								<FormControl>
									<div className='flex gap-2'>
										<Input
											{...needField}
											placeholder={`Нужда ${index + 1}`}
											className='flex-1'
										/>
										{needFields.length > 1 && (
											<Button
												type='button'
												variant='outline'
												onClick={() => removeNeed(index)}
											>
												Удалить
											</Button>
										)}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				))}
				<Button
					type='button'
					variant='outline'
					onClick={() => appendNeed('')}
					className='mt-2'
				>
					+ Добавить нужду
				</Button>
			</div>
		</div>
	)
}

