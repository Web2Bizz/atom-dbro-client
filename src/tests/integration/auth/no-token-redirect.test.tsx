/// <reference types="@testing-library/jest-dom" />
import { ProtectedRoute } from '@/provider/ProtectedRoute'
import { waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../utils/test-utils'

/**
 * Интеграционный тест для проверки редиректа при отсутствии токенов
 *
 * Тестирует:
 * - Редирект на /login при отсутствии токенов в localStorage
 * - Очистку пользователя из UserContext при отсутствии токенов
 * - Редирект на /login при наличии пользователя, но отсутствии токенов
 */
describe('No Token Redirect Integration Test', () => {
	// Сохраняем оригинальный window.location
	const originalLocation = window.location

	beforeEach(() => {
		// Очищаем localStorage перед каждым тестом
		localStorage.clear()

		// Очищаем все моки
		vi.clearAllMocks()

		// Мокируем window.location.href
		delete (window as any).location
		window.location = {
			...originalLocation,
			href: '',
		} as Location
	})

	afterEach(() => {
		// Восстанавливаем оригинальный window.location
		window.location = originalLocation
	})

	it('должен перенаправлять на /login при отсутствии токенов и пользователя', async () => {
		// localStorage пуст (нет токенов, нет пользователя)

		renderWithProviders(
			<ProtectedRoute>
				<div>Protected Content</div>
			</ProtectedRoute>
		)

		// Ждем, пока useEffect выполнится и установит редирект
		await waitFor(
			() => {
				expect(window.location.href).toBe('/login')
			},
			{ timeout: 2000 }
		)
	})

	it('должен перенаправлять на /login при отсутствии токенов, но наличии пользователя в localStorage', async () => {
		// Сохраняем пользователя в localStorage, но не сохраняем токены
		const mockUser = {
			id: '1',
			name: 'Test User',
			email: 'test@example.com',
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
			createdAt: '2024-01-01T00:00:00Z',
		}

		localStorage.setItem('ecoquest_user', JSON.stringify(mockUser))
		// НЕ сохраняем токены

		renderWithProviders(
			<ProtectedRoute>
				<div>Protected Content</div>
			</ProtectedRoute>
		)

		// UserContext должен очистить пользователя при инициализации, так как токенов нет
		// Затем ProtectedRoute должен перенаправить на /login
		await waitFor(
			() => {
				// Проверяем, что пользователь был очищен из localStorage
				const user = localStorage.getItem('ecoquest_user')
				expect(user === null || user === 'null').toBe(true)

				// Проверяем, что произошел редирект
				expect(window.location.href).toBe('/login')
			},
			{ timeout: 2000 }
		)
	})

	it('должен перенаправлять на /login при отсутствии access token, но наличии refresh token', async () => {
		// Сохраняем только refresh token, но не access token
		localStorage.setItem('refreshToken', 'mock-refresh-token')
		// НЕ сохраняем authToken

		const mockUser = {
			id: '1',
			name: 'Test User',
			email: 'test@example.com',
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
			createdAt: '2024-01-01T00:00:00Z',
		}

		localStorage.setItem('ecoquest_user', JSON.stringify(mockUser))

		renderWithProviders(
			<ProtectedRoute>
				<div>Protected Content</div>
			</ProtectedRoute>
		)

		// getToken() проверяет только authToken, поэтому редирект должен произойти
		await waitFor(
			() => {
				expect(window.location.href).toBe('/login')
			},
			{ timeout: 2000 }
		)
	})

	it('НЕ должен перенаправлять на /login при наличии и токенов, и пользователя', async () => {
		// Сохраняем и токены, и пользователя
		localStorage.setItem('authToken', 'mock-access-token')
		localStorage.setItem('refreshToken', 'mock-refresh-token')

		const mockUser = {
			id: '1',
			name: 'Test User',
			email: 'test@example.com',
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
			createdAt: '2024-01-01T00:00:00Z',
		}

		localStorage.setItem('ecoquest_user', JSON.stringify(mockUser))

		const { getByText } = renderWithProviders(
			<ProtectedRoute>
				<div>Protected Content</div>
			</ProtectedRoute>
		)

		// Ждем немного, чтобы убедиться, что useEffect выполнился
		await new Promise(resolve => setTimeout(resolve, 200))

		// Контент должен отображаться
		expect(getByText('Protected Content')).toBeInTheDocument()

		// Редирект не должен произойти
		expect(window.location.href).toBe('')
	})

	it('должен очистить пользователя из UserContext при инициализации, если токенов нет', async () => {
		// Сохраняем пользователя, но не токены
		const mockUser = {
			id: '1',
			name: 'Test User',
			email: 'test@example.com',
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
			createdAt: '2024-01-01T00:00:00Z',
		}

		localStorage.setItem('ecoquest_user', JSON.stringify(mockUser))

		renderWithProviders(
			<ProtectedRoute>
				<div>Protected Content</div>
			</ProtectedRoute>
		)

		// Ждем, пока UserContext очистит пользователя
		await waitFor(
			() => {
				const user = localStorage.getItem('ecoquest_user')
				expect(user === null || user === 'null').toBe(true)
			},
			{ timeout: 2000 }
		)
	})
})

