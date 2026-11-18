import { useEffect } from 'react';
import Lenis from 'lenis';

import { PRELOADER_DONE_EVENT } from '@/components/ui/Preloader/Preloader';

/**
 * Включает инерционную прокрутку и плавные переходы по якорям.
 * При prefers-reduced-motion остаётся обычная нативная прокрутка.
 */
export const useSmoothScroll = () => {
	useEffect(() => {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		let instance: Lenis | null = null;

		// Перехватываем якоря раньше Next.js: при активном Lenis
		// нативный переход был бы мгновенным (scroll-behavior: auto).
		const onClick = (event: MouseEvent) => {
			if (event.defaultPrevented || event.button !== 0) return;
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

			const target = event.target;
			if (!(target instanceof Element)) return;

			const link = target.closest<HTMLAnchorElement>('a[href]');
			if (!link) return;

			const url = new URL(link.href, window.location.href);
			if (
				url.origin !== window.location.origin ||
				url.pathname !== window.location.pathname ||
				!url.hash
			) {
				return;
			}

			let node: HTMLElement | null = null;
			try {
				node = document.getElementById(decodeURIComponent(url.hash.slice(1)));
			} catch {
				node = null;
			}
			if (!node) return;

			event.preventDefault();
			event.stopPropagation();

			instance?.scrollTo(node, { offset: 0 });
			window.history.pushState(null, '', url.hash);
		};

		const start = () => {
			if (instance || reducedMotion.matches) return;

			instance = new Lenis({
				autoRaf: true,
				stopInertiaOnNavigate: true,
				smoothWheel: true,
				syncTouch: false
			});

			// Пока висит прелоадер — прокрутка заблокирована
			if (document.documentElement.classList.contains('is-loading')) instance.stop();

			document.addEventListener('click', onClick, true);
		};

		const onPreloaderDone = () => instance?.start();

		const stop = () => {
			if (!instance) return;

			document.removeEventListener('click', onClick, true);
			instance.destroy();
			instance = null;
		};

		const sync = () => {
			if (reducedMotion.matches) {
				stop();
			} else {
				start();
			}
		};

		sync();
		reducedMotion.addEventListener('change', sync);
		window.addEventListener(PRELOADER_DONE_EVENT, onPreloaderDone);

		return () => {
			reducedMotion.removeEventListener('change', sync);
			window.removeEventListener(PRELOADER_DONE_EVENT, onPreloaderDone);
			stop();
		};
	}, []);
};
