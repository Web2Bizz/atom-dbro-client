import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * MSW server для использования в Node.js окружении (Vitest)
 */
export const server = setupServer(...handlers)

