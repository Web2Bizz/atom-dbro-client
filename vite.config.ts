// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vitest/config'
import { w2bViteFileBasedRouting } from 'w2b-vite-filebased-routing/core'

export default defineConfig({
	test: {
		// Делает Vitest API глобально доступным без импортов
		globals: true,

		// Создает браузерное окружение для тестирования DOM и React компонентов
		environment: 'jsdom',

		// Выполняет указанный файл перед запуском КАЖДОГО теста
		setupFiles: './src/tests/setup.ts',
	},
	plugins: [
		react(),
		w2bViteFileBasedRouting({
			baseUrl: 'https://it-hackathon-team05.mephi.ru',
			disallowPaths: ['/health', '/api', '/sw.js', '/registerSW.js'],
			enableSEO: true,
			basePath: '/',
		}),
		tailwindcss(),
		// VitePWA({
		// 	workbox: {
		// 		globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
		// 	},
		// 	includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
		// 	manifest: false, // Отключаем автоматическую генерацию manifest
		// 	devOptions: {
		// 		enabled: false, // Отключаем dev service worker, чтобы убрать сообщения в консоли
		// 	},
		// }),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
		// Приоритет TypeScript файлов над JavaScript при разрешении модулей
		extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					// Разделяем node_modules на отдельные чанки
					if (id.includes('node_modules')) {
						// React DOM отдельно от React (React меньше)
						if (id.includes('react-dom')) {
							return 'react-dom-vendor'
						}

						// React core (без DOM и других)
						if (
							id.includes('/react/') ||
							(id.includes('react') &&
								!id.includes('react-dom') &&
								!id.includes('react-leaflet') &&
								!id.includes('react-router') &&
								!id.includes('react-redux') &&
								!id.includes('react-hook-form') &&
								!id.includes('react-joyride'))
						) {
							return 'react-vendor'
						}

						// React Router
						if (id.includes('react-router')) {
							return 'react-router-vendor'
						}

						// Redux Persist отдельно
						if (id.includes('redux-persist')) {
							return 'redux-persist-vendor'
						}

						// React Redux отдельно
						if (id.includes('react-redux')) {
							return 'react-redux-vendor'
						}

						// Redux Toolkit - разделяем на core и RTK Query
						if (id.includes('@reduxjs/toolkit')) {
							// RTK Query может быть большим, выносим отдельно
							if (id.includes('rtk-query') || id.includes('query')) {
								return 'rtk-query-vendor'
							}
							return 'redux-toolkit-vendor'
						}

						// Leaflet и карты - большая библиотека, загружается только на странице карты
						if (id.includes('leaflet') || id.includes('react-leaflet')) {
							return 'leaflet-vendor'
						}

						// Zod отдельно (может быть большим)
						if (id.includes('zod')) {
							return 'zod-vendor'
						}

						// React Hook Form
						if (
							id.includes('react-hook-form') ||
							id.includes('@hookform/resolvers')
						) {
							return 'form-vendor'
						}

						// Radix UI компоненты
						if (id.includes('@radix-ui')) {
							return 'radix-vendor'
						}

						// Emoji picker - используется только в одном месте
						if (id.includes('emoji-picker-react')) {
							return 'emoji-picker-vendor'
						}

						// React Joyride - используется только для туров
						if (id.includes('react-joyride')) {
							return 'joyride-vendor'
						}

						// Lucide React иконки - большая библиотека
						if (id.includes('lucide-react')) {
							return 'icons-vendor'
						}

						// Sonner отдельно (может быть большим)
						if (id.includes('sonner')) {
							return 'sonner-vendor'
						}

						// Остальные UI библиотеки
						if (
							id.includes('class-variance-authority') ||
							id.includes('clsx') ||
							id.includes('tailwind-merge') ||
							id.includes('next-themes')
						) {
							return 'ui-vendor'
						}

						// Остальные зависимости
						return 'vendor'
					}

					// Разделяем собственный код на чанки по функциональности
					// Store - разделяем по сервисам
					if (id.includes('src/store')) {
						// Quest service (большой, много endpoints)
						if (id.includes('quest')) {
							return 'store-quest'
						}
						// Organization service
						if (id.includes('organization')) {
							return 'store-organization'
						}
						// Auth service
						if (id.includes('auth')) {
							return 'store-auth'
						}
						// Остальные сервисы
						return 'store-other'
					}

					// Компоненты карты
					if (id.includes('src/components/map')) {
						return 'map-components'
					}

					// Компоненты форм
					if (id.includes('src/components/forms')) {
						return 'forms-components'
					}

					// Компоненты профиля
					if (id.includes('src/components/profile')) {
						return 'profile-components'
					}

					// Компоненты управления
					if (id.includes('src/components/manage')) {
						return 'manage-components'
					}

					// UI компоненты
					if (id.includes('src/components/ui')) {
						return 'ui-components'
					}

					// Остальные компоненты
					if (id.includes('src/components')) {
						return 'components'
					}

					// Страницы загружаются динамически через роутинг
					if (id.includes('src/pages')) {
						return 'pages'
					}

					// Хуки и утилиты
					if (id.includes('src/hooks') || id.includes('src/utils')) {
						return 'utils'
					}
				},
			},
		},
		chunkSizeWarningLimit: 600,
	},
})
