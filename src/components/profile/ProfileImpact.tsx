import { memo } from 'react'
import { TrendingUp } from 'lucide-react'
import type { User } from '@/types/user'

interface ProfileImpactProps {
	impact: User['stats']['totalImpact']
}

export const ProfileImpact = memo(function ProfileImpact({
	impact,
}: ProfileImpactProps) {
	return (
		<div className='bg-white rounded-2xl shadow-lg p-8'>
			<h2 className='text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2'>
				<TrendingUp className='h-6 w-6 text-blue-600' />
				Ваше влияние
			</h2>
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
				<div className='text-center p-4 rounded-xl bg-green-50 border border-green-200'>
					<p className='text-3xl mb-1'>🌳</p>
					<p className='text-2xl font-bold text-slate-900'>
						{impact.treesPlanted}
					</p>
					<p className='text-sm text-slate-600'>Деревьев посажено</p>
				</div>
				<div className='text-center p-4 rounded-xl bg-blue-50 border border-blue-200'>
					<p className='text-3xl mb-1'>🐾</p>
					<p className='text-2xl font-bold text-slate-900'>
						{impact.animalsHelped}
					</p>
					<p className='text-sm text-slate-600'>Животных помогли</p>
				</div>
				<div className='text-center p-4 rounded-xl bg-cyan-50 border border-cyan-200'>
					<p className='text-3xl mb-1'>🧹</p>
					<p className='text-2xl font-bold text-slate-900'>
						{impact.areasCleaned}
					</p>
					<p className='text-sm text-slate-600'>Зон очищено</p>
				</div>
				<div className='text-center p-4 rounded-xl bg-purple-50 border border-purple-200'>
					<p className='text-3xl mb-1'>❤️</p>
					<p className='text-2xl font-bold text-slate-900'>
						{impact.livesChanged}
					</p>
					<p className='text-sm text-slate-600'>Жизней изменено</p>
				</div>
			</div>
		</div>
	)
})

