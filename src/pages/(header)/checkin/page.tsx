import { Spinner } from '@/components/ui/spinner'
import { ProtectedRoute } from '@/provider/ProtectedRoute'
import { useCheckInQuery } from '@/store/entities/quest'
import { getErrorMessage } from '@/utils/error'
import { logger } from '@/utils/logger'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

/**
 * Страница для обработки QR кода для отметки волонтера
 * URL формат: /checkin?questId=1&type=contributers&token=xxx
 * Страница автоматически отправляет GET запрос на /api/v1/checkin
 */
export default function CheckInPage() {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const [hasCheckedIn, setHasCheckedIn] = useState(false)

	const questId = searchParams.get('questId')
	const type = searchParams.get('type')
	const token = searchParams.get('token')

	// Отправляем GET запрос на API для отметки
	const {
		data: checkInResponse,
		isLoading,
		isError,
		error,
	} = useCheckInQuery(
		{
			questId: Number.parseInt(questId || '0', 10),
			type: (type as 'contributers' | 'finance' | 'material') || 'contributers',
			token: token || '',
		},
		{
			skip:
				!questId ||
				!type ||
				!token ||
				Number.isNaN(Number.parseInt(questId, 10)) ||
				hasCheckedIn,
		}
	)

	useEffect(() => {
		// Проверяем наличие обязательных параметров
		if (!questId || !type || !token) {
			toast.error('Неверные параметры QR кода')
			return
		}

		const questIdNum = Number.parseInt(questId, 10)
		if (Number.isNaN(questIdNum)) {
			toast.error('Неверный формат параметров')
			return
		}

		// Если запрос успешно выполнен
		if (checkInResponse && !hasCheckedIn) {
			setHasCheckedIn(true)
			toast.success('Вы успешно отмечены!')
		}

		// Если произошла ошибка
		if (isError && error && !hasCheckedIn) {
			setHasCheckedIn(true)
			logger.error('Error checking in:', error)
			const errorMessage = getErrorMessage(
				error,
				'Не удалось отметить. Проверьте правильность QR кода.'
			)
			toast.error(errorMessage)
		}
	}, [questId, type, token, checkInResponse, isError, error, hasCheckedIn])

	// Автоматический редирект через 3 секунды после успеха или ошибки
	useEffect(() => {
		if (hasCheckedIn && (checkInResponse || isError)) {
			const timer = setTimeout(() => {
				navigate('/map')
			}, 3000)
			return () => clearTimeout(timer)
		}
	}, [hasCheckedIn, checkInResponse, isError, navigate])

	if (isLoading || !hasCheckedIn) {
		return (
			<ProtectedRoute>
				<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 sm:py-6 lg:py-12 px-4 mt-16'>
					<div className='max-w-2xl mx-auto'>
						<div className='bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8'>
							<div className='flex flex-col items-center justify-center py-12'>
								<Spinner />
								<p className='mt-4 text-slate-600 text-sm sm:text-base'>
									Обработка QR кода...
								</p>
							</div>
						</div>
					</div>
				</div>
			</ProtectedRoute>
		)
	}

	if (isError && hasCheckedIn) {
		return (
			<ProtectedRoute>
				<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 sm:py-6 lg:py-12 px-4 mt-16'>
					<div className='max-w-2xl mx-auto'>
						<div className='bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8'>
							<div className='flex flex-col items-center justify-center py-12'>
								<XCircle className='h-16 w-16 text-red-500 mb-4' />
								<h2 className='text-xl sm:text-2xl font-bold text-slate-900 mb-2'>
									Ошибка обработки QR кода
								</h2>
								<p className='text-slate-600 text-sm sm:text-base text-center mb-6'>
									Не удалось обработать QR код. Проверьте правильность кода и
									попробуйте еще раз.
								</p>
								<button
									type='button'
									onClick={() => navigate('/map')}
									className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
								>
									Вернуться на карту
								</button>
							</div>
						</div>
					</div>
				</div>
			</ProtectedRoute>
		)
	}

	if (checkInResponse && hasCheckedIn) {
		return (
			<ProtectedRoute>
				<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 sm:py-6 lg:py-12 px-4 mt-16'>
					<div className='max-w-2xl mx-auto'>
						<div className='bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8'>
							<div className='flex flex-col items-center justify-center py-12'>
								<CheckCircle2 className='h-16 w-16 text-green-500 mb-4' />
								<h2 className='text-xl sm:text-2xl font-bold text-slate-900 mb-2'>
									Успешно отмечено!
								</h2>
								<p className='text-slate-600 text-sm sm:text-base text-center mb-6'>
									Вы успешно отмечены как участник квеста. Спасибо за ваш вклад!
								</p>
								<p className='text-xs text-slate-500 text-center'>
									Вы будете перенаправлены на карту через несколько секунд...
								</p>
							</div>
						</div>
					</div>
				</div>
			</ProtectedRoute>
		)
	}

	return null
}
