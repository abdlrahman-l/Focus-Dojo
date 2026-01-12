const formatTime = (h: string, m: string, s: string, text: boolean = true) => {
	if (h !== '00') {
		return `${h}${text ? ' jam ' : ':'}${m}${text ? ' menit ' : ':'}${s}${text ? ' detik ' : ''}`;
	} else if (m !== '00') {
		return `${m}${text ? ' menit ' : ':'}${s}${text ? ' detik ' : ''}`;
	} else {
		return `${s}${text ? ' detik ' : ''}`;
	}
};

export const timeToText = (e: number, text: boolean = true) => {
	const h = Math.floor(e / 3600)
			.toString()
			.padStart(2, '0'),
		m = Math.floor((e % 3600) / 60)
			.toString()
			.padStart(2, '0'),
		s = Math.floor(e % 60)
			.toString()
			.padStart(2, '0');

	return formatTime(h, m, s, text);
};

export const timeToTextFormatted = (h: string, m: string, s: string, text: boolean = true) => {
	return formatTime(h, m, s, text);
};
