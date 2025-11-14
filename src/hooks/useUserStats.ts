import { UserContext } from '@/contexts/UserContext'
import { useCallback, useContext } from 'react'

export function useUserStats() {
	const context = useContext(UserContext)
	if (context === undefined) {
		throw new Error('useUserStats must be used within a UserProvider')
	}
	const { user, setUser } = context

	const updateUserStats = useCallback(() => {
		if (!user) return
		// Здесь можно обновить статистику из API
		// Пока просто сохраняем текущее состояние
		setUser(user)
	}, [user, setUser])

	return {
		updateUserStats,
	}
}

