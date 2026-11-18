import type { GetStaticPaths, GetStaticProps } from 'next';

import { Seo } from '@/components/seo/Seo';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHero } from '@/components/section/PageHero/PageHero';
import { Faq } from '@/components/section/Faq/Faq';
import { SectionText } from '@/components/ui/SectionText/SectionText';
import { Content } from '@/components/ui/Content/Content';
import { Cards } from '@/components/ui/Cards/Cards';
import { CasesGrid } from '@/components/ui/CasesGrid/CasesGrid';
import { CASES } from '@/content/cases';
import { Btn } from '@/components/ui/Btn/Btn';
import { NICHES } from '@/content/niches';
import { SERVICES } from '@/content/services';
import type { Niche } from '@/content/types';
import { breadcrumbsJsonLd, faqJsonLd, organizationJsonLd } from '@/config/jsonLd';

type NichePageProps = {
	niche: Niche;
};

export default function NichePage({ niche }: NichePageProps) {
	const path = `/otrasli/${niche.slug}`;
	const crumbs = [
		{ name: 'Отрасли', path: '/otrasli' },
		{ name: niche.name, path }
	];
	const services = SERVICES.filter(({ slug }) => niche.services.includes(slug));
	const others = NICHES.filter(({ slug }) => slug !== niche.slug);

	const cases = CASES.filter((item) => item.niche === niche.slug).slice(0, 3);

	return (
		<>
			<Seo
				title={niche.title}
				description={niche.description}
				path={path}
				keywords={niche.keywords}
				jsonLd={[organizationJsonLd(), breadcrumbsJsonLd(crumbs), faqJsonLd(niche.faq)]}
			/>

			<PageLayout>
				<PageHero crumbs={crumbs} title={niche.h1} lead={niche.lead}>
					<Btn href='#contacts'>Обсудить проект</Btn>
				</PageHero>

				<section className='section container'>
					<SectionText
						className='page-list__text'
						title='Что должно быть на сайте'
						descr='Функции, без которых сайт в этой сфере теряет клиентов.'
					/>
					<ul className='page-list' data-reveal-stagger>
						{niche.features.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</section>

				<section className='section container'>
					<Content blocks={niche.content} />
				</section>

				{cases.length > 0 && (
					<section className='portfolio section container'>
						<SectionText
							className='page-list__text'
							title='Примеры работ'
							descr='Проекты, которые мы уже сделали в этом формате.'
						/>
						<CasesGrid items={cases} />
					</section>
				)}

				<section className='section container'>
					<SectionText
						className='page-list__text'
						title='Подходящие форматы'
						descr='С чего лучше начать — зависит от задачи и бюджета.'
					/>
					<Cards
						items={services.map(({ slug, name, short, price }) => ({
							href: `/uslugi/${slug}`,
							title: name,
							text: short,
							meta: price
						}))}
					/>
				</section>

				<Faq items={niche.faq} descr='Что обычно спрашивают перед запуском сайта в этой сфере.' />

				<section className='section container'>
					<SectionText
						className='page-list__text'
						title='Другие отрасли'
						descr='Делаем сайты для бизнеса в разных сферах.'
					/>
					<Cards
						items={others.map(({ slug, name, short }) => ({
							href: `/otrasli/${slug}`,
							title: name,
							text: short
						}))}
					/>
				</section>
			</PageLayout>
		</>
	);
}

export const getStaticPaths: GetStaticPaths = () => ({
	paths: NICHES.map(({ slug }) => ({ params: { slug } })),
	fallback: false
});

export const getStaticProps: GetStaticProps<NichePageProps> = ({ params }) => {
	const niche = NICHES.find(({ slug }) => slug === params?.slug);

	if (!niche) return { notFound: true };

	return { props: { niche } };
};
