import { organizations } from '@/components/map/data/organizations'
import { quests } from '@/components/map/data/quests'
import type { Quest } from '@/components/map/types/quest-types'
import type { Organization } from '@/components/map/types/types'

/**
 * Получает координаты города из данных квестов и организаций
 * Возвращает формат [lat, lng] для Leaflet
 * @param cityName - Название города
 * @param apiQuests - Опциональный массив квестов с сервера (приоритет над mock данными)
 */
export function getCityCoordinates(
	cityName: string,
	apiQuests?: Quest[]
): [number, number] | null {
	// Сначала ищем в квестах с сервера (если переданы)
	if (apiQuests) {
		const quest = apiQuests.find(q => q.city === cityName)
		if (quest) {
			return quest.coordinates
		}
	}

	// Затем ищем в mock квестах (fallback)
	const quest = quests.find(q => q.city === cityName)
	if (quest) {
		return quest.coordinates
	}

	// Ищем в организациях (новая структура)
	const org = organizations.find(o => o.city.name === cityName)
	if (org) {
		return [
			Number.parseFloat(org.city.latitude),
			Number.parseFloat(org.city.longitude),
		]
	}

	return null
}

/**
 * Получает координаты организации в формате [lat, lng] для Leaflet
 */
export function getOrganizationCoordinates(
	organization: Organization | { latitude: string; longitude: string }
): [number, number] {
	return [
		Number.parseFloat(organization.latitude),
		Number.parseFloat(organization.longitude),
	]
}
