import { memo } from 'react'
import { OrganizationDetails } from './organization/OrganizationDetails'
import { QuestDetails } from './quest/QuestDetails'
import type { Quest } from '../types/quest-types'
import type { Organization } from '../types/types'

interface MapDetailsProps {
	selectedQuest?: Quest
	selectedOrganization?: Organization
	isClosing: boolean
	onClose: () => void
	onParticipate?: (questId: string) => void
}

export const MapDetails = memo(function MapDetails({
	selectedQuest,
	selectedOrganization,
	isClosing,
	onClose,
	onParticipate,
}: MapDetailsProps) {
	return (
		<>
			{selectedQuest && (
				<QuestDetails
					quest={selectedQuest}
					onClose={onClose}
					isClosing={isClosing}
					onParticipate={onParticipate}
				/>
			)}

			{selectedOrganization && (
				<OrganizationDetails
					organization={selectedOrganization}
					onClose={onClose}
					isClosing={isClosing}
				/>
			)}
		</>
	)
})

