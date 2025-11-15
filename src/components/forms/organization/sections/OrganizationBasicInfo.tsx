import {
	cityMap,
	organizationTypeMap,
	cities as orgCities,
} from '@/components/map/data/organizations'
import { questCities } from '@/components/map/data/quests'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { MediaUpload } from '../../shared/MediaUpload'
import type { OrganizationFormData } from '../schemas/organization-form.schema'

interface OrganizationBasicInfoProps {
	onCityChange?: (city: string) => void
}

export function OrganizationBasicInfo({
	onCityChange,
}: OrganizationBasicInfoProps) {
	const form = useFormContext<OrganizationFormData>()
	const allCities = useMemo(
		() =>
			Array.from(new Set([...questCities, ...orgCities])).sort((a, b) =>
				a.localeCompare(b)
			),
		[]
	)

	const organizationTypes = useMemo(
		() => Object.values(organizationTypeMap).sort((a, b) => a.name.localeCompare(b.name)),
		[]
	)

	return (
		<div className='space-y-4'>
			<FormField
				control={form.control}
				name='name'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Название организации *</FormLabel>
						<FormControl>
							<Input placeholder='Например: Приют «Лапки добра»' {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<FormField
					control={form.control}
					name='cityId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Город *</FormLabel>
							<FormControl>
								<select
									value={field.value || ''}
									onChange={e => {
										const cityId = Number(e.target.value)
										field.onChange(cityId)
										const cityName = Object.values(cityMap).find(c => c.id === cityId)?.name
										if (cityName && onCityChange) {
											onCityChange(cityName)
										}
									}}
									className='w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm'
								>
									<option value=''>Выберите город</option>
									{allCities.map(cityName => {
										const city = cityMap[cityName]
										return city ? (
											<option key={city.id} value={city.id}>
												{city.name}
											</option>
										) : null
									})}
								</select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='organizationTypeId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Тип организации *</FormLabel>
							<FormControl>
								<select
									value={field.value || ''}
									onChange={e => field.onChange(Number(e.target.value))}
									className='w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm'
								>
									<option value=''>Выберите тип</option>
									{organizationTypes.map(type => (
										<option key={type.id} value={type.id}>
											{type.name}
										</option>
									))}
								</select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={form.control}
				name='summary'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Краткое описание *</FormLabel>
						<FormControl>
							<Input placeholder='Краткое описание организации' {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='description'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Подробное описание *</FormLabel>
						<FormControl>
							<textarea
								{...field}
								rows={4}
								className='w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm'
								placeholder='Подробное описание деятельности организации...'
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='mission'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Миссия *</FormLabel>
						<FormControl>
							<textarea
								{...field}
								rows={3}
								className='w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm'
								placeholder='Миссия организации...'
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='gallery'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Галерея организации</FormLabel>
						<FormControl>
							<MediaUpload
								images={field.value}
								onImagesChange={field.onChange}
								maxImages={10}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	)
}
