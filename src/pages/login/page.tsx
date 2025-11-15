import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useUser } from '@/hooks/useUser'
import {
	useLazyGetUserQuery,
	useLoginMutation,
	useRegisterMutation,
} from '@/store/entities/auth/model/auth-service'
import { saveToken, transformUserFromAPI } from '@/utils/auth'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function LoginPage() {
	const { user, setUser } = useUser()
	const [isLogin, setIsLogin] = useState(true)
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		middleName: '',
		email: '',
		password: '',
		confirmPassword: '',
	})

	const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation()
	const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation()
	const [getUser, { isLoading: isFetchingUser }] = useLazyGetUserQuery()

	const isSubmitting = isLoggingIn || isRegistering || isFetchingUser

	// Если пользователь уже авторизован, перенаправляем на главную
	useEffect(() => {
		if (user) {
			globalThis.location.href = '/'
		}
	}, [user])

	if (user) {
		return null
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (isLogin) {
			// Авторизация
			if (!formData.email || !formData.password) {
				toast.error('Заполните все поля')
				return
			}

			try {
				const result = await loginMutation({
					email: formData.email,
					password: formData.password,
				})

				// Сохраняем токен
				if (result.data?.access_token) {
					saveToken(result.data.access_token)
				}

				// Получаем полные данные пользователя по userId
				const userId = result.data?.user.id
				if (!userId) {
					toast.error('Ошибка получения пользователя')
					return
				}
				const userResult = await getUser(userId)
				if (!userResult.data) {
					toast.error('Ошибка получения пользователя')
					return
				}
				const transformedUser = transformUserFromAPI(userResult.data)
				setUser(transformedUser)

				toast.success('✅ Вход выполнен успешно!', {
					description: `Добро пожаловать, ${transformedUser.name}!`,
					duration: 3000,
				})

				// Перенаправляем на главную
				setTimeout(() => {
					globalThis.location.href = '/'
				}, 500)
			} catch (error: unknown) {
				if (import.meta.env.DEV) {
					console.error('Login error:', error)
				}
				const errorMessage =
					(error as { data?: { message?: string }; message?: string })?.data
						?.message ||
					(error as { message?: string })?.message ||
					'Ошибка входа. Попробуйте еще раз.'
				toast.error(errorMessage)
			}
		} else {
			// Регистрация
			if (
				!formData.firstName ||
				!formData.lastName ||
				!formData.middleName ||
				!formData.email ||
				!formData.password
			) {
				toast.error('Заполните все обязательные поля')
				return
			}

			if (formData.password !== formData.confirmPassword) {
				toast.error('Пароли не совпадают')
				return
			}

			if (formData.password.length < 6) {
				toast.error('Пароль должен быть не менее 6 символов')
				return
			}

			try {
				const result = await registerMutation({
					firstName: formData.firstName,
					lastName: formData.lastName,
					middleName: formData.middleName,
					email: formData.email,
					password: formData.password,
					confirmPassword: formData.confirmPassword,
				})
				console.log(result)
				// Проверяем на ошибки (RTK Query возвращает error для статусов >= 400)
				if (result.error) {
					console.log(result.error)
					const errorMessage =
						(result.error as { data?: { message?: string }; message?: string })
							?.data?.message ||
						(result.error as { message?: string })?.message ||
						'Ошибка регистрации. Попробуйте еще раз.'
					toast.error(errorMessage)
					return
				}

				// Показываем сообщение об успехе
				toast.success('🎉 Регистрация успешна!', {
					description: `Аккаунт создан. Теперь войдите в систему.`,
					duration: 4000,
				})

				// Переключаемся на форму авторизации
				setIsLogin(true)
				// Очищаем форму, но оставляем email для удобства
				setFormData({
					firstName: '',
					lastName: '',
					middleName: '',
					email: formData.email, // Оставляем email
					password: '',
					confirmPassword: '',
				})
			} catch (error: unknown) {
				if (import.meta.env.DEV) {
					console.error('Registration error:', error)
				}
				const errorMessage =
					(error as { data?: { message?: string }; message?: string })?.data
						?.message ||
					(error as { message?: string })?.message ||
					'Ошибка регистрации. Попробуйте еще раз.'
				toast.error(errorMessage)
			}
		}
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4'>
			<div className='max-w-md w-full'>
				<div className='bg-white rounded-2xl shadow-xl p-8'>
					<div className='text-center mb-8'>
						<h1 className='text-3xl font-bold text-slate-900 mb-2'>
							{isLogin ? 'Вход' : 'Регистрация'}
						</h1>
						<p className='text-slate-600'>
							{isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
						</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						{!isLogin && (
							<>
								<div>
									<label
										htmlFor='firstName'
										className='block text-sm font-medium text-slate-700 mb-2'
									>
										Имя *
									</label>
									<Input
										id='firstName'
										type='text'
										value={formData.firstName}
										onChange={e =>
											setFormData(prev => ({
												...prev,
												firstName: e.target.value,
											}))
										}
										required
										placeholder='Иван'
									/>
								</div>
								<div>
									<label
										htmlFor='lastName'
										className='block text-sm font-medium text-slate-700 mb-2'
									>
										Фамилия *
									</label>
									<Input
										id='lastName'
										type='text'
										value={formData.lastName}
										onChange={e =>
											setFormData(prev => ({
												...prev,
												lastName: e.target.value,
											}))
										}
										required
										placeholder='Иванов'
									/>
								</div>
								<div>
									<label
										htmlFor='middleName'
										className='block text-sm font-medium text-slate-700 mb-2'
									>
										Отчество *
									</label>
									<Input
										id='middleName'
										type='text'
										value={formData.middleName}
										onChange={e =>
											setFormData(prev => ({
												...prev,
												middleName: e.target.value,
											}))
										}
										required
										placeholder='Иванович'
									/>
								</div>
							</>
						)}

						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-slate-700 mb-2'
							>
								Email *
							</label>
							<Input
								id='email'
								type='email'
								value={formData.email}
								onChange={e =>
									setFormData(prev => ({ ...prev, email: e.target.value }))
								}
								required
								placeholder='email@example.com'
							/>
						</div>

						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-slate-700 mb-2'
							>
								Пароль *
							</label>
							<Input
								id='password'
								type='password'
								value={formData.password}
								onChange={e =>
									setFormData(prev => ({ ...prev, password: e.target.value }))
								}
								required
								placeholder='••••••••'
							/>
						</div>

						{!isLogin && (
							<div>
								<label
									htmlFor='confirmPassword'
									className='block text-sm font-medium text-slate-700 mb-2'
								>
									Подтвердите пароль *
								</label>
								<Input
									id='confirmPassword'
									type='password'
									value={formData.confirmPassword}
									onChange={e =>
										setFormData(prev => ({
											...prev,
											confirmPassword: e.target.value,
										}))
									}
									required={!isLogin}
									placeholder='••••••••'
								/>
							</div>
						)}

						<Button type='submit' disabled={isSubmitting} className='w-full'>
							{isSubmitting ? (
								<div className='flex items-center gap-2'>
									<Spinner />
									<span>{isLogin ? 'Вход...' : 'Регистрация...'}</span>
								</div>
							) : (
								<span>{isLogin ? 'Войти' : 'Зарегистрироваться'}</span>
							)}
						</Button>
					</form>

					<div className='mt-6 text-center'>
						<button
							type='button'
							onClick={() => {
								setIsLogin(!isLogin)
								setFormData({
									firstName: '',
									lastName: '',
									middleName: '',
									email: '',
									password: '',
									confirmPassword: '',
								})
							}}
							className='text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer'
						>
							{isLogin
								? 'Нет аккаунта? Зарегистрируйтесь'
								: 'Уже есть аккаунт? Войдите'}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
