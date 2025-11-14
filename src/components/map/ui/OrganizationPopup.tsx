import type { Organization } from '../types/types'

interface OrganizationPopupProps {
	readonly organization: Organization
	readonly onSelect: (organization: Organization) => void
}

export function OrganizationPopup({
	organization,
	onSelect,
}: OrganizationPopupProps) {
	return (
		<div className='popup-content grid max-w-[240px]'>
			<h3 className='m-0 text-base font-bold text-slate-900'>
				{organization.name}
			</h3>
			<p className='m-0 text-sm text-slate-600'>{organization.summary}</p>
			<button
				type='button'
				className='inline-flex items-center justify-center
    gap-2
    px-5 py-3
    rounded-full
    font-semibold
    text-[15px]
    no-underline
    border-none
    cursor-pointer
    transition-all duration-200 ease-in-out
    bg-gradient-to-br from-[#22d3ee] to-[#0284c7]
    text-white
    shadow-[0_14px_28px_rgba(37,99,235,0.26)]
    hover:translate-y-[-1px]
    hover:shadow-[0_18px_36px_rgba(37,99,235,0.32)]'
				onClick={() => onSelect(organization)}
			>
				Подробнее
			</button>
		</div>
	)
}

