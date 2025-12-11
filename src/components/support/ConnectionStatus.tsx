import { SocketContext } from '@/contexts/SocketContext'
import { useContext } from 'react'

const statusConfig = {
	connecting: {
		label: 'Подключение...',
		color: 'bg-yellow-500',
		dotColor: 'bg-yellow-500',
	},
	connected: {
		label: 'Подключено',
		color: 'bg-green-500',
		dotColor: 'bg-green-500',
	},
	disconnected: {
		label: 'Отключено',
		color: 'bg-gray-400',
		dotColor: 'bg-gray-400',
	},
	error: {
		label: 'Ошибка',
		color: 'bg-red-500',
		dotColor: 'bg-red-500',
	},
} as const

interface ConnectionStatusProps {
	readonly variant?: 'default' | 'light'
}

export function ConnectionStatus({ variant = 'default' }: ConnectionStatusProps) {
	const socketContext = useContext(SocketContext)
	const status = socketContext?.status ?? 'disconnected'
	const config = statusConfig[status]
	const textColor = variant === 'light' ? 'text-white/90' : 'text-slate-600'

	return (
		<div className='flex items-center gap-2 text-xs'>
			<div className='relative'>
				<div
					className={`w-2 h-2 rounded-full ${config.dotColor} ${
						status === 'connecting' ? 'animate-pulse' : ''
					}`}
				/>
				{status === 'connected' && (
					<div
						className={`absolute inset-0 rounded-full ${config.color} animate-ping opacity-75`}
					/>
				)}
			</div>
			<span className={textColor}>{config.label}</span>
		</div>
	)
}
