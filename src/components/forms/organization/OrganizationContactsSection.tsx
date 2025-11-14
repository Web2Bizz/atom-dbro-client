import { Input } from '@/components/ui/input'

interface OrganizationContactsSectionProps {
	phone: string
	email: string
	website: string
	onChange: (
		field: 'phone' | 'email' | 'website',
		value: string
	) => void
}

export function OrganizationContactsSection({
	phone,
	email,
	website,
	onChange,
}: OrganizationContactsSectionProps) {
	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
			<div>
				<label
					htmlFor='org-phone'
					className='block text-sm font-medium text-slate-700 mb-2'
				>
					Телефон *
				</label>
				<Input
					id='org-phone'
					type='tel'
					value={phone}
					onChange={e => onChange('phone', e.target.value)}
					required
					placeholder='+7 (XXX) XXX-XX-XX'
				/>
			</div>

			<div>
				<label
					htmlFor='org-email'
					className='block text-sm font-medium text-slate-700 mb-2'
				>
					Email
				</label>
				<Input
					id='org-email'
					type='email'
					value={email}
					onChange={e => onChange('email', e.target.value)}
					placeholder='email@example.com'
				/>
			</div>

			<div>
				<label
					htmlFor='org-website'
					className='block text-sm font-medium text-slate-700 mb-2'
				>
					Сайт
				</label>
				<Input
					id='org-website'
					type='url'
					value={website}
					onChange={e => onChange('website', e.target.value)}
					placeholder='https://example.com'
				/>
			</div>
		</div>
	)
}

