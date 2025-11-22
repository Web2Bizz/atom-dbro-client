import type { Quest } from '../../types/quest-types'

interface QuestListProps {
	readonly quests: Quest[]
	readonly activeId?: string
	readonly onSelect: (quest: Quest) => void
	readonly onClose?: () => void
	readonly isClosing?: boolean
}

export function QuestList({
	quests,
	activeId,
	onSelect,
	onClose,
	isClosing = false,
}: QuestListProps) {
	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLElement>,
		quest: Quest
	) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			onSelect(quest)
		}
	}

	return (
		<section
			className={`fixed right-5 top-[88px] bottom-20 w-[380px] max-w-[calc(100vw-40px)] z-1000 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/80 overflow-hidden flex flex-col ${
				isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
			}`}
		>
			<header className='sticky top-0 bg-white/98 backdrop-blur-xl border-b border-slate-200 p-6 z-10 flex-shrink-0'>
				<div className='flex items-center justify-between gap-4'>
					<h2 className='text-xl font-bold text-slate-900 m-0'>Квесты</h2>
					{onClose && (
						<button
							type='button'
							onClick={onClose}
							className='shrink-0 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-600 hover:text-slate-900'
							title='Закрыть'
						>
							<svg
								className='h-4 w-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</button>
					)}
				</div>
			</header>

			<div className='flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
				<div className='p-4 space-y-3'>
					{quests.length === 0 ? (
						<div className='text-center py-12 px-4'>
							<p className='text-slate-500 text-sm'>
								Не найдено квестов, подходящих под выбранные фильтры. Попробуйте
								изменить запрос.
							</p>
						</div>
					) : (
						quests.map(quest => {
							const isActive = quest.id === activeId
							return (
								<article
									key={quest.id}
									onClick={() => onSelect(quest)}
									onKeyDown={e => handleKeyDown(e, quest)}
									role='button'
									tabIndex={0}
									className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
										isActive
											? 'border-blue-500 bg-blue-50 shadow-md'
											: 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
									}`}
								>
									<div className='flex items-center justify-between gap-2 mb-2'>
										<span className='text-xs font-medium text-blue-600 uppercase tracking-wider flex-shrink-0'>
											{quest.city}
										</span>
										<div className='flex items-center gap-2 flex-shrink-0'>
											{quest.customAchievement && (
												<span
													className='inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-medium border border-amber-200 shrink-0 whitespace-nowrap'
													title={`Достижение: ${quest.customAchievement.title}`}
												>
													🏆
												</span>
											)}
											<span className='text-xs font-medium text-slate-500 truncate max-w-[120px]'>
												{quest.type}
											</span>
										</div>
									</div>
									<h3 className='text-base font-semibold text-slate-900 m-0 mb-2 line-clamp-2 break-words'>
										{quest.title}
									</h3>
									<div className='flex items-center gap-2 mb-2'>
										<span className='text-xs font-medium text-slate-600'>
											Прогресс: {quest.overallProgress}%
										</span>
										<div className='flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden'>
											<div
												className='h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300'
												style={{ width: `${quest.overallProgress}%` }}
											/>
										</div>
									</div>
									<p className='text-xs text-slate-600 m-0 line-clamp-2'>
										{quest.story}
									</p>
								</article>
							)
						})
					)}
				</div>
			</div>

			{quests.length > 0 && (
				<footer className='sticky bottom-0 bg-white/98 backdrop-blur-xl border-t border-slate-200 p-4 flex-shrink-0'>
					<p className='text-sm text-slate-600 m-0 text-center'>
						Найдено: <strong className='text-slate-900'>{quests.length}</strong>
					</p>
				</footer>
			)}
		</section>
	)
}
