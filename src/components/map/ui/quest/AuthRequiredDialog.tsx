import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Lock, LogIn, Sparkles } from 'lucide-react'

interface AuthRequiredDialogProps {
	readonly open: boolean
	readonly onOpenChange: (open: boolean) => void
	readonly questTitle?: string
}

export function AuthRequiredDialog({
	open,
	onOpenChange,
	questTitle,
}: AuthRequiredDialogProps) {
	const handleLogin = () => {
		onOpenChange(false)
		// Перенаправляем на страницу входа
		globalThis.location.href = '/login'
	}

	const handleCancel = () => {
		onOpenChange(false)
	}

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className='sm:max-w-[480px] p-0 overflow-hidden border-0 shadow-2xl'>
				{/* Декоративный градиентный верх */}
				<div className='relative h-32 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 overflow-hidden'>
					<div className='absolute inset-0 opacity-20'>
						<div
							className='absolute inset-0'
							style={{
								backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
							}}
						/>
					</div>

					{/* Иконка в центре */}
					<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
						<div className='relative'>
							<div className='absolute inset-0 bg-white/20 rounded-full blur-xl' />
							<div className='relative flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30'>
								<Lock className='h-10 w-10 text-white drop-shadow-lg' />
							</div>
							<div className='absolute -top-1 -right-1'>
								<Sparkles className='h-5 w-5 text-yellow-300 animate-pulse' />
							</div>
						</div>
					</div>
				</div>

				{/* Контент */}
				<div className='px-6 pt-8 pb-6 bg-white'>
					<AlertDialogHeader className='text-center space-y-3'>
						<AlertDialogTitle className='ml-6 text-xl sm:text-2xl font-bold text-slate-900 leading-tight '>
							Упс, вы не авторизованы
						</AlertDialogTitle>
						<AlertDialogDescription className='text-base text-slate-600 leading-relaxed max-w-sm mx-auto text-justify'>
							{questTitle ? (
								<>
									Чтобы участвовать в квесте{' '}
									<span className='font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
										&ldquo;{questTitle}&rdquo;
									</span>
									, вам необходимо войти в систему.
								</>
							) : (
								<>
									Чтобы участвовать в квесте, вам необходимо войти в систему.{' '}
								</>
							)}
							<span>
								<br />
								Вы можете воспользоваться контактами организатора квеста для
								участия без регистрации в платформе.
							</span>
						</AlertDialogDescription>
					</AlertDialogHeader>

					{/* Дополнительная информация */}
					<div className='mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100'>
						<div className='flex items-start gap-3'>
							<div className='shrink-0 mt-0.5'>
								<div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
									<Sparkles className='h-4 w-4 text-blue-600' />
								</div>
							</div>
							<div className='flex-1'>
								<p className='text-sm font-medium text-slate-900 mb-1'>
									Что вы получите после входа?
								</p>
								<ul className='text-xs text-slate-600 space-y-1'>
									<li className='flex items-center gap-2'>
										<span className='text-blue-500'>✓</span>
										<span>Участие в квестах и получение опыта</span>
									</li>
									<li className='flex items-center gap-2'>
										<span className='text-blue-500'>✓</span>
										<span>Отслеживание прогресса и достижений</span>
									</li>
									<li className='flex items-center gap-2'>
										<span className='text-blue-500'>✓</span>
										<span>Доступ к личному профилю</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				{/* Футер с кнопками */}
				<AlertDialogFooter className='px-6 pb-6 pt-0 gap-3 sm:gap-3'>
					<AlertDialogCancel
						onClick={handleCancel}
						className='w-full sm:w-auto order-2 sm:order-1 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
					>
						Отмена
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleLogin}
						className='w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold'
					>
						<LogIn className='h-4 w-4 mr-2' />
						Войти в систему
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
