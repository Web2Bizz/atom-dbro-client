import type { Achievement, AchievementId } from '@/types/user'

export const allAchievements: Record<AchievementId, Achievement> = {
	first_quest: {
		id: '15',
		title: 'Первый шаг',
		description: 'Присоединились к своему первому квесту',
		icon: '🎯',
		rarity: 'common',
	},
	volunteer_month: {
		id: 'volunteer_month',
		title: 'Волонтер месяца',
		description: 'Активно участвовали в волонтерских мероприятиях',
		icon: '⭐',
		rarity: 'epic',
	},
	quest_completer: {
		id: '16',
		title: 'Завершитель квестов',
		description: 'Завершили 5 квестов на 100%',
		icon: '🏆',
		rarity: 'legendary',
	},
	social_ambassador: {
		id: '17',
		title: 'Социальный амбассадор',
		description: 'Поделились квестом в социальных сетях',
		icon: '📢',
		rarity: 'common',
	},
}

export function getAchievementById(id: AchievementId): Achievement {
	return allAchievements[id]
}

export function getAchievementsByRarity(
	rarity: Achievement['rarity']
): Achievement[] {
	return Object.values(allAchievements).filter(a => a.rarity === rarity)
}
