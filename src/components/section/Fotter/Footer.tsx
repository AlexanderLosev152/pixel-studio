import Link from 'next/link';

import { SERVICES } from '@/content/services';
import { NICHES } from '@/content/niches';
import { SITE_EMAIL } from '@/config/seo';
import { Logo } from '@/components/ui/Logo/Logo';

export const Footer = () => {
	const columns = [
		{
			title: 'Услуги',
			links: SERVICES.map(({ slug, name }) => ({
				href: `/uslugi/${slug}`,
				text: name
			}))
		},
		{
			title: 'Отрасли',
			links: NICHES.map(({ slug, name }) => ({
				href: `/otrasli/${slug}`,
				text: name
			}))
		},
		{
			title: 'Студия',
			links: [
				{ href: '/raboty', text: 'Работы' },
				{ href: '/blog', text: 'Блог' },
				{ href: '/#cities', text: 'География работы' }
			]
		}
	];

	return (
		<footer className='footer container'>
			<div className='footer__columns' data-reveal-stagger>
				{columns.map(({ title, links }) => (
					<nav className='footer__column' key={title} aria-label={title}>
						<p className='footer__title'>{title}</p>
						<ul>
							{links.map(({ href, text }) => (
								<li key={href}>
									<Link href={href}>{text}</Link>
								</li>
							))}
						</ul>
					</nav>
				))}
			</div>

			<div className='footer__bottom' data-reveal>
				<p>
					© 2026 <Logo />
				</p>
				<a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>
			</div>
		</footer>
	);
};
