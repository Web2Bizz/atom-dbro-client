// Настройка тестового окружения
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Очистка после каждого теста
afterEach(() => {
	cleanup()
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
