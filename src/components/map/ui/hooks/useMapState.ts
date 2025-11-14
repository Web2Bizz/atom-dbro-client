import { ASSISTANCE_OPTIONS } from '@/constants'
import { getAllQuests, getAllOrganizations } from '@/utils/userData'
import { useMemo, useState } from 'react'
import {
	cities as orgCities,
	organizationTypes,
	organizations as baseOrganizations,
} from '../../data/organizations'
import { questCities, questTypes, quests as baseQuests } from '../../data/quests'
import { useFilteredOrganizations } from '../../hooks/useFilteredOrganizations'
import { useFilteredQuests } from '../../hooks/useFilteredQuests'
import type { FiltersState } from '../actions/types'
import type { Quest } from '../../types/quest-types'
import type { Organization } from '../../types/types'

const initialFilters: FiltersState = {
	city: '',
	type: '',
	assistance: ASSISTANCE_OPTIONS.reduce((acc, item) => {
		acc[item.id] = false
		return acc
	}, {} as FiltersState['assistance']),
	search: '',
}

export function useMapState() {
	const [searchCenter, setSearchCenter] = useState<
		[number, number] | undefined
	>()
	const [searchZoom, setSearchZoom] = useState<number | undefined>()
	const [selectedQuest, setSelectedQuest] = useState<Quest | undefined>()
	const [selectedOrganization, setSelectedOrganization] = useState<
		Organization | undefined
	>()
	const [isClosing, setIsClosing] = useState(false)
	const [filters, setFilters] = useState<FiltersState>(initialFilters)
	const [isFiltersOpen, setIsFiltersOpen] = useState(false)
	const [isListOpen, setIsListOpen] = useState(false)
	const [isFiltersClosing, setIsFiltersClosing] = useState(false)
	const [isListClosing, setIsListClosing] = useState(false)

	// Объединяем базовые данные с созданными пользователями
	const allQuests = useMemo(() => getAllQuests(baseQuests), [])
	const allOrganizations = useMemo(
		() => getAllOrganizations(baseOrganizations),
		[]
	)

	const filteredQuests = useFilteredQuests(allQuests, filters)
	const filteredOrganizations = useFilteredOrganizations(allOrganizations, filters)

	// Объединяем города и типы из обоих источников
	const allCities = useMemo(
		() =>
			Array.from(new Set([...questCities, ...orgCities])).sort((a, b) =>
				a.localeCompare(b)
			),
		[]
	)

	const allTypes = useMemo(
		() =>
			Array.from(new Set([...questTypes, ...organizationTypes])).sort((a, b) =>
				a.localeCompare(b)
			),
		[]
	)

	return {
		// State
		searchCenter,
		setSearchCenter,
		searchZoom,
		setSearchZoom,
		selectedQuest,
		setSelectedQuest,
		selectedOrganization,
		setSelectedOrganization,
		isClosing,
		setIsClosing,
		filters,
		setFilters,
		isFiltersOpen,
		setIsFiltersOpen,
		isListOpen,
		setIsListOpen,
		isFiltersClosing,
		setIsFiltersClosing,
		isListClosing,
		setIsListClosing,
		// Data
		allQuests,
		allOrganizations,
		filteredQuests,
		filteredOrganizations,
		allCities,
		allTypes,
	}
}

