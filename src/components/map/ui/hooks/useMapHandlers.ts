import { ANIMATION_DURATION, SEARCH_MAP_ZOOM } from '@/constants'
import { getOrganizationCoordinates } from '@/utils/cityCoordinates'
import { useCallback } from 'react'
import type { GeocodeResult } from '../../hooks/useGeocode'
import type { Quest } from '../../types/quest-types'
import type { Organization } from '../../types/types'

interface UseMapHandlersProps {
	setSearchCenter: (center: [number, number] | undefined) => void
	setSearchZoom: (zoom: number | undefined) => void
	selectedQuest: Quest | undefined
	setSelectedQuest: (quest: Quest | undefined) => void
	selectedOrganization: Organization | undefined
	setSelectedOrganization: (org: Organization | undefined) => void
	setIsClosing: (closing: boolean) => void
}

export function useMapHandlers({
	setSearchCenter,
	setSearchZoom,
	selectedQuest,
	setSelectedQuest,
	selectedOrganization,
	setSelectedOrganization,
	setIsClosing,
}: UseMapHandlersProps) {
	const handleAddressSelect = useCallback(
		(result: GeocodeResult) => {
			setSearchCenter([result.lat, result.lon])
			setSearchZoom(SEARCH_MAP_ZOOM)
		},
		[setSearchCenter, setSearchZoom]
	)

	const handleSelectQuest = useCallback(
		(quest: Quest) => {
			setSearchCenter(quest.coordinates)
			setSearchZoom(SEARCH_MAP_ZOOM)
			// Закрываем организацию, если открыта
			if (selectedOrganization) {
				setSelectedOrganization(undefined)
			}
			// Если уже открыт другой квест, закрываем панель перед открытием новой
			if (selectedQuest && selectedQuest.id !== quest.id) {
				setIsClosing(true)
				setTimeout(() => {
					setSelectedQuest(quest)
					setIsClosing(false)
				}, ANIMATION_DURATION)
			} else {
				setSelectedQuest(quest)
				setIsClosing(false)
			}
		},
		[
			setSearchCenter,
			setSearchZoom,
			selectedOrganization,
			setSelectedOrganization,
			selectedQuest,
			setSelectedQuest,
			setIsClosing,
		]
	)

	const handleSelectOrganization = useCallback(
		(organization: Organization) => {
			setSearchCenter(getOrganizationCoordinates(organization))
			setSearchZoom(SEARCH_MAP_ZOOM)
			// Закрываем квест, если открыт
			if (selectedQuest) {
				setSelectedQuest(undefined)
			}
			// Если уже открыта другая организация, закрываем панель перед открытием новой
			if (selectedOrganization && selectedOrganization.id !== organization.id) {
				setIsClosing(true)
				setTimeout(() => {
					setSelectedOrganization(organization)
					setIsClosing(false)
				}, ANIMATION_DURATION)
			} else {
				setSelectedOrganization(organization)
				setIsClosing(false)
			}
		},
		[
			setSearchCenter,
			setSearchZoom,
			selectedQuest,
			setSelectedQuest,
			selectedOrganization,
			setSelectedOrganization,
			setIsClosing,
		]
	)

	const handleMarkerClick = useCallback(
		(item: Quest | Organization) => {
			// При клике на маркер закрываем открытую панель
			if ('story' in item) {
				// Это квест
				if (selectedQuest && selectedQuest.id !== item.id) {
					setIsClosing(true)
					setTimeout(() => {
						setSelectedQuest(undefined)
						setIsClosing(false)
					}, ANIMATION_DURATION)
				}
				if (selectedOrganization) {
					setSelectedOrganization(undefined)
				}
			} else {
				// Это организация
				if (selectedOrganization && selectedOrganization.id !== item.id) {
					setIsClosing(true)
					setTimeout(() => {
						setSelectedOrganization(undefined)
						setIsClosing(false)
					}, ANIMATION_DURATION)
				}
				if (selectedQuest) {
					setSelectedQuest(undefined)
				}
			}
		},
		[
			selectedQuest,
			setSelectedQuest,
			selectedOrganization,
			setSelectedOrganization,
			setIsClosing,
		]
	)

	const handleCloseDetails = useCallback(() => {
		setIsClosing(true)
		setTimeout(() => {
			setSelectedQuest(undefined)
			setSelectedOrganization(undefined)
			setIsClosing(false)
		}, ANIMATION_DURATION)
	}, [setSelectedQuest, setSelectedOrganization, setIsClosing])

	return {
		handleAddressSelect,
		handleSelectQuest,
		handleSelectOrganization,
		handleMarkerClick,
		handleCloseDetails,
	}
}

