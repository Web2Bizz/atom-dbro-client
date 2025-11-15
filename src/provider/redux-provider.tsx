import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { setupStore } from '../store/store'

interface ReduxProviderProps {
	readonly children: React.ReactNode
}

export function ReduxProvider({ children }: ReduxProviderProps) {
	const { store, persistor } = setupStore()

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				{children}
			</PersistGate>
		</Provider>
	)
}
