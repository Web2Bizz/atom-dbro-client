import type { Quest } from '@/components/map/types/quest-types'
import type { Organization } from '@/components/map/types/types'
import {
	getAllOrganizations,
	getAllQuests,
	getUserCreatedOrganizations,
	getUserCreatedQuests,
	getUserOrganization,
	getUserQuest,
	updateUserOrganization,
	updateUserQuest,
} from '@/utils/userData'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Мокируем logger
vi.mock('@/utils/logger', () => ({
	logger: {
		error: vi.fn(),
	},
}))

describe('userData utils', () => {
	beforeEach(() => {
		localStorage.clear()
		vi.clearAllMocks()
	})

	describe('getUserCreatedQuests', () => {
		it('должен возвращать пустой массив, если нет сохраненных квестов', () => {
			const result = getUserCreatedQuests()
			expect(result).toEqual([])
		})

		it('должен возвращать сохраненные квесты', () => {
			const quests: Quest[] = [
				{
					id: '1',
					title: 'Квест 1',
					city: 'Москва',
					type: 'environment',
					category: 'environment',
					story: 'История',
					stages: [],
					overallProgress: 0,
					status: 'active',
					progressColor: 'red',
					updates: [],
					coordinates: [55.751244, 37.618423],
					address: 'Адрес',
					curator: {
						name: 'Иван',
						phone: '+79991234567',
					},
					gallery: [],
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
			]
			localStorage.setItem('user_created_quests', JSON.stringify(quests))
			const result = getUserCreatedQuests()
			expect(result).toEqual(quests)
		})

		it('должен возвращать пустой массив при ошибке парсинга', () => {
			localStorage.setItem('user_created_quests', 'invalid json')
			const result = getUserCreatedQuests()
			expect(result).toEqual([])
		})
	})

	describe('getUserCreatedOrganizations', () => {
		it('должен возвращать пустой массив, если нет сохраненных организаций', () => {
			const result = getUserCreatedOrganizations()
			expect(result).toEqual([])
		})

		it('должен возвращать сохраненные организации', () => {
			const organizations: Organization[] = [
				{
					id: 1,
					name: 'Организация 1',
					latitude: '55.751244',
					longitude: '37.618423',
					summary: 'Краткое описание',
					mission: 'Миссия',
					description: 'Описание',
					goals: [],
					needs: [],
					address: 'Адрес',
					contacts: [],
					organizationTypes: [],
					gallery: [],
					city: {
						id: 1,
						name: 'Москва',
						latitude: '55.751244',
						longitude: '37.618423',
					},
					helpTypes: [],
				},
			]
			localStorage.setItem(
				'user_created_organizations',
				JSON.stringify(organizations)
			)
			const result = getUserCreatedOrganizations()
			expect(result).toEqual(organizations)
		})

		it('должен возвращать пустой массив при ошибке парсинга', () => {
			localStorage.setItem('user_created_organizations', 'invalid json')
			const result = getUserCreatedOrganizations()
			expect(result).toEqual([])
		})
	})

	describe('getUserQuest', () => {
		it('должен находить квест по ID', () => {
			const quests: Quest[] = [
				{
					id: '1',
					title: 'Квест 1',
					city: 'Москва',
					type: 'environment',
					category: 'environment',
					story: 'История',
					stages: [],
					overallProgress: 0,
					status: 'active',
					progressColor: 'red',
					updates: [],
					coordinates: [55.751244, 37.618423],
					address: 'Адрес',
					curator: {
						name: 'Иван',
						phone: '+79991234567',
					},
					gallery: [],
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
				{
					id: '2',
					title: 'Квест 2',
					city: 'СПб',
					type: 'animals',
					category: 'animals',
					story: 'История 2',
					stages: [],
					overallProgress: 0,
					status: 'active',
					progressColor: 'red',
					updates: [],
					coordinates: [59.93428, 30.3351],
					address: 'Адрес 2',
					curator: {
						name: 'Петр',
						phone: '+79991234568',
					},
					gallery: [],
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
			]
			localStorage.setItem('user_created_quests', JSON.stringify(quests))
			const result = getUserQuest('2')
			expect(result).toBeDefined()
			expect(result?.id).toBe('2')
			expect(result?.title).toBe('Квест 2')
		})

		it('должен возвращать null для несуществующего квеста', () => {
			const result = getUserQuest('999')
			expect(result).toBeNull()
		})
	})

	describe('getUserOrganization', () => {
		it('должен находить организацию по ID', () => {
			const organizations: Organization[] = [
				{
					id: 1,
					name: 'Организация 1',
					latitude: '55.751244',
					longitude: '37.618423',
					summary: 'Краткое описание',
					mission: 'Миссия',
					description: 'Описание',
					goals: [],
					needs: [],
					address: 'Адрес',
					contacts: [],
					organizationTypes: [],
					gallery: [],
					city: {
						id: 1,
						name: 'Москва',
						latitude: '55.751244',
						longitude: '37.618423',
					},
					helpTypes: [],
				},
			]
			localStorage.setItem(
				'user_created_organizations',
				JSON.stringify(organizations)
			)
			const result = getUserOrganization('1')
			expect(result).toBeDefined()
			expect(result?.id).toBe(1)
		})

		it('должен возвращать null для несуществующей организации', () => {
			const result = getUserOrganization('999')
			expect(result).toBeNull()
		})
	})

	describe('updateUserQuest', () => {
		it('должен обновлять существующий квест', () => {
			const quests: Quest[] = [
				{
					id: '1',
					title: 'Квест 1',
					city: 'Москва',
					type: 'environment',
					category: 'environment',
					story: 'История',
					stages: [],
					overallProgress: 0,
					status: 'active',
					progressColor: 'red',
					updates: [],
					coordinates: [55.751244, 37.618423],
					address: 'Адрес',
					curator: {
						name: 'Иван',
						phone: '+79991234567',
					},
					gallery: [],
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
			]
			localStorage.setItem('user_created_quests', JSON.stringify(quests))

			const updatedQuest: Quest = {
				...quests[0],
				title: 'Обновленный квест',
			}

			updateUserQuest(updatedQuest)

			const saved = JSON.parse(
				localStorage.getItem('user_created_quests') || '[]'
			)
			expect(saved[0].title).toBe('Обновленный квест')
		})

		it('должен добавлять новый квест, если его нет', () => {
			const newQuest: Quest = {
				id: '2',
				title: 'Новый квест',
				city: 'Москва',
				type: 'environment',
				category: 'environment',
				story: 'История',
				stages: [],
				overallProgress: 0,
				status: 'active',
				progressColor: 'red',
				updates: [],
				coordinates: [55.751244, 37.618423],
				address: 'Адрес',
				curator: {
					name: 'Иван',
					phone: '+79991234567',
				},
				gallery: [],
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			}

			updateUserQuest(newQuest)

			const saved = JSON.parse(
				localStorage.getItem('user_created_quests') || '[]'
			)
			expect(saved).toHaveLength(1)
			expect(saved[0].id).toBe('2')
		})

		it('должен выбрасывать ошибку при превышении лимита localStorage', () => {
			// Создаем очень большой объект
			const largeQuest: Quest = {
				id: '1',
				title: 'A'.repeat(5 * 1024 * 1024), // 5MB строка
				city: 'Москва',
				type: 'environment',
				category: 'environment',
				story: 'История',
				stages: [],
				overallProgress: 0,
				status: 'active',
				progressColor: 'red',
				updates: [],
				coordinates: [55.751244, 37.618423],
				address: 'Адрес',
				curator: {
					name: 'Иван',
					phone: '+79991234567',
				},
				gallery: [],
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			}

			// Мокируем ошибку QuotaExceededError
			const originalSetItem = localStorage.setItem
			localStorage.setItem = vi.fn(() => {
				throw new DOMException('QuotaExceededError')
			})

			expect(() => updateUserQuest(largeQuest)).toThrow()

			localStorage.setItem = originalSetItem
		})
	})

	describe('updateUserOrganization', () => {
		it('должен обновлять существующую организацию', () => {
			const organizations: Organization[] = [
				{
					id: 1,
					name: 'Организация 1',
					latitude: '55.751244',
					longitude: '37.618423',
					summary: 'Краткое описание',
					mission: 'Миссия',
					description: 'Описание',
					goals: [],
					needs: [],
					address: 'Адрес',
					contacts: [],
					organizationTypes: [],
					gallery: [],
					city: {
						id: 1,
						name: 'Москва',
						latitude: '55.751244',
						longitude: '37.618423',
					},
					helpTypes: [],
				},
			]
			localStorage.setItem(
				'user_created_organizations',
				JSON.stringify(organizations)
			)

			const updatedOrg: Organization = {
				...organizations[0],
				name: 'Обновленная организация',
			}

			updateUserOrganization(updatedOrg)

			const saved = JSON.parse(
				localStorage.getItem('user_created_organizations') || '[]'
			)
			expect(saved[0].name).toBe('Обновленная организация')
		})

		it('должен добавлять новую организацию, если её нет', () => {
			const newOrg: Organization = {
				id: 2,
				name: 'Новая организация',
				latitude: '55.751244',
				longitude: '37.618423',
				summary: 'Краткое описание',
				mission: 'Миссия',
				description: 'Описание',
				goals: [],
				needs: [],
				address: 'Адрес',
				contacts: [],
				organizationTypes: [],
				gallery: [],
				city: {
					id: 1,
					name: 'Москва',
					latitude: '55.751244',
					longitude: '37.618423',
				},
				helpTypes: [],
			}

			updateUserOrganization(newOrg)

			const saved = JSON.parse(
				localStorage.getItem('user_created_organizations') || '[]'
			)
			expect(saved).toHaveLength(1)
			expect(saved[0].id).toBe(2)
		})
	})

	describe('getAllQuests', () => {
		it('должен объединять базовые и пользовательские квесты', () => {
			const userQuest: Quest = {
				id: 'user-1',
				title: 'Пользовательский квест',
				city: 'Москва',
				type: 'environment',
				category: 'environment',
				story: 'История',
				stages: [],
				overallProgress: 0,
				status: 'active',
				progressColor: 'red',
				updates: [],
				coordinates: [55.751244, 37.618423],
				address: 'Адрес',
				curator: {
					name: 'Иван',
					phone: '+79991234567',
				},
				gallery: [],
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			}
			localStorage.setItem('user_created_quests', JSON.stringify([userQuest]))

			const baseQuests: Quest[] = [
				{
					id: 'base-1',
					title: 'Базовый квест',
					city: 'СПб',
					type: 'animals',
					category: 'animals',
					story: 'История',
					stages: [],
					overallProgress: 0,
					status: 'active',
					progressColor: 'red',
					updates: [],
					coordinates: [59.93428, 30.3351],
					address: 'Адрес',
					curator: {
						name: 'Петр',
						phone: '+79991234568',
					},
					gallery: [],
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
			]

			const result = getAllQuests(baseQuests)
			expect(result).toHaveLength(2)
			expect(result[0].id).toBe('base-1')
			expect(result[1].id).toBe('user-1')
		})

		it('должен возвращать только базовые квесты, если нет пользовательских', () => {
			const baseQuests: Quest[] = [
				{
					id: 'base-1',
					title: 'Базовый квест',
					city: 'Москва',
					type: 'environment',
					category: 'environment',
					story: 'История',
					stages: [],
					overallProgress: 0,
					status: 'active',
					progressColor: 'red',
					updates: [],
					coordinates: [55.751244, 37.618423],
					address: 'Адрес',
					curator: {
						name: 'Иван',
						phone: '+79991234567',
					},
					gallery: [],
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
			]

			const result = getAllQuests(baseQuests)
			expect(result).toHaveLength(1)
			expect(result[0].id).toBe('base-1')
		})
	})

	describe('getAllOrganizations', () => {
		it('должен объединять базовые и пользовательские организации', () => {
			const userOrg: Organization = {
				id: 1,
				name: 'Пользовательская организация',
				latitude: '55.751244',
				longitude: '37.618423',
				summary: 'Краткое описание',
				mission: 'Миссия',
				description: 'Описание',
				goals: [],
				needs: [],
				address: 'Адрес',
				contacts: [],
				organizationTypes: [],
				gallery: [],
				city: {
					id: 1,
					name: 'Москва',
					latitude: '55.751244',
					longitude: '37.618423',
				},
				helpTypes: [],
			}
			localStorage.setItem(
				'user_created_organizations',
				JSON.stringify([userOrg])
			)

			const baseOrgs: Organization[] = [
				{
					id: 2,
					name: 'Базовая организация',
					latitude: '59.93428',
					longitude: '30.3351',
					summary: 'Краткое описание',
					mission: 'Миссия',
					description: 'Описание',
					goals: [],
					needs: [],
					address: 'Адрес',
					contacts: [],
					organizationTypes: [],
					gallery: [],
					city: {
						id: 2,
						name: 'СПб',
						latitude: '59.93428',
						longitude: '30.3351',
					},
					helpTypes: [],
				},
			]

			const result = getAllOrganizations(baseOrgs)
			expect(result).toHaveLength(2)
			expect(result[0].id).toBe(2)
			expect(result[1].id).toBe(1)
		})

		it('должен возвращать только базовые организации, если нет пользовательских', () => {
			const baseOrgs: Organization[] = [
				{
					id: 1,
					name: 'Базовая организация',
					latitude: '55.751244',
					longitude: '37.618423',
					summary: 'Краткое описание',
					mission: 'Миссия',
					description: 'Описание',
					goals: [],
					needs: [],
					address: 'Адрес',
					contacts: [],
					organizationTypes: [],
					gallery: [],
					city: {
						id: 1,
						name: 'Москва',
						latitude: '55.751244',
						longitude: '37.618423',
					},
					helpTypes: [],
				},
			]

			const result = getAllOrganizations(baseOrgs)
			expect(result).toHaveLength(1)
			expect(result[0].id).toBe(1)
		})
	})
})

