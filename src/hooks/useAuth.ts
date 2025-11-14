import { UserContext } from '@/contexts/UserContext'
import type { User } from '@/types/user'
import { useCallback, useContext } from 'react'

interface LoginCredentials {
	email: string
	name: string
}

export function useAuth(): {
	user: User | null
	login: (credentials: LoginCredentials) => void
	logout: () => void
	isAuthenticated: boolean
} {
	const context = useContext(UserContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within a UserProvider')
	}
	const { user, setUser } = context

	const login = useCallback(
		(credentials: LoginCredentials) => {
			const newUser: User = {
				id: `user-${Date.now()}`,
				name: credentials.name,
				email: credentials.email,
				role: [],
				level: {
					level: 1,
					experience: 0,
					experienceToNext: 100,
					title: 'Новичок',
				},
				stats: {
					totalQuests: 0,
					completedQuests: 0,
					totalDonations: 0,
					totalVolunteerHours: 0,
					totalImpact: {
						treesPlanted: 0,
						animalsHelped: 0,
						areasCleaned: 0,
						livesChanged: 0,
					},
				},
				achievements: [],
				participatingQuests: [],
				createdAt: new Date().toISOString(),
			}
			setUser(newUser)
		},
		[setUser]
	)

	const logout = useCallback(() => {
		setUser(null)
	}, [setUser])

	return {
		user,
		login,
		logout,
		isAuthenticated: user !== null,
	}
}
