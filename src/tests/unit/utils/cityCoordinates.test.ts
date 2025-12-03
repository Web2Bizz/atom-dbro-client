import type { Quest } from '@/components/map/types/quest-types'
import type { Organization } from '@/components/map/types/types'
import type { CityResponse } from '@/store/entities/city'
import {
	getCityCoordinates,
	getOrganizationCoordinates,
} from '@/utils/cityCoordinates'
import { describe, expect, it } from 'vitest'

describe('cityCoordinates utils', () => {
	describe('getCityCoordinates', () => {
		const mockQuests: Quest[] = [
			{
				id: '1',
				title: 'Квест 1',
				city: 'Москва',
				type: 'environment',
				category: 'environment',
				story: 'История квеста',
				stages: [],
				overallProgress: 50,
				status: 'active',
				progressColor: 'yellow',
				updates: [],
				coordinates: [55.751244, 37.618423],
				address: 'Москва, Красная площадь',
				curator: {
					name: 'Иван Иванов',
					phone: '+79991234567',
				},
				gallery: [],
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			},
			{
				id: '2',
				title: 'Квест 2',
				city: 'Санкт-Петербург',
				type: 'animals',
				category: 'animals',
				story: 'История квеста 2',
				stages: [],
				overallProgress: 30,
				status: 'active',
				progressColor: 'orange',
				updates: [],
				coordinates: [59.93428, 30.3351],
				address: 'Санкт-Петербург, Невский проспект',
				curator: {
					name: 'Петр Петров',
					phone: '+79991234568',
				},
				gallery: [],
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			},
		]

		const mockCities: CityResponse[] = [
			{
				id: 1,
				name: 'Москва',
				latitude: '55.751244',
				longitude: '37.618423',
				regionId: 1,
				region: {
					id: 1,
					name: 'Московская область',
				},
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			},
			{
				id: 2,
				name: 'Санкт-Петербург',
				latitude: '59.93428',
				longitude: '30.3351',
				regionId: 2,
				region: {
					id: 2,
					name: 'Ленинградская область',
				},
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			},
			{
				id: 3,
				name: 'Казань',
				latitude: '55.8304',
				longitude: '49.0661',
				regionId: 3,
				region: {
					id: 3,
					name: 'Республика Татарстан',
				},
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			},
		]

		it('должен находить координаты города в квестах', () => {
			const result = getCityCoordinates('Москва', {
				apiQuests: mockQuests,
			})
			expect(result).toEqual([55.751244, 37.618423])
		})

		it('должен находить координаты города в списке городов', () => {
			const result = getCityCoordinates('Казань', {
				apiCities: mockCities,
			})
			expect(result).toEqual([55.8304, 49.0661])
		})

		it('должен приоритизировать поиск в квестах над поиском в городах', () => {
			// Создаем квест и город с разными координатами для одного города
			const questsWithDifferentCoords: Quest[] = [
				{
					...mockQuests[0],
					city: 'Москва',
					coordinates: [55.999999, 37.999999], // Другие координаты
				},
			]
			const citiesWithDifferentCoords: CityResponse[] = [
				{
					...mockCities[0],
					name: 'Москва',
					latitude: '55.751244',
					longitude: '37.618423',
				},
			]

			const result = getCityCoordinates('Москва', {
				apiQuests: questsWithDifferentCoords,
				apiCities: citiesWithDifferentCoords,
			})

			// Должны вернуться координаты из квеста
			expect(result).toEqual([55.999999, 37.999999])
		})

		it('должен искать в городах, если не найден в квестах', () => {
			const result = getCityCoordinates('Казань', {
				apiQuests: mockQuests, // Казани нет в квестах
				apiCities: mockCities,
			})
			expect(result).toEqual([55.8304, 49.0661])
		})

		it('должен возвращать null, если город не найден в квестах и городах', () => {
			const result = getCityCoordinates('Новосибирск', {
				apiQuests: mockQuests,
				apiCities: mockCities,
			})
			expect(result).toBeNull()
		})

		it('должен возвращать null, если options не переданы', () => {
			const result = getCityCoordinates('Москва')
			expect(result).toBeNull()
		})

		it('должен возвращать null, если apiQuests пустой массив', () => {
			const result = getCityCoordinates('Москва', {
				apiQuests: [],
			})
			expect(result).toBeNull()
		})

		it('должен возвращать null, если apiCities пустой массив', () => {
			const result = getCityCoordinates('Москва', {
				apiCities: [],
			})
			expect(result).toBeNull()
		})

		it('должен возвращать null, если apiQuests undefined', () => {
			const result = getCityCoordinates('Москва', {
				apiCities: mockCities,
			})
			// Должен найти в городах
			expect(result).toEqual([55.751244, 37.618423])
		})

		it('должен возвращать null, если apiCities undefined', () => {
			const result = getCityCoordinates('Новосибирск', {
				apiQuests: mockQuests,
			})
			expect(result).toBeNull()
		})

		it('должен корректно обрабатывать поиск с учетом регистра (точное совпадение)', () => {
			// Функция использует строгое сравнение, поэтому регистр важен
			const result = getCityCoordinates('москва', {
				apiQuests: mockQuests,
			})
			// Должен вернуть null, так как 'москва' !== 'Москва'
			expect(result).toBeNull()
		})

		it('должен корректно преобразовывать строковые координаты в числа для городов', () => {
			const cityWithStringCoords: CityResponse[] = [
				{
					id: 4,
					name: 'Екатеринбург',
					latitude: '56.8431',
					longitude: '60.6454',
					regionId: 4,
					region: {
						id: 4,
						name: 'Свердловская область',
					},
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
			]

			const result = getCityCoordinates('Екатеринбург', {
				apiCities: cityWithStringCoords,
			})

			expect(result).toEqual([56.8431, 60.6454])
			expect(typeof result?.[0]).toBe('number')
			expect(typeof result?.[1]).toBe('number')
		})

		it('должен обрабатывать координаты с десятичными знаками', () => {
			const cityWithDecimalCoords: CityResponse[] = [
				{
					id: 5,
					name: 'Владивосток',
					latitude: '43.115067',
					longitude: '131.885494',
					regionId: 5,
					region: {
						id: 5,
						name: 'Приморский край',
					},
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
			]

			const result = getCityCoordinates('Владивосток', {
				apiCities: cityWithDecimalCoords,
			})

			expect(result).toEqual([43.115067, 131.885494])
		})

		it('должен обрабатывать отрицательные координаты (западное полушарие)', () => {
			const cityWithNegativeCoords: CityResponse[] = [
				{
					id: 6,
					name: 'Нью-Йорк',
					latitude: '40.7128',
					longitude: '-74.0060',
					regionId: 6,
					region: {
						id: 6,
						name: 'Нью-Йорк',
					},
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
			]

			const result = getCityCoordinates('Нью-Йорк', {
				apiCities: cityWithNegativeCoords,
			})

			expect(result).toEqual([40.7128, -74.006])
		})

		it('должен обрабатывать пустую строку как имя города', () => {
			const result = getCityCoordinates('', {
				apiQuests: mockQuests,
				apiCities: mockCities,
			})
			expect(result).toBeNull()
		})
	})

	describe('getOrganizationCoordinates', () => {
		const mockOrganization: Organization = {
			id: 1,
			name: 'Эко-Организация',
			latitude: '55.751244',
			longitude: '37.618423',
			summary: 'Краткое описание',
			mission: 'Миссия организации',
			description: 'Полное описание',
			goals: ['Цель 1', 'Цель 2'],
			needs: ['Нужда 1'],
			address: 'Москва, ул. Примерная, д. 1',
			contacts: [
				{
					name: 'Телефон',
					value: '+79991234567',
				},
			],
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

		it('должен корректно преобразовывать строковые координаты в числа', () => {
			const result = getOrganizationCoordinates(mockOrganization)
			expect(result).toEqual([55.751244, 37.618423])
			expect(typeof result[0]).toBe('number')
			expect(typeof result[1]).toBe('number')
		})

		it('должен обрабатывать координаты с большим количеством десятичных знаков', () => {
			const orgWithPreciseCoords: Organization = {
				...mockOrganization,
				latitude: '55.751244123456',
				longitude: '37.618423789012',
			}

			const result = getOrganizationCoordinates(orgWithPreciseCoords)
			expect(result).toEqual([55.751244123456, 37.618423789012])
		})

		it('должен обрабатывать отрицательные координаты', () => {
			const orgWithNegativeCoords: Organization = {
				...mockOrganization,
				latitude: '40.7128',
				longitude: '-74.0060',
			}

			const result = getOrganizationCoordinates(orgWithNegativeCoords)
			expect(result).toEqual([40.7128, -74.006])
		})

		it('должен обрабатывать координаты равные нулю', () => {
			const orgWithZeroCoords: Organization = {
				...mockOrganization,
				latitude: '0',
				longitude: '0',
			}

			const result = getOrganizationCoordinates(orgWithZeroCoords)
			expect(result).toEqual([0, 0])
		})

		it('должен обрабатывать координаты с ведущими нулями', () => {
			const orgWithLeadingZeros: Organization = {
				...mockOrganization,
				latitude: '055.751244',
				longitude: '037.618423',
			}

			const result = getOrganizationCoordinates(orgWithLeadingZeros)
			expect(result).toEqual([55.751244, 37.618423])
		})

		it('должен обрабатывать координаты с пробелами (parseFloat их игнорирует)', () => {
			const orgWithSpaces: Organization = {
				...mockOrganization,
				latitude: '  55.751244  ',
				longitude: '  37.618423  ',
			}

			const result = getOrganizationCoordinates(orgWithSpaces)
			expect(result).toEqual([55.751244, 37.618423])
		})

		it('должен обрабатывать объект с минимальными полями (latitude и longitude)', () => {
			const minimalOrg = {
				latitude: '55.751244',
				longitude: '37.618423',
			}

			const result = getOrganizationCoordinates(minimalOrg)
			expect(result).toEqual([55.751244, 37.618423])
		})

		it('должен обрабатывать координаты в научной нотации', () => {
			const orgWithScientificNotation: Organization = {
				...mockOrganization,
				latitude: '5.5751244e1', // 55.751244
				longitude: '3.7618423e1', // 37.618423
			}

			const result = getOrganizationCoordinates(orgWithScientificNotation)
			expect(result).toEqual([55.751244, 37.618423])
		})

		it('должен обрабатывать координаты с дробной частью начинающейся с нуля', () => {
			const orgWithZeroDecimal: Organization = {
				...mockOrganization,
				latitude: '55.0751244',
				longitude: '37.0618423',
			}

			const result = getOrganizationCoordinates(orgWithZeroDecimal)
			expect(result).toEqual([55.0751244, 37.0618423])
		})

		it('должен обрабатывать координаты без дробной части', () => {
			const orgWithIntegerCoords: Organization = {
				...mockOrganization,
				latitude: '56',
				longitude: '38',
			}

			const result = getOrganizationCoordinates(orgWithIntegerCoords)
			expect(result).toEqual([56, 38])
		})

		it('должен обрабатывать очень большие координаты', () => {
			const orgWithLargeCoords: Organization = {
				...mockOrganization,
				latitude: '90.0', // Максимальная широта
				longitude: '180.0', // Максимальная долгота
			}

			const result = getOrganizationCoordinates(orgWithLargeCoords)
			expect(result).toEqual([90, 180])
		})

		it('должен обрабатывать очень маленькие координаты', () => {
			const orgWithSmallCoords: Organization = {
				...mockOrganization,
				latitude: '-90.0', // Минимальная широта
				longitude: '-180.0', // Минимальная долгота
			}

			const result = getOrganizationCoordinates(orgWithSmallCoords)
			expect(result).toEqual([-90, -180])
		})
	})
})
