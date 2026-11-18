// '2026-11-04' → '4 ноября 2026 г.' (UTC, чтобы сервер и браузер выводили одинаково)
export const formatDate = (date: string) =>
	new Date(date).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	});
