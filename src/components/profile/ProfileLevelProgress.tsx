interface ProfileLevelProgressProps {
	experience: number
	experienceToNext: number
}

export function ProfileLevelProgress({
	experience,
	experienceToNext,
}: ProfileLevelProgressProps) {
	const levelProgress = (experience / experienceToNext) * 100

	return (
		<div className='mb-6'>
			<div className='flex items-center justify-between mb-2'>
				<span className='text-sm font-medium text-slate-700'>
					Опыт до следующего уровня
				</span>
				<span className='text-sm font-semibold text-slate-900'>
					{experience} / {experienceToNext}
				</span>
			</div>
			<div className='h-3 bg-slate-200 rounded-full overflow-hidden'>
				<div
					className='h-full bg-gradient-to-r from-blue-500 to-cyan-600 transition-all duration-500'
					style={{ width: `${levelProgress}%` }}
				/>
			</div>
		</div>
	)
}

