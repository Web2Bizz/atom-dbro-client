import { useMemo } from 'react'
import type { Organization } from '../types/types'

export function useOrganizationSearch(organizations: Organization[]) {
	const searchOrganizations = useMemo(
		() => (query: string): Organization[] => {
			if (!query || query.trim().length < 2) {
				return []
			}

			const lowerQuery = query.toLowerCase().trim()

			return organizations.filter(org => {
				const searchableText = [
					org.name,
					org.city,
					org.type,
					org.summary,
					org.description,
					org.address,
				]
					.join(' ')
					.toLowerCase()

				return searchableText.includes(lowerQuery)
			})
		},
		[organizations]
	)

	return { searchOrganizations }
}

