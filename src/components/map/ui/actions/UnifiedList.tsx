import type { Quest } from '../../types/quest-types'
import type { Organization } from '../../types/types'

interface UnifiedListProps {
	readonly quests: Quest[]
	readonly organizations: Organization[]
	readonly activeQuestId?: string
	readonly activeOrgId?: string
	readonly onSelectQuest: (quest: Quest) => void
	readonly onSelectOrganization: (organization: Organization) => void
	readonly onClose?: () => void
	readonly isClosing?: boolean
}

export function UnifiedList({
	quests,
	organizations,
	activeQuestId,
	activeOrgId,
	onSelectQuest,
	onSelectOrganization,
	onClose,
	isClosing = false,
}: UnifiedListProps) {
	const totalCount = quests.length + organizations.length

	return (
		<section
			className={`fixed right-5 top-[88px] bottom-20 w-[380px] max-w-[calc(100vw-40px)] z-10 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/80 overflow-hidden flex flex-col ${
				isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
			}`}
		>
			<header className='sticky top-0 bg-white/98 backdrop-blur-xl border-b border-slate-200 p-6 z-10 flex-shrink-0'>
				<div className='flex items-center justify-between gap-4'>
					<h2 className='text-xl font-bold text-slate-900 m-0'>
						Квесты и Организации
					</h2>
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
				<div className='p-4 space-y-4'>
					{totalCount === 0 ? (
						<div className='text-center py-12 px-4'>
							<p className='text-slate-500 text-sm'>
								Не найдено квестов и организаций, подходящих под выбранные
								фильтры. Попробуйте изменить запрос.
							</p>
						</div>
					) : (
						<>
							{quests.length > 0 && (
								<div>
									<h3 className='text-sm font-semibold text-slate-700 mb-3 px-2'>
										Квесты ({quests.length})
									</h3>
									<div className='space-y-3'>
										{quests.map(quest => {
											const isActive = quest.id === activeQuestId
											return (
												<article
													key={quest.id}
													onClick={() => onSelectQuest(quest)}
													onKeyDown={e => {
														if (e.key === 'Enter' || e.key === ' ') {
															e.preventDefault()
															onSelectQuest(quest)
														}
													}}
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
													<h3 className='text-base font-semibold text-slate-900 m-0 mb-2 line-clamp-1 break-words'>
														{quest.title}
													</h3>
													<p className='text-sm text-slate-600 m-0 mb-2 line-clamp-2'>
														{quest.story}
													</p>
													<div className='flex items-center gap-2 text-xs text-slate-500'>
														<span>Прогресс: {quest.overallProgress}%</span>
													</div>
												</article>
											)
										})}
									</div>
								</div>
							)}

							{organizations.length > 0 && (
								<div>
									<h3 className='text-sm font-semibold text-slate-700 mb-3 px-2'>
										Организации ({organizations.length})
									</h3>
									<div className='space-y-3'>
										{organizations.map(organization => {
											const isActive = organization.id === activeOrgId
											return (
												<article
													key={organization.id}
													className={`p-4 rounded-xl border-2 transition-all ${
														isActive
															? 'border-blue-500 bg-blue-50 shadow-md'
															: 'border-slate-200 bg-white'
													}`}
												>
													<div className='flex items-center justify-between gap-2 mb-2'>
														<span className='text-xs font-medium text-blue-600 uppercase tracking-wider'>
															{organization.city.name}
														</span>
														<span className='text-xs font-medium text-slate-500'>
															{organization.organizationTypes[0]?.name || ''}
														</span>
													</div>
													<h3 className='text-base font-semibold text-slate-900 m-0 mb-2 line-clamp-1'>
														{organization.name}
													</h3>
													<p className='text-sm text-slate-600 m-0 mb-3 line-clamp-2'>
														{organization.summary}
													</p>
													{organization.helpTypes.length > 0 && (
														<div className='flex flex-wrap gap-1.5 mb-3'>
															{organization.helpTypes.map((item, index) => (
																<span
																	key={item.id || index}
																	className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200'
																>
																	{item.name}
																</span>
															))}
														</div>
													)}
													<button
														type='button'
														onClick={e => {
															e.stopPropagation()
															onSelectOrganization(organization)
														}}
														className='w-full mt-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors'
													>
														Перейти к организации
													</button>
												</article>
											)
										})}
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{totalCount > 0 && (
				<footer className='sticky bottom-0 bg-white/98 backdrop-blur-xl border-t border-slate-200 p-4 flex-shrink-0'>
					<p className='text-sm text-slate-600 m-0 text-center'>
						Найдено: <strong className='text-slate-900'>{totalCount}</strong> (
						{quests.length} квестов, {organizations.length} организаций)
					</p>
				</footer>
			)}
		</section>
	)
}
