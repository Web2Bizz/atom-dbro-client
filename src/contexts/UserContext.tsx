import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { User } from '@/types/user'
import type { ReactNode } from 'react'
import { createContext, useMemo } from 'react'

interface UserContextType {
	user: User | null
	setUser: (user: User | null) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: Readonly<{ children: ReactNode }>) {
	const [user, setUser] = useLocalStorage<User | null>('ecoquest_user', null)

	const value = useMemo(
		() => ({
			user,
			setUser,
		}),
		[user, setUser]
	)

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
