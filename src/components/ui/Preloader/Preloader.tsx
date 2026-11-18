import { useEffect, useRef, useState } from 'react';

import { ParticleMorph } from '@/components/ui/ParticleMorph/ParticleMorph';

export const PRELOADER_DONE_EVENT = 'preloader:done';
export const PRELOADER_STORAGE_KEY = 'px-preloaded';

const WORDS = ['Идея', 'Дизайн', 'Код', 'Запуск'];
// Даже при мгновенной загрузке прелоадер не должен «моргать»
const MIN_DURATION = 1400;
// Если что-то зависло — всё равно открываем сайт
const MAX_DURATION = 6000;
const EXIT_DURATION = 1100;

type Phase = 'loading' | 'leaving' | 'done';

/**
 * Экран предзагрузки: считает реальную загрузку (шрифты, картинки
 * первого экрана, событие load), плавно докручивает счётчик до 100
 * и уезжает вверх. Показывается один раз за сессию — повторные
 * визиты отсекает инлайн-скрипт в _document (класс is-loaded).
 */
export const Preloader = () => {
	const [phase, setPhase] = useState<Phase>('loading');
	const [wordIndex, setWordIndex] = useState(0);
	const countRef = useRef<HTMLSpanElement>(null);
	const barRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const root = document.documentElement;
		// Повторный визит / reduced-motion: разметку и так скрывает CSS
		if (!root.classList.contains('is-loading')) return;

		const startedAt = performance.now();
		let target = 0.1;
		let shown = 0;
		let frame = 0;
		let finished = false;
		let exitTimer = 0;

		// --- Источники прогресса ---
		const tasks: Promise<unknown>[] = [];

		if (document.fonts?.ready) tasks.push(document.fonts.ready);

		Array.from(document.images)
			.filter((img) => img.loading !== 'lazy' && !img.complete)
			.forEach((img) => {
				tasks.push(
					new Promise<void>((resolve) => {
						img.addEventListener('load', () => resolve(), { once: true });
						img.addEventListener('error', () => resolve(), { once: true });
					})
				);
			});

		tasks.push(
			document.readyState === 'complete'
				? Promise.resolve()
				: new Promise<void>((resolve) =>
						window.addEventListener('load', () => resolve(), { once: true })
					)
		);

		let settled = 0;
		tasks.forEach((task) =>
			task.finally(() => {
				settled += 1;
				target = Math.max(target, settled / tasks.length);
			})
		);

		const finish = () => {
			if (finished) return;
			finished = true;

			try {
				sessionStorage.setItem(PRELOADER_STORAGE_KEY, '1');
			} catch {
				/* приватный режим — просто покажем ещё раз */
			}

			setPhase('leaving');
			root.classList.remove('is-loading');
			root.classList.add('is-loaded', 'with-intro');
			window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));

			exitTimer = window.setTimeout(() => setPhase('done'), EXIT_DURATION);
		};

		const tick = (now: number) => {
			const elapsed = now - startedAt;
			if (elapsed > MAX_DURATION) target = 1;

			// Не даём счётчику дойти до 100, пока не прошло минимальное время
			const timeCap = Math.min(1, elapsed / MIN_DURATION);
			const goal = Math.min(target, timeCap);
			shown += (goal - shown) * 0.08;
			if (goal - shown < 0.002) shown = goal;

			const percent = Math.round(shown * 100);
			if (countRef.current) countRef.current.textContent = String(percent).padStart(3, '0');
			if (barRef.current) barRef.current.style.transform = `scaleX(${shown})`;

			setWordIndex(Math.min(WORDS.length - 1, Math.floor(shown * WORDS.length)));

			if (shown >= 1) {
				finish();
				return;
			}
			frame = requestAnimationFrame(tick);
		};

		frame = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frame);
			window.clearTimeout(exitTimer);
		};
	}, []);

	if (phase === 'done') return null;

	return (
		<div
			className={`preloader${phase === 'leaving' ? ' preloader--leaving' : ''}`}
			aria-hidden='true'
		>
			<ParticleMorph className='preloader__morph' shape={wordIndex} offsetX={0.24} scale={0.9} />

			<div className='preloader__inner container'>
				<span className='preloader__brand'>Пиксель Студио</span>

				<div className='preloader__words'>
					<span key={wordIndex} className='preloader__word'>
						{WORDS[wordIndex]}
					</span>
				</div>

				<div className='preloader__bottom'>
					<span>Загрузка</span>
					<span className='preloader__count'>
						<span ref={countRef}>000</span>%
					</span>
				</div>
			</div>

			<div className='preloader__bar'>
				<i ref={barRef} />
			</div>
		</div>
	);
};
