import { useState } from 'react'
import { organizations } from '../data/organizations'
import type { GeocodeResult } from '../hooks/useGeocode'
import type { Organization } from '../types/types'
import { AddressSearchInput } from './AddressSearchInput'
import { MapView } from './MapView'

export const MapComponent = () => {
	const [searchCenter, setSearchCenter] = useState<
		[number, number] | undefined
	>()
	const [searchZoom, setSearchZoom] = useState<number | undefined>()

	const handleAddressSelect = (result: GeocodeResult) => {
		setSearchCenter([result.lat, result.lon])
		setSearchZoom(15) // Увеличенный зум для найденного адреса
	}

	const handleOrganizationSelect = (organization: Organization) => {
		setSearchCenter(organization.coordinates)
		setSearchZoom(15) // Увеличенный зум для организации
	}

	return (
		<div className='relative w-full h-full'>
			<MapView
				organizations={organizations}
				onSelect={() => {}}
				onMarkerClick={() => {}}
				searchCenter={searchCenter}
				searchZoom={searchZoom}
			/>
			<div className='absolute top-20 left-5 w-full max-w-[400px] z-999'>
				<AddressSearchInput
					organizations={organizations}
					onAddressSelect={handleAddressSelect}
					onOrganizationSelect={handleOrganizationSelect}
					placeholder='Поиск по адресу или организации...'
				/>
			</div>
		</div>
	)
}
