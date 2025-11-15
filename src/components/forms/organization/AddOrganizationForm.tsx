import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { cityMap } from '@/components/map/data/organizations'
import { useState } from 'react'
import { DangerZone } from '../shared/DangerZone'
import { LocationPicker } from '../shared/LocationPicker'
import { useOrganizationForm } from './hooks/useOrganizationForm'
import { OrganizationAssistanceSection } from './sections/OrganizationAssistanceSection'
import { OrganizationBasicInfo } from './sections/OrganizationBasicInfo'
import { OrganizationContactsSection } from './sections/OrganizationContactsSection'
import { OrganizationGoalsNeedsSection } from './sections/OrganizationGoalsNeedsSection'
import { OrganizationLocationSection } from './sections/OrganizationLocationSection'

interface AddOrganizationFormProps {
	onSuccess?: (organizationId: string) => void
}

export function AddOrganizationForm({
	onSuccess,
}: Readonly<AddOrganizationFormProps>) {
	const {
		form,
		isSubmitting,
		isEditMode,
		onSubmit,
		handleCityChange,
		handleDelete,
	} = useOrganizationForm(onSuccess)

	const [showLocationPicker, setShowLocationPicker] = useState(false)

	const handleLocationSelect = (coordinates: { lat: number; lng: number }) => {
		form.setValue('latitude', coordinates.lat.toString())
		form.setValue('longitude', coordinates.lng.toString())
		setShowLocationPicker(false)
	}

	const cityId = form.watch('cityId')
	const cityName = cityId
		? Object.values(cityMap).find(c => c.id === cityId)?.name
		: undefined

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className='space-y-6'>
				{isEditMode && (
					<div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
						<p className='text-sm text-blue-800'>
							<strong>Режим редактирования:</strong> Вы редактируете свою
							созданную организацию. Изменения будут сохранены при нажатии
							"Сохранить изменения".
						</p>
					</div>
				)}

				<OrganizationBasicInfo onCityChange={handleCityChange} />

				<OrganizationAssistanceSection />

				<OrganizationGoalsNeedsSection />

				<OrganizationLocationSection
					onOpenMap={() => setShowLocationPicker(true)}
				/>

				<OrganizationContactsSection />

				<Button type='submit' disabled={isSubmitting} className='w-full'>
					{isSubmitting ? (
						<div className='flex items-center gap-2'>
							<Spinner />
							<span>{isEditMode ? 'Сохранение...' : 'Создание...'}</span>
						</div>
					) : (
						<span>
							{isEditMode ? 'Сохранить изменения' : 'Создать организацию'}
						</span>
					)}
				</Button>

				{isEditMode && (
					<DangerZone
						title='Опасная зона'
						description='Удаление организации необратимо. Все данные будут потеряны.'
						confirmMessage='Вы уверены, что хотите удалить эту организацию?'
						onDelete={handleDelete}
						deleteButtonText='Удалить организацию'
					/>
				)}

				{showLocationPicker && (
					<LocationPicker
						city={cityName || ''}
						initialCoordinates={
							form.watch('latitude') && form.watch('longitude')
								? {
										lat: parseFloat(form.watch('latitude')),
										lng: parseFloat(form.watch('longitude')),
								  }
								: undefined
						}
						onSelect={handleLocationSelect}
						onClose={() => setShowLocationPicker(false)}
					/>
				)}
			</form>
		</Form>
	)
}
