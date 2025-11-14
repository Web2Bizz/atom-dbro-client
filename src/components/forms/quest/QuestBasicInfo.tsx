import { Input } from '@/components/ui/input'
import { questCategories, questCities, questTypes } from '@/components/map/data/quests'
import type { Quest } from '@/components/map/types/quest-types'
import { cities as orgCities } from '@/components/map/data/organizations'
import { useMemo } from 'react'

interface QuestBasicInfoProps {
	formData: {
		title: string
		city: string
		type: string
		category: Quest['category']
		story: string
	}
	onChange: (field: string, value: string) => void
	onCityChange: (city: string) => void
}

export function QuestBasicInfo({
	formData,
	onChange,
	onCityChange,
}: QuestBasicInfoProps) {
	const allCities = useMemo(
		() =>
			Array.from(new Set([...questCities, ...orgCities])).sort((a, b) =>
				a.localeCompare(b)
			),
		[]
	)

	return (
		<div className='space-y-4'>
			<div>
				<label
					htmlFor='quest-title'
					className='block text-sm font-medium text-slate-700 mb-2'
				>
					Название квеста *
				</label>
				<Input
					id='quest-title'
					value={formData.title}
					onChange={e => onChange('title', e.target.value)}
					required
					placeholder='Например: Озеленение микрорайона'
				/>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div>
					<label
						htmlFor='quest-city'
						className='block text-sm font-medium text-slate-700 mb-2'
					>
						Город *
					</label>
					<select
						id='quest-city'
						value={formData.city}
						onChange={e => onCityChange(e.target.value)}
						required
						className='w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm'
					>
						<option value=''>Выберите город</option>
						{allCities.map(city => (
							<option key={city} value={city}>
								{city}
							</option>
						))}
					</select>
				</div>

				<div>
					<label
						htmlFor='quest-type'
						className='block text-sm font-medium text-slate-700 mb-2'
					>
						Тип *
					</label>
					<select
						id='quest-type'
						value={formData.type}
						onChange={e => onChange('type', e.target.value)}
						required
						className='w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm'
					>
						<option value=''>Выберите тип</option>
						{questTypes.map(type => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				</div>
			</div>

			<div>
				<label
					htmlFor='quest-category'
					className='block text-sm font-medium text-slate-700 mb-2'
				>
					Категория *
				</label>
				<select
					id='quest-category'
					value={formData.category}
					onChange={e => onChange('category', e.target.value)}
					required
					className='w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm'
				>
					{questCategories.map(cat => (
						<option key={cat.id} value={cat.id}>
							{cat.icon} {cat.label}
						</option>
					))}
				</select>
			</div>

			<div>
				<label
					htmlFor='quest-story'
					className='block text-sm font-medium text-slate-700 mb-2'
				>
					Описание квеста *
				</label>
				<textarea
					id='quest-story'
					value={formData.story}
					onChange={e => onChange('story', e.target.value)}
					required
					rows={4}
					className='w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm'
					placeholder='Расскажите о проблеме, которую решает ваш квест...'
				/>
			</div>
		</div>
	)
}

