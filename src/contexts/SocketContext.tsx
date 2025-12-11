import { SOCKET_SERVSER } from '@/constants'
import { logger } from '@/utils/logger'
import type { ReactNode } from 'react'
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'

export type SocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

interface SocketContextType {
	socket: Socket | null
	status: SocketStatus
	subscribe: <T = unknown>(event: string, callback: (data: T) => void) => () => void
	emit: (event: string, data?: unknown) => void
	disconnect: () => void
	connect: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: Readonly<{ children: ReactNode }>) {
	const [socket, setSocket] = useState<Socket | null>(null)
	const [status, setStatus] = useState<SocketStatus>('disconnected')
	const socketRef = useRef<Socket | null>(null)
	const listenersRef = useRef<Map<string, Set<(data: unknown) => void>>>(new Map())

	// Извлекаем базовый URL из SOCKET_SERVSER
	const getBaseUrl = () => {
		try {
			const url = new URL(SOCKET_SERVSER)
			return `${url.protocol}//${url.host}`
		} catch {
			// Если SOCKET_SERVSER не является полным URL, возвращаем как есть
			return SOCKET_SERVSER.replace('/chatty/socket.io', '').replace('/socket.io', '')
		}
	}

	// Подключение к серверу
	const connect = useCallback(() => {
		if (socketRef.current?.connected) {
			logger.debug('Socket already connected')
			return
		}

		if (socketRef.current) {
			logger.debug('Reconnecting socket...')
			socketRef.current.connect()
			return
		}

		const baseUrl = getBaseUrl()
		logger.debug('Connecting to socket server:', baseUrl, 'with path: /chatty/socket.io/')
		setStatus('connecting')

		const newSocket = io(baseUrl, {
			path: '/chatty/socket.io/',
			transports: ['websocket', 'polling'],
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			reconnectionAttempts: Infinity,
		})

		newSocket.on('connect', () => {
			logger.debug('Socket connected:', newSocket.id)
			setStatus('connected')
		})

		newSocket.on('disconnect', (reason: string) => {
			logger.debug('Socket disconnected:', reason)
			setStatus('disconnected')
		})

		newSocket.on('connect_error', (error: Error) => {
			logger.error('Socket connection error:', error)
			setStatus('error')
		})

		newSocket.on('error', (error: Error) => {
			logger.error('Socket error:', error)
			setStatus('error')
		})

		socketRef.current = newSocket
		setSocket(newSocket)
	}, [])

	// Отключение от сервера
	const disconnect = () => {
		if (socketRef.current) {
			logger.debug('Disconnecting socket...')
			socketRef.current.disconnect()
			socketRef.current = null
			setSocket(null)
			setStatus('disconnected')
			listenersRef.current.clear()
		}
	}

	// Подписка на событие
	const subscribe = <T = unknown>(
		event: string,
		callback: (data: T) => void
	): (() => void) => {
		// Инициализируем сокет, если его еще нет
		if (!socketRef.current) {
			logger.debug('Socket not initialized, connecting...')
			connect()
		}

		// Сохраняем callback в реф для последующей очистки
		if (!listenersRef.current.has(event)) {
			listenersRef.current.set(event, new Set())
		}

		const callbackWrapper = (data: unknown) => {
			try {
				callback(data as T)
			} catch (error) {
				logger.error(`Error in socket event handler for "${event}":`, error)
			}
		}

		listenersRef.current.get(event)?.add(callbackWrapper)

		// Подписываемся на событие через socket.io
		// Socket.io автоматически обработает подписку, даже если сокет еще не подключен
		if (socketRef.current) {
			socketRef.current.on(event, callbackWrapper)
		}

		// Возвращаем функцию отписки
		return () => {
			if (socketRef.current) {
				socketRef.current.off(event, callbackWrapper)
			}
			listenersRef.current.get(event)?.delete(callbackWrapper)
			if (listenersRef.current.get(event)?.size === 0) {
				listenersRef.current.delete(event)
			}
		}
	}

	// Отправка события
	const emit = (event: string, data?: unknown) => {
		if (!socketRef.current?.connected) {
			logger.warn(`Cannot emit "${event}": socket not connected`)
			return
		}

		logger.debug(`Emitting event "${event}":`, data)
		socketRef.current.emit(event, data)
	}

	// Подключение при монтировании
	useEffect(() => {
		connect()
		const listenersRefValue = listenersRef.current

		// Очистка при размонтировании
		return () => {
			// Отписываемся от всех событий
			const currentSocket = socketRef.current
			const listenersSnapshot = new Map(listenersRefValue)
			
			if (currentSocket) {
				listenersSnapshot.forEach((callbacks, event) => {
					callbacks.forEach((callback) => {
						currentSocket.off(event, callback)
					})
				})
				listenersRefValue.clear()
			}
			disconnect()
		}
	}, [connect])

	const value = useMemo(
		() => ({
			socket,
			status,
			subscribe,
			emit,
			disconnect,
			connect,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[socket, status]
	)

	return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
