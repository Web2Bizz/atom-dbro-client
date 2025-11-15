// Типы для работы с опытом пользователя

export interface AddExperienceRequest {
	amount: number
}

export interface AddExperienceResponse {
	level: number
	experience: number
	levelUp?: {
		newLevel: number
		title: string
		experienceGain: number
	}
}

