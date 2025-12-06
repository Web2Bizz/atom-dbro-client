import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'w2b-vite-filebased-routing/react'
import { Spinner } from './components'
import './index.css'

// Leaflet CSS загружаем динамически только когда нужен (на странице карты)
// import 'leaflet/dist/leaflet.css' - перенесено в компонент карты

ReactDOM.createRoot(document.getElementById('root')!).render(
	<RouterProvider preloader={<Spinner />} />
)
