import type { Organization } from '@/components/map/types/types'

/**
 * Преобразует координаты организации в формат [lat, lng] для Leaflet
 */
export function getOrganizationCoordinates(
	organization: Organization
): [number, number] {
	return [
		parseFloat(organization.latitude),
		parseFloat(organization.longitude),
	]
}

/**
 * Получает координаты организации для использования в карте
 */
export function getOrgCoords(org: {
	latitude: string
	longitude: string
}): [number, number] {
	return [parseFloat(org.latitude), parseFloat(org.longitude)]
}

