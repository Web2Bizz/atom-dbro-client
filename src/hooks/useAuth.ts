import { UserContext } from '@/contexts/UserContext'
import type { User } from '@/types/user'
import { removeToken } from '@/utils/auth'
import { useCallback, useContext } from 'react'

export function useAuth(): {
	user: User | null
	logout: () => void
	isAuthenticated: boolean
} {
	const context = useContext(UserContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within a UserProvider')
	}
	const { user, setUser } = context

	const logout = useCallback(() => {
		// Очищаем токен из localStorage
		removeToken()
		// Очищаем локальное состояние пользователя
		setUser(null)
	}, [setUser])

	return {
		user,
		logout,
		isAuthenticated: user !== null,
	}
}
