import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AddExperienceRequest, AddExperienceResponse } from './type'

// Функция для получения токена из localStorage
const getToken = () => {
	if (globalThis.window !== undefined) {
		return localStorage.getItem('authToken') || null
	}
	return null
}

export const experienceService = createApi({
	reducerPath: 'experienceApi',
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
	tagTypes: ['Experience', 'User'],
	endpoints: builder => ({
		// PATCH /experience/:userId - Начислить опыт пользователю
		addExperience: builder.mutation<
			AddExperienceResponse,
			{ userId: string; data: AddExperienceRequest }
		>({
			query: ({ userId, data }) => ({
				url: `/experience/${userId}`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: ['Experience', 'User'],
		}),
	}),
})

export const { useAddExperienceMutation } = experienceService
