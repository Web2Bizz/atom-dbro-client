// Динамическая загрузка CSS для Leaflet (только когда нужна карта)
let stylesLoaded = false

export function loadLeafletStyles() {
	if (stylesLoaded) return

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
