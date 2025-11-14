import { ANIMATION_DURATION } from '@/constants'
import { useCallback } from 'react'

interface UseMapControlsProps {
	isFiltersOpen: boolean
	setIsFiltersOpen: (open: boolean) => void
	isListOpen: boolean
	setIsListOpen: (open: boolean) => void
	setIsFiltersClosing: (closing: boolean) => void
	setIsListClosing: (closing: boolean) => void
}

export function useMapControls({
	isFiltersOpen,
	setIsFiltersOpen,
	isListOpen,
	setIsListOpen,
	setIsFiltersClosing,
	setIsListClosing,
}: UseMapControlsProps) {
	const handleToggleFilters = useCallback(() => {
		if (isFiltersOpen) {
			setIsFiltersClosing(true)
			setTimeout(() => {
				setIsFiltersOpen(false)
				setIsFiltersClosing(false)
			}, ANIMATION_DURATION)
		} else {
			setIsFiltersOpen(true)
			setIsFiltersClosing(false)
		}
	}, [
		isFiltersOpen,
		setIsFiltersOpen,
		setIsFiltersClosing,
	])

	const handleToggleList = useCallback(() => {
		if (isListOpen) {
			setIsListClosing(true)
			setTimeout(() => {
				setIsListOpen(false)
				setIsListClosing(false)
			}, ANIMATION_DURATION)
		} else {
			setIsListOpen(true)
			setIsListClosing(false)
		}
	}, [isListOpen, setIsListOpen, setIsListClosing])

	return {
		handleToggleFilters,
		handleToggleList,
	}
}

