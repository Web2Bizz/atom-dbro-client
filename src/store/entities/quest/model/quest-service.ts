import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
	ContributeRequest,
	ContributeResponse,
	CreateQuestRequest,
	CreateQuestResponse,
	CreateUpdateRequest,
	CreateUpdateResponse,
	DeleteQuestResponse,
	GetQuestsParams,
	ParticipateRequest,
	ParticipateResponse,
	QuestResponse,
	QuestsListResponse,
	UpdateQuestRequest,
	VolunteerRegistrationRequest,
	VolunteerRegistrationResponse,
} from './type'

// Функция для получения токена из localStorage
const getToken = () => {
	if (globalThis.window !== undefined) {
		return localStorage.getItem('authToken') || null
	}
	return null
}

export const questService = createApi({
	reducerPath: 'questApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://82.202.140.37:3000/api/v1',
		prepareHeaders: headers => {
			const token = getToken()
			if (token) {
				headers.set('authorization', `Bearer ${token}`)
			}
			return headers
		},
	}),
	tagTypes: ['Quest', 'QuestList'],
	endpoints: builder => ({
		// GET /quests - Получить список квестов с фильтрацией
		getQuests: builder.query<QuestsListResponse, GetQuestsParams | void>({
			query: params => {
				if (!params) return '/quests'
				const searchParams = new URLSearchParams()
				if (params.city) searchParams.append('city', params.city)
				if (params.type) searchParams.append('type', params.type)
				if (params.category) searchParams.append('category', params.category)
				if (params.status) searchParams.append('status', params.status)
				if (params.search) searchParams.append('search', params.search)
				if (params.page) searchParams.append('page', params.page.toString())
				if (params.limit) searchParams.append('limit', params.limit.toString())
				if (params.sort) searchParams.append('sort', params.sort)
				if (params.assistance && params.assistance.length > 0) {
					for (const id of params.assistance) {
						searchParams.append('assistance', id)
					}
				}
				const queryString = searchParams.toString()
				return queryString ? `/quests?${queryString}` : '/quests'
			},
			providesTags: ['QuestList'],
		}),

		// GET /quests/:questId - Получить детальную информацию о квесте
		getQuest: builder.query<QuestResponse, string>({
			query: questId => `/quests/${questId}`,
			providesTags: (_result, _error, questId) => [
				{ type: 'Quest', id: questId },
			],
		}),

		// POST /quests - Создать новый квест
		createQuest: builder.mutation<CreateQuestResponse, CreateQuestRequest>({
			query: body => ({
				url: '/quests',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['QuestList'],
		}),

		// PATCH /quests/:questId - Обновить квест
		updateQuest: builder.mutation<
			QuestResponse,
			{ questId: string; data: UpdateQuestRequest }
		>({
			query: ({ questId, data }) => ({
				url: `/quests/${questId}`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: (_result, _error, { questId }) => [
				'QuestList',
				{ type: 'Quest', id: questId },
			],
		}),

		// DELETE /quests/:questId - Удалить квест
		deleteQuest: builder.mutation<DeleteQuestResponse, string>({
			query: questId => ({
				url: `/quests/${questId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['QuestList'],
		}),

		// POST /quests/:questId/participate - Присоединиться к квесту
		participate: builder.mutation<
			ParticipateResponse,
			{ questId: string; role: ParticipateRequest['role'] }
		>({
			query: ({ questId, role }) => ({
				url: `/quests/${questId}/participate`,
				method: 'POST',
				body: { role },
			}),
			invalidatesTags: (_result, _error, { questId }) => [
				'QuestList',
				{ type: 'Quest', id: questId },
			],
		}),

		// POST /quests/:questId/contribute - Внести вклад в квест
		contribute: builder.mutation<
			ContributeResponse,
			{ questId: string; data: ContributeRequest }
		>({
			query: ({ questId, data }) => ({
				url: `/quests/${questId}/contribute`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_result, _error, { questId }) => [
				'QuestList',
				{ type: 'Quest', id: questId },
			],
		}),

		// POST /quests/:questId/stages/:stageId/volunteers - Зарегистрироваться на волонтерское событие
		registerVolunteer: builder.mutation<
			VolunteerRegistrationResponse,
			{ questId: string; stageId: string; data: VolunteerRegistrationRequest }
		>({
			query: ({ questId, stageId, data }) => ({
				url: `/quests/${questId}/stages/${stageId}/volunteers`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_result, _error, { questId }) => [
				'QuestList',
				{ type: 'Quest', id: questId },
			],
		}),

		// POST /quests/:questId/updates - Добавить обновление к квесту
		createUpdate: builder.mutation<
			CreateUpdateResponse,
			{ questId: string; data: CreateUpdateRequest }
		>({
			query: ({ questId, data }) => ({
				url: `/quests/${questId}/updates`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (_result, _error, { questId }) => [
				'QuestList',
				{ type: 'Quest', id: questId },
			],
		}),
	}),
})

export const {
	useGetQuestsQuery,
	useLazyGetQuestsQuery,
	useGetQuestQuery,
	useLazyGetQuestQuery,
	useCreateQuestMutation,
	useUpdateQuestMutation,
	useDeleteQuestMutation,
	useParticipateMutation,
	useContributeMutation,
	useRegisterVolunteerMutation,
	useCreateUpdateMutation,
} = questService
