import type { UserFullData } from '@/store/entities/auth/model/type'
import {
	getRefreshToken,
	getToken,
	removeToken,
	saveRefreshToken,
	saveToken,
	transformUserFromAPI,
} from '@/utils/auth'
import { beforeEach, describe, expect, it } from 'vitest'

describe('auth utils', () => {
	// Очищаем localStorage перед каждым тестом
	beforeEach(() => {
		localStorage.clear()
	})

	describe('saveToken', () => {
		it('должен сохранять токен в localStorage', () => {
			const token = 'test-access-token'
			saveToken(token)
			expect(localStorage.getItem('authToken')).toBe(token)
		})

		it('должен перезаписывать существующий токен', () => {
			const oldToken = 'old-token'
			const newToken = 'new-token'
			saveToken(oldToken)
			saveToken(newToken)
			expect(localStorage.getItem('authToken')).toBe(newToken)
		})

		it('должен работать безопасно в SSR окружении', () => {
			// Сохраняем оригинальный window
			const originalWindow = globalThis.window
			// Удаляем window для имитации SSR
			// @ts-expect-error - намеренно удаляем window для теста
			delete globalThis.window

			// Функция не должна выбрасывать ошибку
			expect(() => saveToken('test-token')).not.toThrow()

			// Восстанавливаем window
			globalThis.window = originalWindow
		})
	})

	describe('saveRefreshToken', () => {
		it('должен сохранять refresh token в localStorage', () => {
			const refreshToken = 'test-refresh-token'
			saveRefreshToken(refreshToken)
			expect(localStorage.getItem('refreshToken')).toBe(refreshToken)
		})

		it('должен перезаписывать существующий refresh token', () => {
			const oldToken = 'old-refresh-token'
			const newToken = 'new-refresh-token'
			saveRefreshToken(oldToken)
			saveRefreshToken(newToken)
			expect(localStorage.getItem('refreshToken')).toBe(newToken)
		})

		it('должен работать безопасно в SSR окружении', () => {
			const originalWindow = globalThis.window
			// @ts-expect-error - намеренно удаляем window для теста
			delete globalThis.window

			expect(() => saveRefreshToken('test-token')).not.toThrow()

			globalThis.window = originalWindow
		})
	})

	describe('removeToken', () => {
		it('должен удалять оба токена из localStorage', () => {
			saveToken('access-token')
			saveRefreshToken('refresh-token')
			removeToken()
			expect(localStorage.getItem('authToken')).toBeNull()
			expect(localStorage.getItem('refreshToken')).toBeNull()
		})

		it('должен работать безопасно, если токены отсутствуют', () => {
			expect(() => removeToken()).not.toThrow()
			expect(localStorage.getItem('authToken')).toBeNull()
			expect(localStorage.getItem('refreshToken')).toBeNull()
		})

		it('должен работать безопасно в SSR окружении', () => {
			const originalWindow = globalThis.window
			// @ts-expect-error - намеренно удаляем window для теста
			delete globalThis.window

			expect(() => removeToken()).not.toThrow()

			globalThis.window = originalWindow
		})
	})

	describe('getToken', () => {
		it('должен получать токен из localStorage', () => {
			const token = 'test-access-token'
			localStorage.setItem('authToken', token)
			expect(getToken()).toBe(token)
		})

		it('должен возвращать null, если токен отсутствует', () => {
			expect(getToken()).toBeNull()
		})

		it('должен работать безопасно в SSR окружении', () => {
			const originalWindow = globalThis.window
			// @ts-expect-error - намеренно удаляем window для теста
			delete globalThis.window

			expect(getToken()).toBeNull()

			globalThis.window = originalWindow
		})
	})

	describe('getRefreshToken', () => {
		it('должен получать refresh token из localStorage', () => {
			const refreshToken = 'test-refresh-token'
			localStorage.setItem('refreshToken', refreshToken)
			expect(getRefreshToken()).toBe(refreshToken)
		})

		it('должен возвращать null, если refresh token отсутствует', () => {
			expect(getRefreshToken()).toBeNull()
		})

		it('должен работать безопасно в SSR окружении', () => {
			const originalWindow = globalThis.window
			// @ts-expect-error - намеренно удаляем window для теста
			delete globalThis.window

			expect(getRefreshToken()).toBeNull()

			globalThis.window = originalWindow
		})
	})

	describe('transformUserFromAPI', () => {
		const baseApiUser: UserFullData = {
			id: '1',
			firstName: 'Иван',
			lastName: 'Иванов',
			middleName: 'Иванович',
			email: 'ivan@example.com',
			level: 5,
			experience: 100,
			stats: {
				totalQuests: 10,
				completedQuests: 5,
				totalDonations: 5000,
				totalVolunteerHours: 20,
			},
			achievements: [],
			participatingQuests: [],
			questId: null,
			organisationId: null,
			createdAt: '2024-01-01T00:00:00Z',
			updatedAt: '2024-01-01T00:00:00Z',
		}

		it('должен корректно преобразовывать базовые данные пользователя', () => {
			const result = transformUserFromAPI(baseApiUser)

			expect(result.id).toBe('1')
			expect(result.name).toBe('Иван Иванов')
			expect(result.email).toBe('ivan@example.com')
			expect(result.level.level).toBe(5)
			expect(result.level.experience).toBe(100)
			expect(result.level.title).toBe('Активный')
			expect(result.stats.totalQuests).toBe(10)
			expect(result.stats.completedQuests).toBe(5)
			expect(result.stats.totalDonations).toBe(5000)
			expect(result.stats.totalVolunteerHours).toBe(20)
			expect(result.achievements).toEqual([])
			expect(result.participatingQuests).toEqual([])
			expect(result.createdQuestId).toBeUndefined()
			expect(result.createdOrganizationId).toBeUndefined()
		})

		it('должен формировать имя из firstName и lastName', () => {
			const result = transformUserFromAPI(baseApiUser)
			expect(result.name).toBe('Иван Иванов')
		})

		it('должен использовать email как имя, если firstName и lastName пустые', () => {
			const userWithoutName: UserFullData = {
				...baseApiUser,
				firstName: '',
				lastName: '',
			}
			const result = transformUserFromAPI(userWithoutName)
			expect(result.name).toBe('ivan@example.com')
		})

		it('должен обрезать пробелы в имени (trim)', () => {
			const userWithSpaces: UserFullData = {
				...baseApiUser,
				firstName: '  Иван  ',
				lastName: '  Иванов  ',
			}
			const result = transformUserFromAPI(userWithSpaces)
			expect(result.name).toBe('Иван Иванов')
		})

		it('должен использовать только firstName и lastName, игнорируя middleName', () => {
			const result = transformUserFromAPI(baseApiUser)
			expect(result.name).toBe('Иван Иванов')
			expect(result.name).not.toContain('Иванович')
		})

		describe('обработка avatarUrls', () => {
			it('должен использовать последний размер из avatarUrls (самый большой)', () => {
				const userWithAvatarUrls: UserFullData = {
					...baseApiUser,
					avatarUrls: {
						size_4: 'https://example.com/avatar_size_4.jpg',
						size_5: 'https://example.com/avatar_size_5.jpg',
						size_6: 'https://example.com/avatar_size_6.jpg',
					},
				}
				const result = transformUserFromAPI(userWithAvatarUrls)
				expect(result.avatar).toBe('https://example.com/avatar_size_6.jpg')
			})

			it('должен обрабатывать avatarUrls с числовыми ключами (обратная совместимость)', () => {
				const userWithNumericKeys: UserFullData = {
					...baseApiUser,
					avatarUrls: {
						4: 'https://example.com/avatar_4.jpg',
						5: 'https://example.com/avatar_5.jpg',
					} as Record<string, string>,
				}
				const result = transformUserFromAPI(userWithNumericKeys)
				expect(result.avatar).toBe('https://example.com/avatar_5.jpg')
			})

			it('должен использовать URL напрямую, если значение уже является URL', () => {
				const userWithUrl: UserFullData = {
					...baseApiUser,
					avatarUrls: {
						size_4: 'https://example.com/avatar.jpg',
					},
				}
				const result = transformUserFromAPI(userWithUrl)
				expect(result.avatar).toBe('https://example.com/avatar.jpg')
			})

			it('должен обрабатывать пустой объект avatarUrls', () => {
				const userWithEmptyAvatarUrls: UserFullData = {
					...baseApiUser,
					avatarUrls: {},
				}
				const result = transformUserFromAPI(userWithEmptyAvatarUrls)
				// Должен вернуться к avatar или undefined
				expect(result.avatar).toBeUndefined()
			})

			it('должен игнорировать невалидные ключи в avatarUrls', () => {
				const userWithInvalidKeys: UserFullData = {
					...baseApiUser,
					avatarUrls: {
						invalid_key: 'https://example.com/avatar.jpg',
						another_invalid: 'https://example.com/avatar2.jpg',
					},
				}
				const result = transformUserFromAPI(userWithInvalidKeys)
				// Невалидные ключи должны быть проигнорированы
				expect(result.avatar).toBeUndefined()
			})

			it('должен обрабатывать смешанные валидные и невалидные ключи', () => {
				const userWithMixedKeys: UserFullData = {
					...baseApiUser,
					avatarUrls: {
						invalid_key: 'https://example.com/invalid.jpg',
						size_5: 'https://example.com/valid.jpg',
						another_invalid: 'https://example.com/invalid2.jpg',
					},
				}
				const result = transformUserFromAPI(userWithMixedKeys)
				// Должен использовать валидный ключ size_5
				expect(result.avatar).toBe('https://example.com/valid.jpg')
			})

			it('должен обрабатывать avatarUrls с одним элементом', () => {
				const userWithSingleAvatar: UserFullData = {
					...baseApiUser,
					avatarUrls: {
						size_4: 'https://example.com/single.jpg',
					},
				}
				const result = transformUserFromAPI(userWithSingleAvatar)
				expect(result.avatar).toBe('https://example.com/single.jpg')
			})

			it('должен обрабатывать avatarUrls где значение не URL (обратная совместимость)', () => {
				const userWithNonUrlValue: UserFullData = {
					...baseApiUser,
					avatarUrls: {
						size_4: 'some-path',
					},
				}
				const result = transformUserFromAPI(userWithNonUrlValue)
				// Согласно коду, возвращается значение как есть (строка 56)
				expect(result.avatar).toBe('some-path')
			})
		})

		describe('обработка числового avatar', () => {
			it('должен формировать URL для числового avatar (ID)', () => {
				const userWithNumericAvatar: UserFullData = {
					...baseApiUser,
					// @ts-expect-error - тестируем обработку числового avatar
					avatar: 123,
				}
				const result = transformUserFromAPI(userWithNumericAvatar)
				expect(result.avatar).toBe(
					'https://it-hackathon-team05.mephi.ru/api/v1/upload/images/123'
				)
			})

			it('должен приоритизировать avatarUrls над avatar', () => {
				const userWithBoth: UserFullData = {
					...baseApiUser,
					// @ts-expect-error - тестируем обработку числового avatar
					avatar: 123,
					avatarUrls: {
						size_5: 'https://example.com/avatar.jpg',
					},
				}
				const result = transformUserFromAPI(userWithBoth)
				expect(result.avatar).toBe('https://example.com/avatar.jpg')
			})
		})

		describe('обработка строкового avatar', () => {
			it('должен формировать URL для строкового avatar, если это число', () => {
				const userWithStringAvatar: UserFullData = {
					...baseApiUser,
					avatar: '456',
				}
				const result = transformUserFromAPI(userWithStringAvatar)
				expect(result.avatar).toBe(
					'https://it-hackathon-team05.mephi.ru/api/v1/upload/images/456'
				)
			})

			it('должен использовать строковый avatar как URL, если это уже URL', () => {
				const userWithUrlAvatar: UserFullData = {
					...baseApiUser,
					avatar: 'https://example.com/avatar.jpg',
				}
				const result = transformUserFromAPI(userWithUrlAvatar)
				expect(result.avatar).toBe('https://example.com/avatar.jpg')
			})

			it('должен возвращать undefined для невалидного строкового avatar', () => {
				const userWithInvalidAvatar: UserFullData = {
					...baseApiUser,
					avatar: 'invalid',
				}
				const result = transformUserFromAPI(userWithInvalidAvatar)
				expect(result.avatar).toBeUndefined()
			})

			it('должен обрабатывать пустую строку avatar', () => {
				const userWithEmptyAvatar: UserFullData = {
					...baseApiUser,
					avatar: '',
				}
				const result = transformUserFromAPI(userWithEmptyAvatar)
				expect(result.avatar).toBeUndefined()
			})

			it('должен обрабатывать avatar = "0" (строка)', () => {
				const userWithZeroString: UserFullData = {
					...baseApiUser,
					avatar: '0',
				}
				const result = transformUserFromAPI(userWithZeroString)
				// 0 не > 0, поэтому должно вернуть undefined
				expect(result.avatar).toBeUndefined()
			})

			it('должен обрабатывать avatar = "-1" (отрицательное число в строке)', () => {
				const userWithNegativeString: UserFullData = {
					...baseApiUser,
					avatar: '-1',
				}
				const result = transformUserFromAPI(userWithNegativeString)
				// -1 не > 0, поэтому должно вернуть undefined
				expect(result.avatar).toBeUndefined()
			})

			it('должен обрабатывать avatar = 0 (число)', () => {
				const userWithZeroNumber: UserFullData = {
					...baseApiUser,
					// @ts-expect-error - тестируем обработку нулевого avatar
					avatar: 0,
				}
				const result = transformUserFromAPI(userWithZeroNumber)
				// Число 0 должно формировать URL
				expect(result.avatar).toBe(
					'https://it-hackathon-team05.mephi.ru/api/v1/upload/images/0'
				)
			})

			it('должен обрабатывать avatar = -1 (отрицательное число)', () => {
				const userWithNegativeNumber: UserFullData = {
					...baseApiUser,
					// @ts-expect-error - тестируем обработку отрицательного avatar
					avatar: -1,
				}
				const result = transformUserFromAPI(userWithNegativeNumber)
				// Отрицательное число должно формировать URL (код не проверяет > 0 для чисел)
				expect(result.avatar).toBe(
					'https://it-hackathon-team05.mephi.ru/api/v1/upload/images/-1'
				)
			})

			it('должен обрабатывать http:// URL (не только https://)', () => {
				const userWithHttpUrl: UserFullData = {
					...baseApiUser,
					avatar: 'http://example.com/avatar.jpg',
				}
				const result = transformUserFromAPI(userWithHttpUrl)
				expect(result.avatar).toBe('http://example.com/avatar.jpg')
			})
		})

		describe('нормализация уровня пользователя', () => {
			it('должен нормализовать уровень с избыточным опытом', () => {
				const userWithExcessExp: UserFullData = {
					...baseApiUser,
					level: 5,
					experience: 500, // Избыточный опыт
				}
				const result = transformUserFromAPI(userWithExcessExp)
				// Уровень должен повыситься, если опыта достаточно
				expect(result.level.level).toBeGreaterThanOrEqual(5)
			})

			it('должен ограничивать уровень максимальным значением', () => {
				const maxLevelUser: UserFullData = {
					...baseApiUser,
					level: 60, // Больше MAX_LEVEL (50)
					experience: 1000000,
				}
				const result = transformUserFromAPI(maxLevelUser)
				expect(result.level.level).toBe(50)
				expect(result.level.experience).toBe(0)
				expect(result.level.experienceToNext).toBe(0)
			})

			it('должен корректно рассчитывать experienceToNext', () => {
				const result = transformUserFromAPI(baseApiUser)
				expect(result.level.experienceToNext).toBeGreaterThan(0)
			})

			it('должен устанавливать правильный title для уровня', () => {
				const level2User: UserFullData = {
					...baseApiUser,
					level: 2,
					experience: 0,
				}
				const result = transformUserFromAPI(level2User)
				expect(result.level.title).toBe('Ученик')
			})

			it('должен обрабатывать уровень 0 (Новичок)', () => {
				const level0User: UserFullData = {
					...baseApiUser,
					level: 0,
					experience: 0,
				}
				const result = transformUserFromAPI(level0User)
				expect(result.level.title).toBe('Новичок')
			})

			it('должен обрабатывать уровень 1 (Новичок)', () => {
				const level1User: UserFullData = {
					...baseApiUser,
					level: 1,
					experience: 0,
				}
				const result = transformUserFromAPI(level1User)
				expect(result.level.title).toBe('Новичок')
			})

			it('должен обрабатывать все граничные значения уровней', () => {
				const testCases = [
					{ level: 0, expectedTitle: 'Новичок' },
					{ level: 1, expectedTitle: 'Новичок' },
					{ level: 2, expectedTitle: 'Ученик' },
					{ level: 3, expectedTitle: 'Начинающий' },
					{ level: 5, expectedTitle: 'Активный' },
					{ level: 10, expectedTitle: 'Продвинутый' },
					{ level: 15, expectedTitle: 'Опытный' },
					{ level: 20, expectedTitle: 'Профессионал' },
					{ level: 30, expectedTitle: 'Эксперт' },
					{ level: 40, expectedTitle: 'Мастер' },
					{ level: 50, expectedTitle: 'Легенда' },
				]

				testCases.forEach(({ level, expectedTitle }) => {
					const user: UserFullData = {
						...baseApiUser,
						level,
						experience: 0,
					}
					const result = transformUserFromAPI(user)
					expect(result.level.title).toBe(expectedTitle)
				})
			})
		})

		describe('преобразование статистики', () => {
			it('должен корректно преобразовывать статистику', () => {
				const result = transformUserFromAPI(baseApiUser)
				expect(result.stats.totalQuests).toBe(10)
				expect(result.stats.completedQuests).toBe(5)
				expect(result.stats.totalDonations).toBe(5000)
				expect(result.stats.totalVolunteerHours).toBe(20)
			})

			it('должен устанавливать значения по умолчанию для отсутствующей статистики', () => {
				const userWithoutStats: UserFullData = {
					...baseApiUser,
					// @ts-expect-error - тестируем обработку отсутствующих данных
					stats: undefined,
				}
				const result = transformUserFromAPI(userWithoutStats)
				expect(result.stats.totalQuests).toBe(0)
				expect(result.stats.completedQuests).toBe(0)
				expect(result.stats.totalDonations).toBe(0)
				expect(result.stats.totalVolunteerHours).toBe(0)
			})

			it('должен инициализировать totalImpact нулями', () => {
				const result = transformUserFromAPI(baseApiUser)
				expect(result.stats.totalImpact.treesPlanted).toBe(0)
				expect(result.stats.totalImpact.animalsHelped).toBe(0)
				expect(result.stats.totalImpact.areasCleaned).toBe(0)
				expect(result.stats.totalImpact.livesChanged).toBe(0)
			})
		})

		describe('обработка null/undefined значений', () => {
			it('должен обрабатывать отсутствующий avatar', () => {
				const userWithoutAvatar: UserFullData = {
					...baseApiUser,
					avatar: undefined,
					avatarUrls: undefined,
				}
				const result = transformUserFromAPI(userWithoutAvatar)
				expect(result.avatar).toBeUndefined()
			})

			it('должен обрабатывать null avatar', () => {
				const userWithNullAvatar: UserFullData = {
					...baseApiUser,
					// @ts-expect-error - тестируем обработку null
					avatar: null,
					avatarUrls: undefined,
				}
				const result = transformUserFromAPI(userWithNullAvatar)
				expect(result.avatar).toBeUndefined()
			})

			it('должен обрабатывать пустой массив achievements', () => {
				const userWithoutAchievements: UserFullData = {
					...baseApiUser,
					// @ts-expect-error - тестируем обработку отсутствующих данных
					achievements: undefined,
				}
				const result = transformUserFromAPI(userWithoutAchievements)
				expect(result.achievements).toEqual([])
			})

			it('должен обрабатывать пустой массив participatingQuests', () => {
				const userWithoutQuests: UserFullData = {
					...baseApiUser,
					// @ts-expect-error - тестируем обработку отсутствующих данных
					participatingQuests: undefined,
				}
				const result = transformUserFromAPI(userWithoutQuests)
				expect(result.participatingQuests).toEqual([])
			})

			it('должен обрабатывать null questId', () => {
				const userWithNullQuestId: UserFullData = {
					...baseApiUser,
					questId: null,
				}
				const result = transformUserFromAPI(userWithNullQuestId)
				expect(result.createdQuestId).toBeUndefined()
			})

			it('должен обрабатывать null organisationId', () => {
				const userWithNullOrgId: UserFullData = {
					...baseApiUser,
					organisationId: null,
				}
				const result = transformUserFromAPI(userWithNullOrgId)
				expect(result.createdOrganizationId).toBeUndefined()
			})

			it('должен преобразовывать organisationId в строку, если он не null', () => {
				const userWithOrgId: UserFullData = {
					...baseApiUser,
					organisationId: '123',
				}
				const result = transformUserFromAPI(userWithOrgId)
				expect(result.createdOrganizationId).toBe('123')
			})

			it('должен преобразовывать числовой organisationId в строку', () => {
				const userWithNumericOrgId: UserFullData = {
					...baseApiUser,
					// @ts-expect-error - тестируем обработку числового organisationId
					organisationId: 456,
				}
				const result = transformUserFromAPI(userWithNumericOrgId)
				expect(result.createdOrganizationId).toBe('456')
			})

			it('должен обрабатывать questId как строку', () => {
				const userWithQuestId: UserFullData = {
					...baseApiUser,
					questId: '789',
				}
				const result = transformUserFromAPI(userWithQuestId)
				expect(result.createdQuestId).toBe('789')
			})

			it('должен обрабатывать пустую строку questId как undefined', () => {
				const userWithEmptyQuestId: UserFullData = {
					...baseApiUser,
					questId: '',
				}
				const result = transformUserFromAPI(userWithEmptyQuestId)
				// Пустая строка через || становится undefined
				expect(result.createdQuestId).toBeUndefined()
			})

			it('должен обрабатывать пустую строку organisationId как undefined', () => {
				const userWithEmptyOrgId: UserFullData = {
					...baseApiUser,
					organisationId: '',
				}
				const result = transformUserFromAPI(userWithEmptyOrgId)
				// Пустая строка не null и не undefined, но должна быть преобразована
				expect(result.createdOrganizationId).toBe('')
			})

			it('должен обрабатывать undefined organisationId', () => {
				const userWithUndefinedOrgId: UserFullData = {
					...baseApiUser,
					organisationId: undefined,
				}
				const result = transformUserFromAPI(userWithUndefinedOrgId)
				expect(result.createdOrganizationId).toBeUndefined()
			})
		})

		it('должен корректно обрабатывать полные данные пользователя', () => {
			const fullUser: UserFullData = {
				id: '2',
				firstName: 'Мария',
				lastName: 'Петрова',
				middleName: 'Сергеевна',
				email: 'maria@example.com',
				// @ts-expect-error - тестируем обработку числового avatar
				avatar: 999,
				avatarUrls: {
					size_5: 'https://example.com/avatar_large.jpg',
				},
				level: 15,
				experience: 2500,
				stats: {
					totalQuests: 25,
					completedQuests: 20,
					totalDonations: 15000,
					totalVolunteerHours: 100,
				},
				achievements: [
					{
						id: 'first_quest',
						title: 'Первый квест',
						description: 'Завершил первый квест',
						icon: '🎯',
						rarity: 'common',
						unlockedAt: '2024-01-01T00:00:00Z',
					},
				],
				participatingQuests: ['quest1', 'quest2'],
				questId: 'my-quest-id',
				organisationId: 'my-org-id',
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			}

			const result = transformUserFromAPI(fullUser)

			expect(result.id).toBe('2')
			expect(result.name).toBe('Мария Петрова')
			expect(result.email).toBe('maria@example.com')
			expect(result.avatar).toBe('https://example.com/avatar_large.jpg') // Приоритет avatarUrls
			expect(result.level.level).toBe(15)
			expect(result.level.title).toBe('Опытный')
			expect(result.stats.totalQuests).toBe(25)
			expect(result.achievements).toHaveLength(1)
			expect(result.achievements[0].id).toBe('first_quest')
			expect(result.participatingQuests).toEqual(['quest1', 'quest2'])
			expect(result.createdQuestId).toBe('my-quest-id')
			expect(result.createdOrganizationId).toBe('my-org-id')
		})
	})
})
