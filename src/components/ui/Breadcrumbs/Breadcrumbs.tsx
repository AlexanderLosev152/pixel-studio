import Link from 'next/link';

import { Crumb } from '@/config/jsonLd';

type BreadcrumbsProps = {
	items: Crumb[];
};

// Последний элемент — текущая страница, выводится без ссылки
export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
	const crumbs = [{ name: 'Главная', path: '/' }, ...items];

	return (
		<nav className='breadcrumbs' aria-label='Хлебные крошки'>
			<ol className='breadcrumbs__list'>
				{crumbs.map(({ name, path }, index) => (
					<li className='breadcrumbs__item' key={path}>
						{index < crumbs.length - 1 ? (
							<Link href={path}>{name}</Link>
						) : (
							<span aria-current='page'>{name}</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
};
