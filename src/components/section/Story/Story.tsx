import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { ParticleMorph } from '@/components/ui/ParticleMorph/ParticleMorph';

// Принципы работы — этапы по дням описаны ниже, в блоке «Этапы разработки»
const STEPS = [
	{
		word: 'Честно',
		label: 'Цена',
		text: 'Цену и сроки фиксируем в договоре до старта. Никаких «а это за отдельные деньги» по ходу работы.'
	},
	{
		word: 'Быстро',
		label: 'Сроки',
		text: 'Лендинг — от 7 дней, визитка — от 10. Не растягиваем проект на месяцы.'
	},
	{
		word: 'Прозрачно',
		label: 'Процесс',
		text: 'На каждом этапе показываем результат: прототип, макеты, рабочую версию. Правки — до утверждения.'
	},
	{
		word: 'Надёжно',
		label: 'Поддержка',
		text: 'После запуска 30 дней сопровождаем бесплатно: поправим, подскажем, обучим работать с сайтом.'
	}
];

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Закреплённый экран: при прокрутке слова сменяют друг друга,
 * а 3D-облако частиц перетекает в соответствующую фигуру.
 * Высота секции = число шагов × высота экрана.
 */
export const Story = () => {
	const sectionRef = useRef<HTMLElement>(null);
	const timelineRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;

		let frame = 0;

		const update = () => {
			frame = 0;
			const rect = section.getBoundingClientRect();
			const distance = section.offsetHeight - window.innerHeight;
			const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, distance)));

			// Шаг i становится активным при progress = i / n — ровно тогда
			// линия должна дойти до i-й точки (позиция i / (n - 1))
			const fill = Math.min(1, (progress * STEPS.length) / (STEPS.length - 1));
			timelineRef.current?.style.setProperty('--fill', fill.toFixed(4));
			setActive(Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length)));
		};

		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	}, []);

	return (
		<section
			ref={sectionRef}
			className='story'
			style={{ '--steps': STEPS.length } as CSSProperties}
			aria-labelledby='story-title'
		>
			<div className='story__sticky'>
				<ParticleMorph className='story__morph' shape={active} offsetX={0.22} />

				<div className='story__inner container'>
					<div className='story__top'>
						<h2 id='story-title' className='story__title'>
							Как мы работаем
						</h2>
						<span className='story__counter'>
							{pad(active + 1)} / {pad(STEPS.length)}
						</span>
					</div>

					<ol className='story__steps'>
						{STEPS.map(({ word, text }, index) => (
							<li
								key={word}
								className={`story__step${index === active ? ' is-active' : ''}${index < active ? ' is-past' : ''}`}
								aria-current={index === active ? 'step' : undefined}
							>
								<span className='story__num' aria-hidden='true'>
									{pad(index + 1)}
								</span>
								<span className='story__word'>
									<span>
										{word}
										<i>.</i>
									</span>
								</span>
								<p className='story__text'>{text}</p>
							</li>
						))}
					</ol>

					<div ref={timelineRef} className='story__timeline' aria-hidden='true'>
						{STEPS.map(({ label }, index) => (
							<div
								key={label}
								className={`story__node${index <= active ? ' is-active' : ''}${index === active ? ' is-current' : ''}`}>
								<span className='story__node-num'>{pad(index + 1)}</span>
								<span className='story__node-label'>{label}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
