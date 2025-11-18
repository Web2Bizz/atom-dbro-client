import { z } from 'zod'

export const stageFormSchema = z.object({
	title: z.string().min(1, 'Название этапа обязательно'),
	description: z.string().min(1, 'Описание этапа обязательно'),
	status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
	progress: z.number().min(0).max(100).default(0),
	hasFinancial: z.boolean().optional(),
	financialNeeded: z.number().min(0).optional(),
	hasVolunteers: z.boolean().optional(),
	volunteersNeeded: z.number().min(0).optional(),
	hasItems: z.boolean().optional(),
	itemsNeeded: z.number().min(0).optional(),
	itemName: z.string().optional(),
	deadline: z.string().optional(),
})

export const socialFormSchema = z.object({
	name: z.enum(['VK', 'Telegram', 'Website']),
	url: z
		.string()
		.optional()
		.refine(
			val => !val || val === '' || z.string().url().safeParse(val).success,
			'Некорректный URL'
		),
})

export const updateFormSchema = z.object({
	id: z.string(),
	title: z.string().min(1, 'Заголовок обновления обязателен'),
	content: z.string().min(1, 'Текст обновления обязателен'),
	images: z.array(z.string()).default([]),
})

export const customAchievementSchema = z
	.object({
		icon: z.string().min(1, 'Эмодзи обязательно'),
		title: z.string().min(1, 'Название достижения обязательно'),
		description: z.string().min(1, 'Описание достижения обязательно'),
	})
	.optional()
	.nullable()

export const questFormSchema = z.object({
	title: z
		.string()
		.min(1, 'Название квеста обязательно')
		.min(3, 'Название должно содержать минимум 3 символа'),
	cityId: z.number().min(1, 'Выберите город'),
	organizationTypeId: z.number().min(1, 'Выберите тип квеста'),
	category: z.enum(['environment', 'animals', 'people', 'education', 'other']),
	story: z
		.string()
		.min(1, 'Описание квеста обязательно')
		.min(20, 'Описание должно содержать минимум 20 символов'),
	storyImage: z.string().optional(),
	gallery: z.array(z.string()).default([]),
	address: z.string().min(1, 'Адрес обязателен'),
	curatorName: z.string().min(1, 'Имя куратора обязательно'),
	curatorPhone: z.string().min(1, 'Телефон куратора обязателен'),
	curatorEmail: z
		.string()
		.email('Некорректный email')
		.optional()
		.or(z.literal('')),
	latitude: z
		.string()
		.min(1, 'Выберите местоположение на карте')
		.refine(val => {
			const num = parseFloat(val)
			return !isNaN(num) && num >= -90 && num <= 90
		}, 'Некорректная широта'),
	longitude: z
		.string()
		.min(1, 'Выберите местоположение на карте')
		.refine(val => {
			const num = parseFloat(val)
			return !isNaN(num) && num >= -180 && num <= 180
		}, 'Некорректная долгота'),
	stages: z.array(stageFormSchema).min(1, 'Добавьте хотя бы один этап квеста'),
	socials: z.array(socialFormSchema).default([{ name: 'VK', url: '' }]),
	updates: z.array(updateFormSchema).default([]),
	customAchievement: customAchievementSchema,
})

export type QuestFormData = z.infer<typeof questFormSchema>
export type StageFormData = z.infer<typeof stageFormSchema>
export type SocialFormData = z.infer<typeof socialFormSchema>
export type UpdateFormData = z.infer<typeof updateFormSchema>
