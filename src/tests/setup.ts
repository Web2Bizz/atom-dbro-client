// Настройка тестового окружения
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './integration/utils/mocks/server'

// Настройка MSW server для интеграционных тестов
beforeAll(() => {
	server.listen({ onUnhandledRequest: 'error' })
})

// Сброс handlers после каждого теста (для изоляции тестов)
afterEach(() => {
	cleanup()
	server.resetHandlers()
})

// Очистка после всех тестов
afterAll(() => {
	server.close()
})

// Моки для localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {}

	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value.toString()
		},
		removeItem: (key: string) => {
			delete store[key]
		},
		clear: () => {
			store = {}
		},
	}
})()

// Устанавливаем мок localStorage перед каждым тестом
Object.defineProperty(globalThis, 'localStorage', {
	value: localStorageMock,
	writable: true,
})

// Моки для globalThis.window
Object.defineProperty(globalThis, 'window', {
	value: globalThis,
	writable: true,
})
