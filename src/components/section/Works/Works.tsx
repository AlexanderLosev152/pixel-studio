import { useEffect, useRef, type CSSProperties } from 'react';

import { SectionText } from '@/components/ui/SectionText/SectionText';

const pad = (value: number) => String(value).padStart(2, '0');

export const Works = () => {
	const worksItems = [
		{
			id: 1,
			span: 'День 1',
			title: 'Бриф',
			descr:
				'Обсуждаем задачу, аудиторию и бюджет. Фиксируем цену и сроки в договоре.'
		},
		{
			id: 2,
			span: 'Дни 2–4',
			title: 'Прототип и дизайн',
			descr: 'Показываем структуру и макеты. Вносим правки до утверждения.'
		},
		{
			id: 3,
			span: 'Дни 5–9',
			title: 'Разработка',
			descr:
				'Верстаем, подключаем формы, оплату и аналитику. Проверяем на разных устройствах.'
		},
		{
			id: 4,
			span: 'День 10',
			title: 'Запуск',
			descr:
				'Публикуем сайт, обучаем работать с ним и 30 дней поддерживаем бесплатно.'
		}
	];

	const listRef = useRef<HTMLOListElement>(null);

	// Линия таймлайна заполняется по мере прокрутки, этапы загораются,
	// когда она до них доходит. Пишем прямо в DOM — без лишних рендеров.
	useEffect(() => {
		const list = listRef.current;
		if (!list) return;

		const items = Array.from(list.children) as HTMLElement[];
		let thresholds: number[] = items.map(() => 0);
		let horizontal = true;
		let trackLength = 1;
		let frame = 0;

		// Длина линии и пороги этапов — по реальным позициям точек:
		// на десктопе этапы в ряд, на мобильных столбиком разной высоты
		const measure = () => {
			if (!items.length) return;
			const first = items[0];
			const last = items[items.length - 1];
			horizontal = first.offsetTop === last.offsetTop;
			const pos = (item: HTMLElement) => (horizontal ? item.offsetLeft : item.offsetTop);
			trackLength = Math.max(1, pos(last) - pos(first));

			list.style.setProperty('--track', `${trackLength}px`);
			thresholds = items.map((item) => (pos(item) - pos(first)) / trackLength);
		};

		const apply = (progress: number) => {
			list.style.setProperty('--progress', progress.toFixed(4));
			items.forEach((item, index) => {
				item.classList.toggle('is-active', progress >= thresholds[index] - 0.001);
			});
		};

		measure();

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			apply(1);
			return;
		}

		const update = () => {
			frame = 0;
			const top = list.getBoundingClientRect().top;
			const vh = window.innerHeight;
			// В ряд: заполняем, пока верх списка идёт от 85% до 40% экрана.
			// Столбиком: линия следует за «уровнем чтения» на 65% экрана.
			const raw = horizontal
				? (vh * 0.85 - top) / (vh * 0.45)
				: (vh * 0.65 - top) / trackLength;
			const progress = Math.min(1, Math.max(0, raw));
			apply(progress);
		};

		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		const onResize = () => {
			measure();
			onScroll();
		};

		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize);

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
		};
	}, []);

	return (
		<section className='works section container' id='process'>
			<SectionText
				className='works__text'
				title='Этапы разработки сайта'
				descr='Четыре шага от заявки до запуска. На каждом вы видите результат.'
				splitTitle
			/>

			<ol
				ref={listRef}
				className='works__items'
				data-reveal-stagger
				style={{ '--steps': worksItems.length } as CSSProperties}>
				{worksItems.map(({ id, span, title, descr }, index) => (
					<li key={id} className='works__item'>
						<span className='works__num' aria-hidden='true'>
							{pad(index + 1)}
						</span>
						<span className='works__day'>{span}</span>
						<h3>{title}</h3>
						<p>{descr}</p>
					</li>
				))}
			</ol>
		</section>
	);
};
