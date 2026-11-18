import { ReactNode } from 'react';

import { Crumb } from '@/config/jsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs/Breadcrumbs';

type PageHeroProps = {
	crumbs: Crumb[];
	title: string;
	lead: string;
	children?: ReactNode;
};

export const PageHero = ({ crumbs, title, lead, children }: PageHeroProps) => {
	return (
		<section className='page-hero container'>
			<Breadcrumbs items={crumbs} />
			<h1 className='page-hero__title'>{title}</h1>
			<p className='page-hero__lead'>{lead}</p>
			{children}
		</section>
	);
};
