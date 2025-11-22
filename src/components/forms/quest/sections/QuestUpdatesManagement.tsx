import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useGetQuestUpdatesQuery } from '@/store/entities/quest'
import { formatDate } from '@/utils/format'
import { Edit2, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { QuestUpdateForm } from '../QuestUpdateForm'
import type { QuestUpdate } from '@/store/entities/quest/model/type'

interface QuestUpdatesManagementProps {
	questId: number
}

export function QuestUpdatesManagement({
	questId,
}: QuestUpdatesManagementProps) {
	const [showCreateForm, setShowCreateForm] = useState(false)
	const [editingUpdateId, setEditingUpdateId] = useState<number | null>(null)

	const { data: updates = [], isLoading, refetch } = useGetQuestUpdatesQuery(
		questId
	)

	const handleSuccess = () => {
		setShowCreateForm(false)
		setEditingUpdateId(null)
		refetch()
	}

	const handleCancel = () => {
		setShowCreateForm(false)
		setEditingUpdateId(null)
	}

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<Spinner />
			</div>
		)
	}

	if (showCreateForm) {
		return (
			<div className='space-y-4'>
				<div className='flex items-center justify-between'>
					<h3 className='text-lg font-semibold text-slate-900'>
						Создать обновление
					</h3>
					<Button
						type='button'
						variant='outline'
						size='sm'
						onClick={handleCancel}
					>
						<X className='h-4 w-4 mr-1' />
						Отмена
					</Button>
				</div>
				<QuestUpdateForm
					questId={questId}
					onSuccess={handleSuccess}
					onCancel={handleCancel}
				/>
			</div>
		)
	}

	if (editingUpdateId) {
		const update = updates.find(u => u.id === editingUpdateId)
		if (!update) {
			setEditingUpdateId(null)
			return null
		}

		return (
			<div className='space-y-4'>
				<div className='flex items-center justify-between'>
					<h3 className='text-lg font-semibold text-slate-900'>
						Редактировать обновление
					</h3>
					<Button
						type='button'
						variant='outline'
						size='sm'
						onClick={handleCancel}
					>
						<X className='h-4 w-4 mr-1' />
						Отмена
					</Button>
				</div>
				<QuestUpdateForm
					questId={questId}
					updateId={editingUpdateId}
					onSuccess={handleSuccess}
					onCancel={handleCancel}
				/>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h3 className='text-lg font-semibold text-slate-900'>
					Обновления квеста
				</h3>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={() => setShowCreateForm(true)}
				>
					<Plus className='h-4 w-4 mr-1' />
					Добавить обновление
				</Button>
			</div>

			{updates.length === 0 ? (
				<div className='bg-slate-50 border border-slate-200 rounded-lg p-8 text-center'>
					<p className='text-slate-600 mb-4'>
						Пока нет обновлений. Добавьте первое обновление, чтобы рассказать о
						прогрессе квеста.
					</p>
					<Button
						type='button'
						variant='outline'
						onClick={() => setShowCreateForm(true)}
					>
						<Plus className='h-4 w-4 mr-2' />
						Добавить обновление
					</Button>
				</div>
			) : (
				<div className='space-y-4'>
					{updates.map(update => (
						<UpdateCard
							key={update.id}
							update={update}
							onEdit={() => setEditingUpdateId(update.id)}
						/>
					))}
				</div>
			)}
		</div>
	)
}

function UpdateCard({
	update,
	onEdit,
}: {
	update: QuestUpdate
	onEdit: () => void
}) {
	return (
		<div className='border border-slate-200 rounded-lg p-6 bg-white'>
			<div className='flex items-start justify-between mb-3'>
				<div className='flex-1'>
					<h4 className='text-base font-semibold text-slate-900 m-0 mb-1'>
						{update.title}
					</h4>
					{update.createdAt && (
						<p className='text-xs text-slate-500 m-0'>
							{formatDate(update.createdAt)}
						</p>
					)}
				</div>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={onEdit}
				>
					<Edit2 className='h-4 w-4 mr-1' />
					Редактировать
				</Button>
			</div>
			<p className='text-sm text-slate-700 leading-relaxed m-0 mb-3'>
				{update.text}
			</p>
			{update.photos && update.photos.length > 0 && (
				<div className='grid grid-cols-2 gap-2 mt-3'>
					{update.photos.map((img, idx) => (
						<img
							key={idx}
							src={img}
							alt={update.title}
							className='w-full h-32 object-cover rounded-lg'
						/>
					))}
				</div>
			)}
		</div>
	)
}

