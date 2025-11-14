import { NOTIFICATION_MAX_COUNT } from '@/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { Notification } from '@/types/notifications'
import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	type ReactNode,
} from 'react'

export interface NotificationContextType {
	notifications: Notification[]
	unreadCount: number
	addNotification: (
		notification: Omit<Notification, 'id' | 'read' | 'createdAt'>
	) => void
	markAsRead: (id: string) => void
	markAllAsRead: () => void
	clearNotification: (id: string) => void
	clearAll: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext<
	NotificationContextType | undefined
>(undefined)

export function NotificationProvider({
	children,
}: Readonly<{ children: ReactNode }>) {
	const [notifications, setNotifications] = useLocalStorage<Notification[]>(
		'ecoquest_notifications',
		[]
	)

	const unreadCount = notifications.filter(n => !n.read).length

	const addNotification = useCallback(
		(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
			const newNotification: Notification = {
				...notification,
				id: `notif-${Date.now()}-${Math.random()
					.toString(36)
					.substring(2, 11)}`,
				read: false,
				createdAt: new Date().toISOString(),
			}

			setNotifications(prev =>
				[newNotification, ...prev].slice(0, NOTIFICATION_MAX_COUNT)
			)

			// Показываем браузерное уведомление (если разрешено)
			if ('Notification' in window && Notification.permission === 'granted') {
				new window.Notification(newNotification.title, {
					body: newNotification.message,
					icon: '/vite.svg',
				})
			}
		},
		[setNotifications]
	)

	const markAsRead = useCallback(
		(id: string) => {
			setNotifications(prev =>
				prev.map(n => (n.id === id ? { ...n, read: true } : n))
			)
		},
		[setNotifications]
	)

	const markAllAsRead = useCallback(() => {
		setNotifications(prev => prev.map(n => ({ ...n, read: true })))
	}, [setNotifications])

	const clearNotification = useCallback(
		(id: string) => {
			setNotifications(prev => prev.filter(n => n.id !== id))
		},
		[setNotifications]
	)

	const clearAll = useCallback(() => {
		setNotifications([])
	}, [setNotifications])

	// Запрашиваем разрешение на уведомления при первом рендере
	useEffect(() => {
		if ('Notification' in window && Notification.permission === 'default') {
			Notification.requestPermission()
		}
	}, [])

	const value = useMemo(
		() => ({
			notifications,
			unreadCount,
			addNotification,
			markAsRead,
			markAllAsRead,
			clearNotification,
			clearAll,
		}),
		[
			notifications,
			unreadCount,
			addNotification,
			markAsRead,
			markAllAsRead,
			clearNotification,
			clearAll,
		]
	)

	return (
		<NotificationContext.Provider value={value}>
			{children}
		</NotificationContext.Provider>
	)
}

// useNotifications hook exported from separate file to fix Fast Refresh
