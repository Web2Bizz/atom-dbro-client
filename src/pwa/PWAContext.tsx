import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from 'react'
import { toast } from 'sonner'
import type { BeforeInstallPromptEvent, InstallPrompt } from './types/pwa'

interface PWAContextType {
	isInstalled: boolean
	isOffline: boolean
	isUpdateAvailable: boolean
	registration: ServiceWorkerRegistration | null
	installPrompt: InstallPrompt
	setInstallPrompt: (prompt: InstallPrompt) => void
}

const PWAContext = createContext<PWAContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const usePWA = () => {
	const context = useContext(PWAContext)
	if (context === undefined) {
		throw new Error('usePWA must be used within a PWAProvider')
	}
	return context
}

interface PWAProviderProps {
	children: ReactNode
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
	const [isInstalled, setIsInstalled] = useState<boolean>(false)
	const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine)
	const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false)
	const [registration, setRegistration] =
		useState<ServiceWorkerRegistration | null>(null)
	const [installPrompt, setInstallPrompt] = useState<InstallPrompt>(null)
	const prevIsOfflineRef = useRef<boolean>(!navigator.onLine)

	// Регистрация Service Worker и проверка обновлений
	useEffect(() => {
		let updateInterval: NodeJS.Timeout | null = null
		let registration: ServiceWorkerRegistration | null = null
		let handleUpdateFound: (() => void) | null = null
		let handleFocus: (() => void) | null = null
		let handleOnlineForUpdate: (() => void) | null = null

		const registerSW = async (): Promise<void> => {
			if ('serviceWorker' in navigator) {
				try {
					// Регистрация с обновлением кэша
					registration = await navigator.serviceWorker.register('/pwa/sw.js', {
						updateViaCache: 'none', // Всегда проверяем обновления
					})
					setRegistration(registration)
					if (import.meta.env.DEV) {
						console.log('[PWA] Service Worker registered: ', registration)
					}

					// Функция для проверки обновлений
					const checkForUpdates = async () => {
						if (registration) {
							try {
								await registration.update()
							} catch (error) {
								if (import.meta.env.DEV) {
									console.error('[PWA] Update check failed:', error)
								}
							}
						}
					}

					// Обработчик обновления Service Worker
					handleUpdateFound = () => {
						const newWorker = registration?.installing
						if (newWorker) {
							const handleStateChange = () => {
								if (
									newWorker.state === 'installed' &&
									navigator.serviceWorker.controller
								) {
									// Новый Service Worker установлен, но старый еще активен
									setIsUpdateAvailable(true)
									toast.info('Доступно обновление', {
										description: 'Нажмите для перезагрузки страницы',
										action: {
											label: 'Обновить',
											onClick: () => {
												// Отправляем сообщение новому Service Worker для активации
												newWorker.postMessage({ type: 'SKIP_WAITING' })
												// Перезагружаем страницу
												window.location.reload()
											},
										},
										duration: 10000,
									})
								} else if (
									newWorker.state === 'activated' &&
									!navigator.serviceWorker.controller
								) {
									// Первая установка - перезагружаем страницу
									window.location.reload()
								}
							}
							newWorker.addEventListener('statechange', handleStateChange)
						}
					}

					// Проверка обновлений при установке
					registration.addEventListener('updatefound', handleUpdateFound)

					// Периодическая проверка обновлений (каждые 5 минут)
					updateInterval = setInterval(checkForUpdates, 5 * 60 * 1000)

					// Проверка обновлений при фокусе на окне
					handleFocus = () => {
						checkForUpdates()
					}
					window.addEventListener('focus', handleFocus)

					// Проверка обновлений при возвращении в онлайн
					handleOnlineForUpdate = () => {
						checkForUpdates()
					}
					window.addEventListener('online', handleOnlineForUpdate)

					// Первоначальная проверка
					checkForUpdates()
				} catch (error) {
					console.error('[PWA] SW registration failed: ', error)
				}
			}
		}

		registerSW()

		// Очистка при размонтировании
		return () => {
			if (updateInterval) {
				clearInterval(updateInterval)
			}
			if (registration && handleUpdateFound) {
				registration.removeEventListener('updatefound', handleUpdateFound)
			}
			if (handleFocus) {
				window.removeEventListener('focus', handleFocus)
			}
			if (handleOnlineForUpdate) {
				window.removeEventListener('online', handleOnlineForUpdate)
			}
		}
	}, [])

	// Отслеживание установки приложения
	useEffect(() => {
		const checkInstalled = (): void => {
			if (window.matchMedia('(display-mode: standalone)').matches) {
				setIsInstalled(true)
			}
		}

		checkInstalled()

		const handleAppInstalled = (): void => {
			setIsInstalled(true)
			setInstallPrompt(null)
		}

		// Отслеживание онлайн/оффлайн статуса
		const handleOnline = (): void => {
			setIsOffline(false)
		}
		const handleOffline = (): void => {
			setIsOffline(true)
		}

		window.addEventListener('appinstalled', handleAppInstalled)
		window.addEventListener('online', handleOnline)
		window.addEventListener('offline', handleOffline)

		return () => {
			window.removeEventListener('appinstalled', handleAppInstalled)
			window.removeEventListener('online', handleOnline)
			window.removeEventListener('offline', handleOffline)
		}
	}, [])

	// Отслеживание изменений статуса сети и показ уведомлений
	useEffect(() => {
		// Пропускаем первый рендер, чтобы не показывать уведомление при загрузке
		if (prevIsOfflineRef.current === isOffline) {
			return
		}

		// Если перешли в офлайн
		if (isOffline && !prevIsOfflineRef.current) {
			toast.warning('Вы в офлайн-режиме', {
				description: 'Некоторые функции могут быть недоступны',
				duration: 5000,
			})
		}

		// Если вернулись в онлайн (только в этом случае показываем уведомление)
		if (!isOffline && prevIsOfflineRef.current) {
			toast.success('Соединение восстановлено', {
				description: 'Вы снова в сети',
				duration: 3000,
			})
		}

		// Обновляем предыдущее значение
		prevIsOfflineRef.current = isOffline
	}, [isOffline])

	// Обработчик beforeinstallprompt
	useEffect(() => {
		const handler = (e: BeforeInstallPromptEvent): void => {
			e.preventDefault()
			setInstallPrompt(e)
		}

		window.addEventListener('beforeinstallprompt', handler as EventListener)

		return () => {
			window.removeEventListener(
				'beforeinstallprompt',
				handler as EventListener
			)
		}
	}, [])

	const value: PWAContextType = {
		isInstalled,
		isOffline,
		isUpdateAvailable,
		registration,
		installPrompt,
		setInstallPrompt,
	}

	return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>
}
