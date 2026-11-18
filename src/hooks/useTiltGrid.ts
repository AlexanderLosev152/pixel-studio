import { useEffect, useRef } from 'react';

// Максимальный угол наклона карточки, градусы
const MAX_TILT_X = 6;
const MAX_TILT_Y = 8;
// Насколько изображение смещается за курсором внутри карточки, px
const MAX_SHIFT = 8;

/**
 * Наклоняет карточки с атрибутом data-tilt за курсором.
 * Один набор слушателей на всю сетку + requestAnimationFrame,
 * чтобы не вешать обработчики на каждую карточку.
 */
export const useTiltGrid = <T extends HTMLElement>() => {
	const ref = useRef<T>(null);

	useEffect(() => {
		const grid = ref.current;
		if (!grid) return;

		const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (!finePointer.matches || reducedMotion.matches) return;

		let active: HTMLElement | null = null;
		let frame = 0;

		const update = (card: HTMLElement, clientX: number, clientY: number) => {
			const rect = card.getBoundingClientRect();
			const x = (clientX - rect.left) / rect.width;
			const y = (clientY - rect.top) / rect.height;

			card.style.setProperty('--rotate-x', `${(0.5 - y) * 2 * MAX_TILT_X}deg`);
			card.style.setProperty('--rotate-y', `${(x - 0.5) * 2 * MAX_TILT_Y}deg`);
			card.style.setProperty('--glare-x', `${x * 100}%`);
			card.style.setProperty('--glare-y', `${y * 100}%`);
			card.style.setProperty('--shift-x', `${(x - 0.5) * 2 * MAX_SHIFT}px`);
			card.style.setProperty('--shift-y', `${(y - 0.5) * 2 * MAX_SHIFT}px`);
		};

		const reset = (card: HTMLElement) => {
			card.classList.remove('is-tilting');
			card.style.setProperty('--rotate-x', '0deg');
			card.style.setProperty('--rotate-y', '0deg');
			card.style.setProperty('--glare-x', '50%');
			card.style.setProperty('--glare-y', '50%');
			card.style.setProperty('--shift-x', '0px');
			card.style.setProperty('--shift-y', '0px');
		};

		const onPointerMove = (event: PointerEvent) => {
			if (event.pointerType === 'touch') return;

			const card = (event.target as Element | null)?.closest<HTMLElement>('[data-tilt]');
			if (!card || !grid.contains(card)) return;

			if (card !== active) {
				if (active) reset(active);
				active = card;
				card.classList.add('is-tilting');
			}

			const { clientX, clientY } = event;
			if (frame) cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				frame = 0;
				if (active === card) update(card, clientX, clientY);
			});
		};

		const onPointerOut = (event: PointerEvent) => {
			const card = (event.target as Element | null)?.closest<HTMLElement>('[data-tilt]');
			if (!card || !grid.contains(card)) return;

			const next = event.relatedTarget;
			if (next instanceof Node && card.contains(next)) return;

			reset(card);
			if (active === card) active = null;
		};

		const onPointerLeave = () => {
			if (active) reset(active);
			active = null;
		};

		grid.addEventListener('pointermove', onPointerMove, { passive: true });
		grid.addEventListener('pointerout', onPointerOut, { passive: true });
		grid.addEventListener('pointerleave', onPointerLeave, { passive: true });

		return () => {
			if (frame) cancelAnimationFrame(frame);
			grid.removeEventListener('pointermove', onPointerMove);
			grid.removeEventListener('pointerout', onPointerOut);
			grid.removeEventListener('pointerleave', onPointerLeave);
			if (active) reset(active);
		};
	}, []);

	return ref;
};
