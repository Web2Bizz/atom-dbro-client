// Утилиты для работы с авторизацией

import type { UserFullData } from '@/store/entities/auth/model/type'
import type { User } from '@/types/user'

/**
 * Преобразует данные пользователя из API в формат для локального состояния
 */
export function transformUserFromAPI(apiUser: UserFullData): User {
	console.log(apiUser)
	return {
		id: apiUser.id,
		name: `${apiUser.firstName} ${apiUser.lastName}`.trim() || apiUser.email,
		email: apiUser.email,
		avatar: apiUser.avatar || undefined,
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
}

/**
 * Сохраняет токен в localStorage
 */
export function saveToken(token: string): void {
	if (globalThis.window !== undefined) {
		localStorage.setItem('authToken', token)
	}
}

/**
 * Удаляет токен из localStorage
 */
export function removeToken(): void {
	if (globalThis.window !== undefined) {
		localStorage.removeItem('authToken')
	}
}

/**
 * Получает токен из localStorage
 */
export function getToken(): string | null {
	if (globalThis.window !== undefined) {
		return localStorage.getItem('authToken')
	}
	return null
}
