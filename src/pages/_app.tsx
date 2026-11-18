import 'lenis/dist/lenis.css';
import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { Preloader } from '@/components/ui/Preloader/Preloader';
import { RouteProgress } from '@/components/ui/RouteProgress/RouteProgress';
import { useReveal } from '@/hooks/useReveal';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();
	useSmoothScroll();
	useReveal(router.asPath);

	return (
		<>
			<Preloader />
			<RouteProgress />
			<Component {...pageProps} />
		</>
	);
}
