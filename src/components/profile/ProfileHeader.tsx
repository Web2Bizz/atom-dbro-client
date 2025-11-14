import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import type { User } from '@/types/user'

interface ProfileHeaderProps {
	user: User
	onLogout: () => void
}

export const ProfileHeader = memo(function ProfileHeader({
	user,
	onLogout,
}: ProfileHeaderProps) {
	return (
		<div className='bg-white rounded-2xl shadow-lg p-8'>
			<div className='flex items-start gap-6 mb-6'>
				<div className='w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-3xl font-bold'>
					{user.name.charAt(0).toUpperCase()}
				</div>
				<div className='flex-1'>
					<div className='flex items-start justify-between'>
						<div>
							<h1 className='text-3xl font-bold text-slate-900 mb-2'>
								{user.name}
							</h1>
							<p className='text-slate-600 mb-4'>{user.email}</p>
							<div className='flex items-center gap-4'>
								<div className='px-4 py-2 rounded-full bg-blue-50 border border-blue-200'>
									<span className='text-sm font-semibold text-blue-700'>
										Уровень {user.level.level}: {user.level.title}
									</span>
								</div>
							</div>
						</div>
						<Button
							variant='outline'
							onClick={onLogout}
							className='flex items-center gap-2'
						>
							<LogOut className='h-4 w-4' />
							Выйти
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
})

