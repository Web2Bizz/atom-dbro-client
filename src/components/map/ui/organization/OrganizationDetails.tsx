import { ImageGallery } from '@/components/ui/ImageGallery'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetOrganizationUpdatesQuery } from '@/store/entities/organization'
import { formatDate } from '@/utils/format'
import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Organization } from '../../types/types'

interface OrganizationDetailsProps {
	readonly organization?: Organization
	readonly onClose?: () => void
	readonly isClosing?: boolean
}

// Компонент для изображения галереи с скелетоном
function GalleryImage({
	image,
	index,
	onClick,
}: {
	image: string
	index: number
	onClick: () => void
}) {
	const [loading, setLoading] = useState(true)

	return (
		<button
			type='button'
			onClick={onClick}
			className='relative aspect-square rounded-lg overflow-hidden group cursor-pointer'
		>
			{loading && (
				<Skeleton className='absolute inset-0 w-full h-full rounded-lg' />
			)}
			<img
				src={image}
				alt={`Фото ${index + 1} из галереи организации`}
				className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-200 ${
					loading ? 'opacity-0' : 'opacity-100'
				}`}
				loading='lazy'
				onLoad={() => setLoading(false)}
				onError={() => setLoading(false)}
			/>
			<div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors' />
		</button>
	)
}

export function OrganizationDetails({
	organization,
	onClose,
	isClosing = false,
}: OrganizationDetailsProps) {
	const [galleryIndex, setGalleryIndex] = useState<number | null>(null)
	const [updateGalleryState, setUpdateGalleryState] = useState<{
		updateId: number
		imageIndex: number
	} | null>(null)
	const [activeTab, setActiveTab] = useState<'info' | 'updates'>('info')

	// Получаем обновления организации через API
	const numericOrganizationId = organization?.id
		? Number(organization.id)
		: undefined
	const { data: organizationUpdatesRaw = [], isLoading: isLoadingUpdates } =
		useGetOrganizationUpdatesQuery(numericOrganizationId!, {
			skip: !numericOrganizationId,
		})

	// Преобразуем обновления организации из API в формат компонента
	const organizationUpdates = useMemo(() => {
		return organizationUpdatesRaw.map(update => ({
			id: String(update.id),
			date: update.createdAt || new Date().toISOString(),
			title: update.title,
			content: update.text,
			images: update.photos || [],
			author: 'Организация',
		}))
	}, [organizationUpdatesRaw])

	if (!organization && !isClosing) {
		return null
	}

	return (
		<>
			<section
				className={`fixed left-5 top-[88px] bottom-20 w-[420px] max-w-[calc(100vw-40px)] z-[100] bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/80 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
					isClosing ? 'animate-slide-out-left' : 'animate-slide-in-left'
				}`}
			>
				{organization && (
					<>
						<header className='sticky top-0 bg-white/98 backdrop-blur-xl border-b border-slate-200 p-6 z-10'>
							<div className='flex items-start justify-between gap-4'>
								<div className='flex-1 min-w-0'>
									<p className='text-xs font-medium text-slate-500 uppercase tracking-wider mb-1'>
										{organization.city?.name || ''}
									</p>
									<h2 className='text-2xl font-bold text-slate-900 m-0 mb-2'>
										{organization.name}
									</h2>
									<p className='text-sm text-slate-600 m-0'>
										{organization.organizationTypes?.[0]?.name ||
											(
												organization as Organization & {
													type?: { name: string }
												}
											).type?.name ||
											''}
									</p>
								</div>
								{onClose && (
									<button
										className='shrink-0 w-8 h-8 cursor-pointer rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-600 hover:text-slate-900'
										onClick={onClose}
										type='button'
										title='Закрыть'
									>
										<X className='h-4 w-4' />
									</button>
								)}
							</div>
						</header>

						<div className='p-6 space-y-6'>
							{/* Табы для информации и обновлений */}
							<div className='border-b border-slate-200'>
								<div className='flex gap-4'>
									<button
										type='button'
										onClick={() => setActiveTab('info')}
										className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
											activeTab === 'info'
												? 'border-blue-600 text-blue-600'
												: 'border-transparent text-slate-500 hover:text-slate-700'
										}`}
									>
										Информация
									</button>
									<button
										type='button'
										onClick={() => setActiveTab('updates')}
										className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
											activeTab === 'updates'
												? 'border-blue-600 text-blue-600'
												: 'border-transparent text-slate-500 hover:text-slate-700'
										}`}
									>
										Обновления ({organizationUpdates.length})
									</button>
								</div>
							</div>

							{/* Контент табов */}
							{activeTab === 'info' && (
								<div className='space-y-6'>
									<p className='text-base text-slate-700 leading-relaxed m-0'>
										{organization.summary}
									</p>

									<div className='space-y-1'>
										<h3 className='text-lg font-semibold text-slate-900 m-0'>
											Миссия
										</h3>
										<p className='text-sm text-slate-600 leading-relaxed m-0'>
											{organization.mission}
										</p>
									</div>

									{organization.goals && organization.goals.length > 0 && (
										<div className='space-y-2'>
											<h3 className='text-lg font-semibold text-slate-900 m-0'>
												Цели
											</h3>
											<ul className='list-none m-0 p-0 space-y-1.5'>
												{organization.goals.map(item => (
													<li
														key={item}
														className='text-sm text-slate-600 pl-4 relative before:content-["•"] before:absolute before:left-0 before:text-slate-400'
													>
														{item}
													</li>
												))}
											</ul>
										</div>
									)}

									{organization.needs && organization.needs.length > 0 && (
										<div className='space-y-2'>
											<h3 className='text-lg font-semibold text-slate-900 m-0'>
												Актуальные нужды
											</h3>
											<ul className='list-none m-0 p-0 space-y-1.5'>
												{organization.needs.map(item => (
													<li
														key={item}
														className='text-sm text-slate-600 pl-4 relative before:content-["•"] before:absolute before:left-0 before:text-slate-400'
													>
														{item}
													</li>
												))}
											</ul>
										</div>
									)}

									{organization.helpTypes &&
										organization.helpTypes.length > 0 && (
											<div className='space-y-2'>
												<h3 className='text-lg font-semibold text-slate-900 m-0'>
													Как можно помочь
												</h3>
												<div className='flex flex-wrap gap-2'>
													{organization.helpTypes.map((item, index) => (
														<span
															key={item.id || index}
															className='inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200'
														>
															{item.name}
														</span>
													))}
												</div>
											</div>
										)}

									<div className='space-y-2'>
										<h3 className='text-lg font-semibold text-slate-900 m-0'>
											Контакты
										</h3>
										<div className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm'>
											<span className='font-medium text-slate-500'>Адрес</span>
											<p className='text-slate-700 m-0'>
												{organization.address || 'Не указан'}
											</p>

											{organization.contacts &&
												organization.contacts.length > 0 &&
												organization.contacts.map((contact, index) => {
													// Функция для формирования ссылки в зависимости от типа контакта
													const getContactUrl = (
														name: string,
														value: string
													): string | null => {
														const normalizedName = name.toLowerCase().trim()
														const normalizedValue = value.trim()

														if (!normalizedValue) return null

														if (normalizedName === 'телефон') {
															// Убираем все нецифровые символы для tel: ссылки
															const phoneNumber = normalizedValue.replace(
																/\D/g,
																''
															)
															return phoneNumber ? `tel:${phoneNumber}` : null
														}

														if (normalizedName === 'email') {
															return `mailto:${normalizedValue}`
														}

														if (normalizedName === 'whatsapp') {
															// Убираем все нецифровые символы для WhatsApp
															const phoneNumber = normalizedValue.replace(
																/\D/g,
																''
															)
															return phoneNumber
																? `https://wa.me/${phoneNumber}`
																: null
														}

														if (normalizedName === 'telegram') {
															// Убираем @ если есть
															const username = normalizedValue
																.replace(/^@/, '')
																.replace(/\s/g, '')
															return username
																? `https://t.me/${username}`
																: null
														}

														if (
															normalizedName === 'instagram' ||
															normalizedName === 'инстаграм'
														) {
															// Убираем @ если есть
															const username = normalizedValue
																.replace(/^@/, '')
																.replace(/\s/g, '')
															return username
																? `https://instagram.com/${username}`
																: null
														}

														if (
															normalizedName === 'вконтакте' ||
															normalizedName === 'vk' ||
															normalizedName === 'vkontakte'
														) {
															// Убираем vk.com/ если есть
															const username = normalizedValue
																.replace(
																	/^(https?:\/\/)?(www\.)?(vk\.com\/|vkontakte\.ru\/)?/i,
																	''
																)
																.replace(/\s/g, '')
															return username
																? `https://vk.com/${username}`
																: null
														}

														if (
															normalizedName === 'tiktok' ||
															normalizedName === 'тикток'
														) {
															// Убираем @ если есть и tiktok.com/ если есть
															const username = normalizedValue
																.replace(/^@/, '')
																.replace(
																	/^(https?:\/\/)?(www\.)?(tiktok\.com\/@?)?/i,
																	''
																)
																.replace(/\s/g, '')
															return username
																? `https://www.tiktok.com/@${username}`
																: null
														}

														// Если значение уже является URL, используем его
														if (
															normalizedValue.startsWith('http://') ||
															normalizedValue.startsWith('https://')
														) {
															return normalizedValue
														}

														// Для остальных типов возвращаем null (будет отображаться как текст)
														return null
													}

													const contactUrl = getContactUrl(
														contact.name,
														contact.value
													)

													return (
														<>
															<span
																key={`label-${index}`}
																className='font-medium text-slate-500'
															>
																{contact.name}
															</span>
															{contactUrl ? (
																<a
																	key={`value-${index}`}
																	href={contactUrl}
																	target='_blank'
																	rel='noopener noreferrer'
																	className='text-blue-600 hover:text-blue-700 hover:underline m-0'
																>
																	{contact.value}
																</a>
															) : (
																<p
																	key={`value-${index}`}
																	className='text-slate-700 m-0'
																>
																	{contact.value}
																</p>
															)}
														</>
													)
												})}
										</div>
									</div>

									{/* Галерея */}
									{organization.gallery && organization.gallery.length > 0 && (
										<div className='space-y-3'>
											<h3 className='text-lg font-semibold text-slate-900 m-0'>
												Галерея
											</h3>
											<div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
												{organization.gallery.map((image, index) => (
													<GalleryImage
														key={`gallery-${index}-${image.slice(0, 20)}`}
														image={image}
														index={index}
														onClick={() => setGalleryIndex(index)}
													/>
												))}
											</div>
										</div>
									)}
								</div>
							)}

							{activeTab === 'updates' && (
								<div className='space-y-4'>
									{isLoadingUpdates ? (
										<div className='flex items-center justify-center py-8'>
											<Skeleton className='h-8 w-8' />
										</div>
									) : organizationUpdates.length === 0 ? (
										<p className='text-sm text-slate-500 text-center py-8'>
											Пока нет обновлений
										</p>
									) : (
										organizationUpdates.map(update => (
											<div
												key={update.id}
												className='p-4 rounded-xl border border-slate-200 bg-white'
											>
												<div className='flex items-start justify-between mb-2'>
													<div>
														<h4 className='text-base font-semibold text-slate-900 m-0'>
															{update.title}
														</h4>
														{update.date && (
															<p className='text-xs text-slate-500 m-0 mt-1'>
																{formatDate(update.date)}
															</p>
														)}
													</div>
												</div>
												<p className='text-sm text-slate-700 leading-relaxed m-0 mb-3'>
													{update.content}
												</p>
												{update.images && update.images.length > 0 && (
													<div className='grid grid-cols-2 gap-2'>
														{update.images.map((img: string, idx: number) => (
															<GalleryImage
																key={`${update.id}-${idx}`}
																image={img}
																index={idx}
																onClick={() =>
																	setUpdateGalleryState({
																		updateId: Number(update.id),
																		imageIndex: idx,
																	})
																}
															/>
														))}
													</div>
												)}
											</div>
										))
									)}
								</div>
							)}
						</div>
					</>
				)}
			</section>

			{/* Галерея изображений организации */}
			{galleryIndex !== null && organization && (
				<ImageGallery
					images={organization.gallery}
					currentIndex={galleryIndex}
					onClose={() => setGalleryIndex(null)}
					onChangeIndex={setGalleryIndex}
				/>
			)}

			{/* Галерея изображений обновления */}
			{updateGalleryState !== null && organizationUpdates.length > 0 && (
				<ImageGallery
					images={
						organizationUpdates.find(
							u => String(u.id) === String(updateGalleryState.updateId)
						)?.images || []
					}
					currentIndex={updateGalleryState.imageIndex}
					onClose={() => setUpdateGalleryState(null)}
					onChangeIndex={index =>
						setUpdateGalleryState({
							updateId: updateGalleryState.updateId,
							imageIndex: index,
						})
					}
				/>
			)}
		</>
	)
}
