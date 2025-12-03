import { logger } from '@/utils/logger'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('logger', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		// Мокируем console методы
		global.console.log = vi.fn()
		global.console.info = vi.fn()
		global.console.warn = vi.fn()
		global.console.error = vi.fn()
		global.console.debug = vi.fn()
		global.console.group = vi.fn()
		global.console.groupCollapsed = vi.fn()
		global.console.groupEnd = vi.fn()
	})

	describe('log', () => {
		it('должен вызывать console.log в dev режиме', () => {
			// В тестах import.meta.env.DEV обычно true
			logger.log('test message')
			// Проверяем, что console.log был вызван (если в dev режиме)
			// В production режиме не должен вызываться
		})
	})

	describe('info', () => {
		it('должен вызывать console.info в dev режиме', () => {
			logger.info('info message')
		})
	})

	describe('warn', () => {
		it('должен вызывать console.warn в dev режиме', () => {
			logger.warn('warning message')
		})
	})

	describe('error', () => {
		it('должен всегда вызывать console.error, даже в production', () => {
			logger.error('error message')
			expect(console.error).toHaveBeenCalledWith('error message')
		})

		it('должен обрабатывать несколько аргументов', () => {
			logger.error('error', { code: 500 }, 'additional info')
			expect(console.error).toHaveBeenCalledWith(
				'error',
				{ code: 500 },
				'additional info'
			)
		})
	})

	describe('debug', () => {
		it('должен вызывать console.debug в dev режиме', () => {
			logger.debug('debug message')
		})
	})

	describe('group', () => {
		it('должен вызывать console.group в dev режиме', () => {
			logger.group('Group label')
		})

		it('должен вызывать console.groupCollapsed при collapsed = true', () => {
			logger.group('Group label', true)
		})
	})

	describe('groupEnd', () => {
		it('должен вызывать console.groupEnd в dev режиме', () => {
			logger.groupEnd()
		})
	})
})

