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

export function QuestCuratorSection() {
	const form = useFormContext<QuestFormData>()

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
			<FormField
				control={form.control}
				name='curatorName'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Имя куратора *</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='curatorPhone'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Телефон *</FormLabel>
						<FormControl>
							<Input
								type='tel'
								placeholder='+7 (XXX) XXX-XX-XX'
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='curatorEmail'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl>
							<Input type='email' placeholder='email@example.com' {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	)
}

