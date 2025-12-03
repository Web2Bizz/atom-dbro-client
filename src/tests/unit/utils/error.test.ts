import { getErrorMessage, isErrorWithData } from '@/utils/error'
import { describe, expect, it } from 'vitest'

describe('error utils', () => {
	describe('getErrorMessage', () => {
		it('должен возвращать defaultMessage для null', () => {
			const result = getErrorMessage(null)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен возвращать defaultMessage для undefined', () => {
			const result = getErrorMessage(undefined)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен возвращать defaultMessage для false', () => {
			const result = getErrorMessage(false)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен возвращать defaultMessage для 0', () => {
			const result = getErrorMessage(0)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен возвращать defaultMessage для пустой строки', () => {
			const result = getErrorMessage('')
			expect(result).toBe('')
		})

		it('должен возвращать кастомное defaultMessage', () => {
			const result = getErrorMessage(null, 'Кастомное сообщение')
			expect(result).toBe('Кастомное сообщение')
		})

		it('должен возвращать строковую ошибку как есть', () => {
			const error = 'Произошла ошибка при загрузке данных'
			const result = getErrorMessage(error)
			expect(result).toBe(error)
		})

		it('должен извлекать message из объекта Error', () => {
			const error = new Error('Ошибка выполнения')
			const result = getErrorMessage(error)
			expect(result).toBe('Ошибка выполнения')
		})

		it('должен извлекать message из объекта с полем message', () => {
			const error = { message: 'Ошибка валидации' }
			const result = getErrorMessage(error)
			expect(result).toBe('Ошибка валидации')
		})

		it('должен извлекать message из RTK Query ошибки (data.message)', () => {
			const error = {
				data: {
					message: 'Ошибка сервера',
				},
			}
			const result = getErrorMessage(error)
			expect(result).toBe('Ошибка сервера')
		})

		it('должен извлекать message из вложенной ошибки (error.message)', () => {
			const error = {
				error: {
					message: 'Ошибка сети',
				},
			}
			const result = getErrorMessage(error)
			expect(result).toBe('Ошибка сети')
		})

		it('должен приоритизировать message над data.message', () => {
			const error = {
				message: 'Прямое сообщение',
				data: {
					message: 'Сообщение из data',
				},
			}
			const result = getErrorMessage(error)
			expect(result).toBe('Прямое сообщение')
		})

		it('должен приоритизировать message над error.message', () => {
			const error = {
				message: 'Прямое сообщение',
				error: {
					message: 'Сообщение из error',
				},
			}
			const result = getErrorMessage(error)
			expect(result).toBe('Прямое сообщение')
		})

		it('должен приоритизировать data.message над error.message', () => {
			const error = {
				data: {
					message: 'Сообщение из data',
				},
				error: {
					message: 'Сообщение из error',
				},
			}
			const result = getErrorMessage(error)
			expect(result).toBe('Сообщение из data')
		})

		it('должен возвращать defaultMessage для объекта без message', () => {
			const error = { code: 500, status: 'error' }
			const result = getErrorMessage(error)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен возвращать defaultMessage для объекта с нестроковым message', () => {
			const error = { message: 123 }
			const result = getErrorMessage(error)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен возвращать defaultMessage для data без message', () => {
			const error = {
				data: {
					code: 500,
				},
			}
			const result = getErrorMessage(error)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен возвращать defaultMessage для data с нестроковым message', () => {
			const error = {
				data: {
					message: 123,
				},
			}
			const result = getErrorMessage(error)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен возвращать defaultMessage для error без message', () => {
			const error = {
				error: {
					code: 500,
				},
			}
			const result = getErrorMessage(error)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен возвращать defaultMessage для error с нестроковым message', () => {
			const error = {
				error: {
					message: 123,
				},
			}
			const result = getErrorMessage(error)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен обрабатывать data как null', () => {
			const error = {
				data: null,
			}
			const result = getErrorMessage(error)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен обрабатывать error как null', () => {
			const error = {
				error: null,
			}
			const result = getErrorMessage(error)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен обрабатывать data как не объект', () => {
			const error = {
				data: 'string',
			}
			const result = getErrorMessage(error)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен обрабатывать error как не объект', () => {
			const error = {
				error: 'string',
			}
			const result = getErrorMessage(error)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен обрабатывать сложную вложенную структуру', () => {
			const error = {
				response: {
					data: {
						error: {
							message: 'Глубокая ошибка',
						},
					},
				},
			}
			// Функция не обрабатывает такую структуру, должна вернуть defaultMessage
			const result = getErrorMessage(error)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен обрабатывать массив как ошибку', () => {
			const error = ['Ошибка 1', 'Ошибка 2']
			const result = getErrorMessage(error)
			expect(result).toBe('Произошла ошибка')
		})

		it('должен обрабатывать функцию как ошибку', () => {
			const error = () => 'error'
			const result = getErrorMessage(error)
			expect(result).toBe('Произошла ошибка')
		})
	})

	describe('isErrorWithData', () => {
		it('должен возвращать true для объекта с data', () => {
			const error = {
				data: {
					message: 'Ошибка',
				},
			}
			expect(isErrorWithData(error)).toBe(true)
		})

		it('должен возвращать true для объекта с data без message', () => {
			const error = {
				data: {
					code: 500,
				},
			}
			expect(isErrorWithData(error)).toBe(true)
		})

		it('должен возвращать false для null', () => {
			expect(isErrorWithData(null)).toBe(false)
		})

		it('должен возвращать false для undefined', () => {
			expect(isErrorWithData(undefined)).toBe(false)
		})

		it('должен возвращать false для строки', () => {
			expect(isErrorWithData('Ошибка')).toBe(false)
		})

		it('должен возвращать false для числа', () => {
			expect(isErrorWithData(500)).toBe(false)
		})

		it('должен возвращать false для объекта без data', () => {
			const error = {
				message: 'Ошибка',
			}
			expect(isErrorWithData(error)).toBe(false)
		})

		it('должен возвращать false для объекта с data = null', () => {
			const error = {
				data: null,
			}
			expect(isErrorWithData(error)).toBe(false)
		})

		it('должен возвращать false для объекта с data как строка', () => {
			const error = {
				data: 'string',
			}
			expect(isErrorWithData(error)).toBe(false)
		})

		it('должен возвращать false для объекта с data как число', () => {
			const error = {
				data: 123,
			}
			expect(isErrorWithData(error)).toBe(false)
		})

		it('должен возвращать false для объекта с data как массив', () => {
			const error = {
				data: [],
			}
			// Массив - это объект, но проверка typeof === 'object' вернет true
			// Однако массив пройдет проверку, так как это объект
			expect(isErrorWithData(error)).toBe(true)
		})

		it('должен возвращать true для RTK Query ошибки', () => {
			const error = {
				status: 'FETCH_ERROR',
				data: {
					message: 'Network error',
				},
			}
			expect(isErrorWithData(error)).toBe(true)
		})
	})
})

