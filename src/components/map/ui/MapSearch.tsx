import { memo, useCallback } from 'react'
import { AddressSearchInput } from './AddressSearchInput'
import type { GeocodeResult } from '../hooks/useGeocode'
import type { Quest } from '../types/quest-types'
import type { Organization } from '../types/types'

type SearchItem = (Quest & { isQuest: true }) | (Organization & { isQuest: false })

interface MapSearchProps {
	searchItems: SearchItem[]
	onAddressSelect: (result: GeocodeResult) => void
	onItemSelect: (item: Quest | Organization) => void
}

export const MapSearch = memo(function MapSearch({
	searchItems,
	onAddressSelect,
	onItemSelect,
}: MapSearchProps) {
	const handleOrganizationSelect = useCallback(
		(item: SearchItem) => {
			const foundItem = searchItems.find(s => s.id === item.id)
			if (foundItem) {
				onItemSelect(foundItem)
			}
		},
		[searchItems, onItemSelect]
	)
	return (
		<div className='absolute top-20 left-5 w-full max-w-[400px] z-999'>
			<AddressSearchInput
				organizations={searchItems}
				onAddressSelect={onAddressSelect}
				onOrganizationSelect={handleOrganizationSelect}
				placeholder='Поиск по адресу, квесту или организации...'
			/>
		</div>
	)
})

