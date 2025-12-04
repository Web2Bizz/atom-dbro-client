import { useUser } from '@/hooks/useUser'
import { getToken } from '@/utils/auth'
import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
	children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { user } = useUser()
	const token = getToken()

	useEffect(() => {
		// Если нет пользователя или нет токена - перенаправляем на страницу входа
		if (!user || !token) {
			window.location.href = '/login'
		}
	}, [user, token])

	if (!user || !token) {
		return null
	}

	return <>{children}</>
}

