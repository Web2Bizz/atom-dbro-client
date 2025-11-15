import type { Organization } from '@/components/map/types/types'
import { cityMap, helpTypeMap, organizationTypeMap } from '@/components/map/data/organizations'
import { useUser } from '@/hooks/useUser'
import { getCityCoordinates } from '@/utils/cityCoordinates'
import {
	getUserOrganization as getUserOrganizationById,
	updateUserOrganization,
} from '@/utils/userData'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
	organizationFormSchema,
	type OrganizationFormData,
} from '../schemas/organization-form.schema'

export function useOrganizationForm(
	onSuccess?: (organizationId: string) => void
) {
	const {
		user,
		createOrganization,
		canCreateOrganization,
		deleteOrganization,
		getUserOrganization: getUserOrgId,
	} = useUser()

	const existingOrgId = getUserOrgId()
	const existingOrg = existingOrgId
		? getUserOrganizationById(existingOrgId)
		: null
	const isEditMode = !!existingOrg

	const form = useForm<OrganizationFormData>({
		resolver: zodResolver(organizationFormSchema),
		defaultValues: {
			name: '',
			cityId: 0,
			organizationTypeId: 0,
			helpTypeIds: [],
			summary: '',
			description: '',
			mission: '',
			goals: [''],
			needs: [''],
			address: '',
			contacts: [
				{ name: 'Телефон', value: '' },
				...(user?.email ? [{ name: 'Email', value: user.email }] : []),
			],
			latitude: '',
			longitude: '',
			gallery: [],
		},
		mode: 'onChange',
	})

	// Загружаем данные существующей организации при редактировании
	useEffect(() => {
		if (existingOrg && !form.formState.isDirty) {
			const phoneContact = existingOrg.contacts.find(c => c.name === 'Телефон')
			const emailContact = existingOrg.contacts.find(c => c.name === 'Email')

			form.reset({
				name: existingOrg.name || '',
				cityId: existingOrg.city.id || 0,
				organizationTypeId: existingOrg.organizationTypes[0]?.id || 0,
				helpTypeIds: existingOrg.helpTypes.map(ht => ht.id),
				summary: existingOrg.summary || '',
				description: existingOrg.description || '',
				mission: existingOrg.mission || '',
				goals:
					existingOrg.goals && existingOrg.goals.length > 0
						? existingOrg.goals
						: [''],
				needs:
					existingOrg.needs && existingOrg.needs.length > 0
						? existingOrg.needs
						: [''],
				address: existingOrg.address || '',
				contacts: [
					...(phoneContact ? [phoneContact] : [{ name: 'Телефон', value: '' }]),
					...(emailContact
						? [emailContact]
						: user?.email
							? [{ name: 'Email', value: user.email }]
							: []),
				],
				latitude: existingOrg.latitude || '',
				longitude: existingOrg.longitude || '',
				gallery: existingOrg.gallery || [],
			})
		}
	}, [existingOrg, user?.email, form])

	const onSubmit = async (data: OrganizationFormData) => {
		if (!isEditMode && !canCreateOrganization()) {
			toast.error(
				'Вы уже создали организацию. Один пользователь может создать только одну организацию.'
			)
			return
		}

		if (!data.latitude || !data.longitude) {
			toast.error('Пожалуйста, выберите местоположение на карте.')
			return
		}

		try {
			const organizationId =
				existingOrg?.id || `user-${user?.id}-org-${Date.now()}`

			// Получаем данные города
			const cityName = Object.values(cityMap).find(c => c.id === data.cityId)?.name || ''
			const city = cityMap[cityName] || {
				id: data.cityId,
				name: cityName,
				latitude: data.latitude,
				longitude: data.longitude,
			}

			const newOrganization: Organization = {
				id: organizationId,
				name: data.name,
				latitude: data.latitude,
				longitude: data.longitude,
				summary: data.summary,
				mission: data.mission,
				description: data.description,
				goals: data.goals.filter(g => g.trim() !== ''),
				needs: data.needs.filter(n => n.trim() !== ''),
				address: data.address,
				contacts: data.contacts.filter(c => c.value.trim() !== ''),
				organizationTypes: [
					{
						id: data.organizationTypeId,
						name:
							Object.values(organizationTypeMap).find(
								ot => ot.id === data.organizationTypeId
							)?.name || '',
					},
				],
				gallery: data.gallery,
				city: {
					id: city.id,
					name: city.name,
					latitude: city.latitude,
					longitude: city.longitude,
				},
				helpTypes: data.helpTypeIds
					.map(id => {
						const helpType = Object.values(helpTypeMap).find(ht => ht.id === id)
						return helpType ? { id: helpType.id, name: helpType.name } : null
					})
					.filter((ht): ht is { id: number; name: string } => ht !== null),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			if (isEditMode) {
				updateUserOrganization(newOrganization)
			} else {
				const existingOrganizations = JSON.parse(
					localStorage.getItem('user_created_organizations') || '[]'
				)
				existingOrganizations.push(newOrganization)
				localStorage.setItem(
					'user_created_organizations',
					JSON.stringify(existingOrganizations)
				)
				createOrganization(organizationId)
			}

			toast.success(
				isEditMode
					? 'Организация успешно обновлена!'
					: 'Организация успешно создана!'
			)

			// Сохраняем координаты для зума на карте при сохранении
			if (data.latitude && data.longitude) {
				localStorage.setItem(
					'zoomToCoordinates',
					JSON.stringify({
						lat: parseFloat(data.latitude),
						lng: parseFloat(data.longitude),
						zoom: 15,
					})
				)
			}

			if (onSuccess) {
				onSuccess(organizationId)
			}
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error('Error creating organization:', error)
			}
			toast.error('Не удалось создать организацию. Попробуйте еще раз.')
		}
	}

	const handleCityChange = (cityName: string) => {
		const city = cityMap[cityName]
		if (city) {
			form.setValue('cityId', city.id)
			// Устанавливаем координаты города для зума, но не перезаписываем координаты организации
			// Координаты организации должны устанавливаться через карту
		}
	}

	const handleDelete = async () => {
		if (!existingOrgId) return
		deleteOrganization(existingOrgId)
		toast.success('Организация успешно удалена.')
		form.reset()
	}

	const handleSubmit = form.handleSubmit(onSubmit)

	return {
		form,
		isSubmitting: form.formState.isSubmitting,
		isEditMode,
		onSubmit: handleSubmit,
		handleCityChange,
		handleDelete,
	}
}
