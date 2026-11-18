import { useEffect } from 'react';

const REVEAL_SELECTOR = '[data-reveal]';
const STAGGER_SELECTOR = '[data-reveal-stagger]';

/**
 * Показывает элементы с data-reveal при попадании во вьюпорт.
 * Дети контейнеров с data-reveal-stagger появляются по очереди.
 * Если анимации отключены или IntersectionObserver недоступен,
 * контент показывается сразу.
 */
export const useReveal = (path: string) => {
	useEffect(() => {
		const revealItems = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
		const staggerGroups = Array.from(document.querySelectorAll<HTMLElement>(STAGGER_SELECTOR));
		const staggerItems: HTMLElement[] = [];

		staggerGroups.forEach((group) => {
			Array.from(group.children).forEach((child, index) => {
				if (!(child instanceof HTMLElement)) return;
				child.style.setProperty('--reveal-index', String(Math.min(index, 5)));
				staggerItems.push(child);
			});
		});

		revealItems.forEach((item) => {
			const delay = item.dataset.revealDelay;
			if (delay) item.style.setProperty('--reveal-delay', delay);
		});

		const targets = Array.from(new Set([...revealItems, ...staggerItems]));
		if (!targets.length) return;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const showAll = () => targets.forEach((target) => target.classList.add('is-revealed'));

		if (reducedMotion.matches || typeof IntersectionObserver === 'undefined') {
			showAll();
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					entry.target.classList.add('is-revealed');
					observer.unobserve(entry.target);
				});
			},
			{ threshold: 0 }
		);

		targets.forEach((target) => {
			if (!target.classList.contains('is-revealed')) observer.observe(target);
		});

		// Клавиатурная навигация не должна уводить фокус в невидимый блок
		const onFocusIn = (event: FocusEvent) => {
			const target = event.target;
			if (!(target instanceof Element)) return;

			const direct = target.closest<HTMLElement>(REVEAL_SELECTOR);
			if (direct) {
				direct.classList.add('is-revealed');
				return;
			}

			const group = target.closest<HTMLElement>(STAGGER_SELECTOR);
			if (!group) return;

			const child = Array.from(group.children).find((item) => item.contains(target));
			child?.classList.add('is-revealed');
		};

		document.addEventListener('focusin', onFocusIn);

		return () => {
			observer.disconnect();
			document.removeEventListener('focusin', onFocusIn);
		};
	}, [path]);
};
