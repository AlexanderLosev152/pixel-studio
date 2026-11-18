import { useEffect, useRef } from 'react';

type CountUpProps = {
	/** Итоговая строка, например «от 30 000 ₽» — анимируется только число внутри */
	value: string;
	/** С какого значения прокручивать (строка в том же формате) */
	from?: string;
	/** Запуск анимации: при переходе в true число прокручивается from → value */
	play: boolean;
	duration?: number;
};

const NUMBER_RE = /\d[\d\s ]*\d|\d/;

const parse = (text?: string) => {
	const match = text?.match(NUMBER_RE);
	return match ? Number(match[0].replace(/\D/g, '')) : null;
};

const format = (template: string, value: number) =>
	template.replace(NUMBER_RE, Math.round(value).toLocaleString('ru-RU'));

/**
 * Прокручивает число внутри строки. На сервере и без JS
 * сразу выводится итоговое значение.
 */
export const CountUp = ({ value, from, play, duration = 700 }: CountUpProps) => {
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const node = ref.current;
		const end = parse(value);
		const start = parse(from);
		if (!node || !play || end === null || start === null || start === end) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let frame = 0;
		const startedAt = performance.now();

		const tick = (now: number) => {
			const t = Math.min(1, (now - startedAt) / duration);
			const eased = 1 - Math.pow(1 - t, 3);
			node.textContent = format(value, start + (end - start) * eased);
			if (t < 1) frame = requestAnimationFrame(tick);
		};

		node.textContent = format(value, start);
		frame = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frame);
			node.textContent = value;
		};
	}, [value, from, play, duration]);

	return <span ref={ref}>{value}</span>;
};
