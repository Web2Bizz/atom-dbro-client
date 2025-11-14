import { ActiveQuests } from '@/components/profile/ActiveQuests'
import { ProfileAchievements } from '@/components/profile/ProfileAchievements'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileImpact } from '@/components/profile/ProfileImpact'
import { ProfileLevelProgress } from '@/components/profile/ProfileLevelProgress'
import { ProfileStats } from '@/components/profile/ProfileStats'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/useUser'
import type { Achievement } from '@/types/user'
import { toast } from 'sonner'

export default function ProfilePage() {
	const { user, logout } = useUser()

	if (!user) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<p className='text-slate-600 mb-4'>Пожалуйста, войдите в систему</p>
					<Button asChild>
						<a href='/login'>Войти</a>
					</Button>
				</div>
			</div>
		)
	}

	const handleLogout = () => {
		logout()
		toast.success('Вы вышли из аккаунта')
		window.location.href = '/'
	}

	const unlockedAchievements = user.achievements.filter(
		(achievement: Achievement) => achievement.unlockedAt !== undefined
	)

	return (
		<ProtectedRoute>
			<div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 mt-16'>
				<div className='max-w-4xl mx-auto space-y-8'>
					<ProfileHeader user={user} onLogout={handleLogout} />

					<div className='bg-white rounded-2xl shadow-lg p-8'>
						<ProfileLevelProgress
							experience={user.level.experience}
							experienceToNext={user.level.experienceToNext}
						/>

						<ProfileStats
							stats={user.stats}
							unlockedAchievementsCount={unlockedAchievements.length}
						/>
					</div>

					<ProfileImpact impact={user.stats.totalImpact} />

					<ProfileAchievements userAchievements={user.achievements} />

					<ActiveQuests />
				</div>
			</div>
		</ProtectedRoute>
	)
}
