import { allAchievements } from '@/data/achievements'
import type { User } from '@/types/user'
import { Award } from 'lucide-react'
import { memo, useMemo } from 'react'

interface ProfileAchievementsProps {
	userAchievements: User['achievements']
}

const rarityColors = {
	common: 'bg-slate-100 border-slate-300 text-slate-700',
	rare: 'bg-blue-100 border-blue-300 text-blue-700',
	epic: 'bg-purple-100 border-purple-300 text-purple-700',
	legendary: 'bg-yellow-100 border-yellow-400 text-yellow-800',
} as const

export const ProfileAchievements = memo(function ProfileAchievements({
	userAchievements,
}: ProfileAchievementsProps) {
	const unlockedAchievements = useMemo(
		() => userAchievements.filter(a => a.unlockedAt),
		[userAchievements]
	)

	// Разделяем на системные и пользовательские достижения
	const { systemAchievements, customAchievements } = useMemo(() => {
		const system: typeof unlockedAchievements = []
		const custom: typeof unlockedAchievements = []

		unlockedAchievements.forEach(achievement => {
			// Пользовательские достижения имеют ID вида "custom-*"
			if (achievement.id.startsWith('custom-')) {
				custom.push(achievement)
			} else {
				system.push(achievement)
			}
		})

		return { systemAchievements: system, customAchievements: custom }
	}, [unlockedAchievements])

	const lockedAchievements = useMemo(
		() =>
			Object.values(allAchievements).filter(
				a => !userAchievements.some(ua => ua.id === a.id)
			),
		[userAchievements]
	)

	return (
		<div className='bg-white rounded-2xl shadow-lg p-8'>
			<h2 className='text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2'>
				<Award className='h-6 w-6 text-yellow-600' />
				Достижения
			</h2>

			{unlockedAchievements.length > 0 && (
				<div className='mb-8'>
					<h3 className='text-lg font-semibold text-slate-700 mb-4'>
						Разблокированные
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{/* Системные достижения */}
						{systemAchievements.map(achievement => {
							const achievementData =
								allAchievements[achievement.id as keyof typeof allAchievements]
							if (!achievementData) return null

							return (
								<div
									key={achievement.id}
									className={`p-4 rounded-xl border-2 ${
										rarityColors[achievementData.rarity]
									}`}
								>
									<div className='flex items-start gap-3'>
										<div className='text-3xl'>{achievementData.icon}</div>
										<div className='flex-1'>
											<h4 className='font-semibold text-slate-900 mb-1'>
												{achievementData.title}
											</h4>
											<p className='text-sm text-slate-600 mb-2'>
												{achievementData.description}
											</p>
											{achievement.unlockedAt && (
												<p className='text-xs text-slate-500'>
													Разблокировано:{' '}
													{new Date(achievement.unlockedAt).toLocaleDateString(
														'ru-RU'
													)}
												</p>
											)}
										</div>
									</div>
								</div>
							)
						})}

						{/* Пользовательские достижения */}
						{customAchievements.map(achievement => {
							return (
								<div
									key={achievement.id}
									className={`p-4 rounded-xl border-2 ${
										rarityColors[achievement.rarity]
									}`}
								>
									<div className='flex items-start gap-3'>
										<div className='text-3xl'>{achievement.icon}</div>
										<div className='flex-1'>
											<h4 className='font-semibold text-slate-900 mb-1'>
												{achievement.title}
											</h4>
											<p className='text-sm text-slate-600 mb-2'>
												{achievement.description}
											</p>
											{achievement.unlockedAt && (
												<p className='text-xs text-slate-500'>
													Разблокировано:{' '}
													{new Date(achievement.unlockedAt).toLocaleDateString(
														'ru-RU'
													)}
												</p>
											)}
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			)}

			{lockedAchievements.length > 0 && (
				<div>
					<h3 className='text-lg font-semibold text-slate-700 mb-4'>
						Заблокированные
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{lockedAchievements.slice(0, 5).map(achievement => (
							<div
								key={achievement.id}
								className='p-4 rounded-xl border-2 border-slate-200 bg-slate-50 opacity-60'
							>
								<div className='flex items-start gap-3'>
									<div className='text-3xl grayscale'>{achievement.icon}</div>
									<div className='flex-1'>
										<h4 className='font-semibold text-slate-600 mb-1'>???</h4>
										<p className='text-sm text-slate-500'>
											Достижение заблокировано
										</p>
									</div>
								</div>
							</div>
						))}
						{lockedAchievements.length > 6 && (
							<div className='p-4 rounded-xl border-2 border-slate-200 bg-slate-50 opacity-60 flex items-center justify-center'>
								<div className='text-center'>
									<div className='text-3xl text-slate-400 mb-2'>...</div>
									<p className='text-sm text-slate-500'>
										Еще {lockedAchievements.length - 6} заблокированных
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
})
