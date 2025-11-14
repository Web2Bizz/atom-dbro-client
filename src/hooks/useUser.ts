import { useContext } from 'react'
import { UserContext } from '@/contexts/UserContext'
import { useAuth } from './useAuth'
import { useQuestActions } from './useQuestActions'
import { useOrganizationActions } from './useOrganizationActions'
import { useUserStats } from './useUserStats'

export function useUser() {
	const context = useContext(UserContext)
	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider')
	}

	const auth = useAuth()
	const questActions = useQuestActions()
	const organizationActions = useOrganizationActions()
	const userStats = useUserStats()

	return {
		...context,
		...auth,
		...questActions,
		...organizationActions,
		...userStats,
	}
}
