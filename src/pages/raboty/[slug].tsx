import type { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Seo } from '@/components/seo/Seo';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHero } from '@/components/section/PageHero/PageHero';
import { SectionText } from '@/components/ui/SectionText/SectionText';
import { CasesGrid } from '@/components/ui/CasesGrid/CasesGrid';
import { Btn } from '@/components/ui/Btn/Btn';
import { CASES } from '@/content/cases';
import { SERVICES } from '@/content/services';
import { NICHES } from '@/content/niches';
import type { Case } from '@/content/types';
import { SITE_URL } from '@/config/seo';
import { breadcrumbsJsonLd, organizationJsonLd } from '@/config/jsonLd';

type CasePageProps = {
	item: Case;
};

export default function CasePage({ item }: CasePageProps) {
	const path = `/raboty/${item.slug}`;
	const crumbs = [
		{ name: 'Работы', path: '/raboty' },
		{ name: item.title, path }
	];
	const service = SERVICES.find(({ slug }) => slug === item.service);
	const niche = NICHES.find(({ slug }) => slug === item.niche);
	const others = CASES.filter(({ slug }) => slug !== item.slug).slice(0, 3);

	return (
		<>
			<Seo
				title={`${item.title} — ${item.category} | Веб-студия`}
				description={item.short}
				path={path}
				noindex={item.placeholder}
				jsonLd={[
					organizationJsonLd(),
					breadcrumbsJsonLd(crumbs),
					{
						'@context': 'https://schema.org',
						'@type': 'CreativeWork',
						name: item.title,
						description: item.short,
						image: `${SITE_URL}${item.cover}`,
						creator: { '@id': `${SITE_URL}/#organization` }
					}
				]}
			/>

			<PageLayout>
				<PageHero crumbs={crumbs} title={`${item.title}: ${item.category.toLowerCase()}`} lead={item.short} />

				<section className='case section container'>
					<div className='case__screen' tabIndex={0} aria-label='Скриншот сайта, прокрутите, чтобы посмотреть целиком' data-reveal data-lenis-prevent>
						<Image
							className='case__img'
							src={item.img}
							alt={`${item.title} — ${item.category}, скриншот главной страницы`}
							width={1200}
							height={item.imgHeight}
							sizes='(max-width: 1200px) 100vw, 1200px'
							priority
						/>
					</div>

					<div className='case__info content' data-reveal data-reveal-delay='120ms'>
						<h2>Задача</h2>
						<p>{item.task}</p>

						<h2>Что сделали</h2>
						<ul>
							{item.solution.map((text) => (
								<li key={text}>{text}</li>
							))}
						</ul>

						{service && (
							<p>
								Нужен похожий проект? Подробнее об услуге —{' '}
								<Link href={`/uslugi/${service.slug}`}>{service.name.toLowerCase()}</Link>
								{niche && (
									<>
										{' '}
										и о сайтах для отрасли «<Link href={`/otrasli/${niche.slug}`}>{niche.name}</Link>»
									</>
								)}
								.
							</p>
						)}

						<Btn href='#contacts'>Хочу такой же сайт</Btn>
					</div>
				</section>

				<section className='portfolio section container'>
					<SectionText className='page-list__text' title='Другие работы' descr='Ещё проекты из нашего портфолио.' />
					<CasesGrid items={others} />
				</section>
			</PageLayout>
		</>
	);
}

export const getStaticPaths: GetStaticPaths = () => ({
	paths: CASES.map(({ slug }) => ({ params: { slug } })),
	fallback: false
});

export const getStaticProps: GetStaticProps<CasePageProps> = ({ params }) => {
	const item = CASES.find(({ slug }) => slug === params?.slug);

	if (!item) return { notFound: true };

	return { props: { item } };
};
