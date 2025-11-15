import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { ASSISTANCE_OPTIONS } from '@/constants'
import { helpTypeMap } from '@/components/map/data/organizations'
import { useFormContext } from 'react-hook-form'
import type { OrganizationFormData } from '../schemas/organization-form.schema'

export function OrganizationAssistanceSection() {
	const form = useFormContext<OrganizationFormData>()

	// Маппинг старых ID помощи на новые helpType IDs
	const assistanceToHelpTypeMap: Record<string, number> = {
		volunteers: helpTypeMap.volunteers.id,
		donations: helpTypeMap.donations.id,
		things: helpTypeMap.things.id,
		mentors: helpTypeMap.mentors.id,
		blood: helpTypeMap.blood.id,
		experts: helpTypeMap.experts.id,
	}

	return (
		<FormField
			control={form.control}
			name='helpTypeIds'
			render={({ field }) => (
				<FormItem>
					<FormLabel>Вид помощи *</FormLabel>
					<FormControl>
						<div className='grid grid-cols-2 gap-2'>
							{ASSISTANCE_OPTIONS.map(option => {
								const helpTypeId = assistanceToHelpTypeMap[option.id]
								return (
									<label
										key={option.id}
										className='flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-50'
									>
										<input
											type='checkbox'
											checked={field.value.includes(helpTypeId)}
											onChange={e => {
												const currentValue = field.value || []
												if (e.target.checked) {
													field.onChange([...currentValue, helpTypeId])
												} else {
													field.onChange(
														currentValue.filter(id => id !== helpTypeId)
													)
												}
											}}
											className='w-4 h-4 rounded border-slate-300 text-blue-600'
										/>
										<span className='text-sm text-slate-700'>{option.label}</span>
									</label>
								)
							})}
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
