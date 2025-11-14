import { useState } from 'react'
import { organizations } from '../data/organizations'
import type { GeocodeResult } from '../hooks/useGeocode'
import type { Organization } from '../types/types'
import { AddressSearchInput } from './AddressSearchInput'
import { MapView } from './MapView'
import { OrganizationDetails } from './OrganizationDetails'

export const MapComponent = () => {
	const [searchCenter, setSearchCenter] = useState<
		[number, number] | undefined
	>()
	const [searchZoom, setSearchZoom] = useState<number | undefined>()
	const [selectedOrganization, setSelectedOrganization] = useState<
		Organization | undefined
	>()
	const [isClosing, setIsClosing] = useState(false)

	const handleAddressSelect = (result: GeocodeResult) => {
		setSearchCenter([result.lat, result.lon])
		setSearchZoom(15) // Увеличенный зум для найденного адреса
	}

	const handleOrganizationSelect = (organization: Organization) => {
		setSearchCenter(organization.coordinates)
		setSearchZoom(15) // Увеличенный зум для организации
	}

	const handleSelectOrganization = (organization: Organization) => {
		// Если уже открыта другая организация, закрываем панель перед открытием новой
		if (selectedOrganization && selectedOrganization.id !== organization.id) {
			setIsClosing(true)
			setTimeout(() => {
				setSelectedOrganization(organization)
				setIsClosing(false)
			}, 300)
		} else {
			setSelectedOrganization(organization)
			setIsClosing(false)
		}
	}

	const handleMarkerClick = (organization: Organization) => {
		// При клике на маркер другой организации закрываем панель
		if (selectedOrganization && selectedOrganization.id !== organization.id) {
			setIsClosing(true)
			setTimeout(() => {
				setSelectedOrganization(undefined)
				setIsClosing(false)
			}, 300)
		}
	}

	const handleCloseDetails = () => {
		setIsClosing(true)
		setTimeout(() => {
			setSelectedOrganization(undefined)
			setIsClosing(false)
		}, 300)
	}

	return (
		<div className='relative w-full h-full'>
			<MapView
				organizations={organizations}
				onSelect={handleSelectOrganization}
				onMarkerClick={handleMarkerClick}
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
			{(selectedOrganization || isClosing) && (
				<OrganizationDetails
					organization={selectedOrganization}
					onClose={handleCloseDetails}
					isClosing={isClosing}
				/>
			)}
		</div>
	)
}
