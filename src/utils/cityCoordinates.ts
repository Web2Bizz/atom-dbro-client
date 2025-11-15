import { quests } from '@/components/map/data/quests'
import { organizations } from '@/components/map/data/organizations'

/**
 * Получает координаты города из данных квестов и организаций
 */
export function getCityCoordinates(
	cityName: string
): { lat: number; lng: number } | null {
	// Ищем в квестах
	const quest = quests.find(q => q.city === cityName)
	if (quest) {
		return { lat: quest.coordinates[0], lng: quest.coordinates[1] }
	}

	// Ищем в организациях (новая структура)
	const org = organizations.find(o => o.city.name === cityName)
	if (org) {
		return {
			lat: parseFloat(org.city.latitude),
			lng: parseFloat(org.city.longitude),
		}
	}

	return null
}

/**
 * Получает все города с их координатами
 */
export function getAllCityCoordinates(): Record<string, { lat: number; lng: number }> {
	const coords: Record<string, { lat: number; lng: number }> = {}

	// Добавляем города из квестов
	quests.forEach(quest => {
		if (!coords[quest.city]) {
			coords[quest.city] = {
				lat: quest.coordinates[0],
				lng: quest.coordinates[1],
			}
		}
	})

	// Добавляем города из организаций (новая структура)
	organizations.forEach(org => {
		const cityName = org.city.name
		if (!coords[cityName]) {
			coords[cityName] = {
				lat: parseFloat(org.city.latitude),
				lng: parseFloat(org.city.longitude),
			}
		}
	})

	return coords
}

/**
 * Получает координаты организации (latitude/longitude)
 */
export function getOrganizationCoordinates(org: {
	latitude: string
	longitude: string
}): { lat: number; lng: number } {
	return {
		lat: parseFloat(org.latitude),
		lng: parseFloat(org.longitude),
	}
}
