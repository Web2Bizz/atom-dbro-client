// Динамическая загрузка CSS для Leaflet (только когда нужна карта)
let stylesLoaded = false

export function loadLeafletStyles() {
	if (stylesLoaded) return

	// Загружаем основной CSS Leaflet
	const link = document.createElement('link')
	link.rel = 'stylesheet'
	link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
	link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
	link.crossOrigin = ''
	document.head.appendChild(link)

	// Загружаем CSS для Leaflet и плагинов
	void import(
		'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
	)
	void import('leaflet.markercluster/dist/MarkerCluster.css')
	void import('leaflet.markercluster/dist/MarkerCluster.Default.css')
	void import('react-leaflet-cluster/dist/assets/MarkerCluster.css')
	void import('react-leaflet-cluster/dist/assets/MarkerCluster.Default.css')

	// Инициализируем leaflet-defaulticon-compatibility
	void import('leaflet-defaulticon-compatibility')

	stylesLoaded = true
}
