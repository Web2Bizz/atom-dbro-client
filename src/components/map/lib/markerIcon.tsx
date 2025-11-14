import L from 'leaflet'

const typeIcons: Record<string, string> = {
	'Помощь животным': '🐾',
	'Помощь пожилым': '🤝',
	'Помощь детям': '🎈',
	'Поддержка людей с ОВЗ': '🧩',
	Экология: '🌿',
	Спорт: '🏅',
	Культура: '🎭',
	Образование: '📚',
}

export function getMarkerIcon(type: string) {
	const emoji = typeIcons[type] || '📍'
	return L.divIcon({
		html: `<div class="relative width-11 height-11 rotate-[-45deg]"><div class="w-11 h-11
    rounded-[50%_50%_50%_0]
    bg-[#63a5db]
    border-3 border-white
    shadow-[0_4px_16px_rgba(252,61,33,0.4),0_2px_8px_rgba(0,0,0,0.2)]
    grid place-items-center
    text-lg
    rotate-45
    transition-all duration-200 ease-in-out
    cursor-pointer
    relative
    z-10 hover:rotate-45 hover:scale-115
    hover:shadow-[0_6px_20px_rgba(252,61,33,0.5),0_3px_10px_rgba(0,0,0,0.3)]">${emoji}</div></div>`,
		className: 'bg-transparent border-none',
		iconSize: [44, 44],
		iconAnchor: [22, 44],
		popupAnchor: [0, -44],
	})
}
