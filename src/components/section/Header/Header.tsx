'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Btn } from '@/components/ui/Btn/Btn';
import { Logo } from '@/components/ui/Logo/Logo';

export const Header = () => {
	const pathname = usePathname();

	const menuItems = [
		{ href: '/uslugi', text: 'Услуги' },
		{ href: '/otrasli', text: 'Отрасли' },
		{ href: '/raboty', text: 'Работы' },
		{ href: '/blog', text: 'Блог' }
	];

	return (
		<header className='header'>
			<div className='header__wrapper container'>
				<Logo />

				<nav>
					<ul className='header__menu'>
						{menuItems.map(({ href, text }) => (
							<li key={href}>
								<Link
									href={href}
									className={pathname === href ? 'is-active' : undefined}
									aria-current={pathname === href ? 'page' : undefined}
								>
									{text}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<Btn className={'header__btn'} href={'#contacts'}>
					Обсудить проект
				</Btn>
			</div>
		</header>
	);
};
