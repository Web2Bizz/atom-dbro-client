import { z } from 'zod'

export const contactSchema = z.object({
	name: z.string().min(1, 'Название контакта обязательно'),
	value: z.string().min(1, 'Значение контакта обязательно'),
})

export const organizationFormSchema = z.object({
	name: z
		.string()
		.min(1, 'Название организации обязательно')
		.min(3, 'Название должно содержать минимум 3 символа'),
	cityId: z.number().min(1, 'Выберите город'),
	organizationTypeId: z.number().min(1, 'Выберите тип организации'),
	helpTypeIds: z
		.array(z.number())
		.min(1, 'Выберите хотя бы один вид помощи'),
	summary: z
		.string()
		.min(1, 'Краткое описание обязательно')
		.min(10, 'Краткое описание должно содержать минимум 10 символов'),
	description: z
		.string()
		.min(1, 'Подробное описание обязательно')
		.min(20, 'Подробное описание должно содержать минимум 20 символов'),
	mission: z
		.string()
		.min(1, 'Миссия обязательна')
		.min(10, 'Миссия должна содержать минимум 10 символов'),
	goals: z.array(z.string()).default(['']),
	needs: z.array(z.string()).default(['']),
	address: z.string().min(1, 'Адрес обязателен'),
	contacts: z
		.array(contactSchema)
		.min(1, 'Добавьте хотя бы один контакт'),
	latitude: z
		.string()
		.min(1, 'Выберите местоположение на карте')
		.refine(
			val => {
				const num = parseFloat(val)
				return !isNaN(num) && num >= -90 && num <= 90
			},
			'Некорректная широта'
		),
	longitude: z
		.string()
		.min(1, 'Выберите местоположение на карте')
		.refine(
			val => {
				const num = parseFloat(val)
				return !isNaN(num) && num >= -180 && num <= 180
			},
			'Некорректная долгота'
		),
	gallery: z.array(z.string()).default([]),
})

// Удаляем socials из схемы, так как их нет в новой структуре API

export type OrganizationFormData = z.infer<typeof organizationFormSchema>
