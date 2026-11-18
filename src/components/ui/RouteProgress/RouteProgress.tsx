import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

/**
 * Тонкая полоса сверху при переходе между страницами.
 * Ползёт к ~90%, пока грузится страница, затем добегает и гаснет.
 */
export const RouteProgress = () => {
	const router = useRouter();
	const barRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const bar = barRef.current;
		if (!bar) return;

		let value = 0;
		let timer = 0;
		let hideTimer = 0;

		const set = (next: number) => {
			value = next;
			bar.style.transform = `scaleX(${value})`;
		};

		const start = (url: string, { shallow }: { shallow: boolean }) => {
			if (shallow) return;
			window.clearTimeout(hideTimer);
			window.clearInterval(timer);
			bar.classList.add('is-active');
			set(0.08);
			timer = window.setInterval(() => set(value + (0.9 - value) * 0.1), 120);
		};

		const done = () => {
			if (!bar.classList.contains('is-active')) return;
			window.clearInterval(timer);
			set(1);
			hideTimer = window.setTimeout(() => {
				bar.classList.remove('is-active');
				hideTimer = window.setTimeout(() => set(0), 300);
			}, 250);
		};

		router.events.on('routeChangeStart', start);
		router.events.on('routeChangeComplete', done);
		router.events.on('routeChangeError', done);

		return () => {
			window.clearInterval(timer);
			window.clearTimeout(hideTimer);
			router.events.off('routeChangeStart', start);
			router.events.off('routeChangeComplete', done);
			router.events.off('routeChangeError', done);
		};
	}, [router.events]);

	return <div ref={barRef} className='route-progress' aria-hidden='true' />;
};
