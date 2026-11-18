import type { GetStaticPaths, GetStaticProps } from 'next';

import { Seo } from '@/components/seo/Seo';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHero } from '@/components/section/PageHero/PageHero';
import { Works } from '@/components/section/Works/Works';
import { Faq } from '@/components/section/Faq/Faq';
import { SectionText } from '@/components/ui/SectionText/SectionText';
import { Content } from '@/components/ui/Content/Content';
import { Cards } from '@/components/ui/Cards/Cards';
import { CasesGrid } from '@/components/ui/CasesGrid/CasesGrid';
import { CASES } from '@/content/cases';
import { Btn } from '@/components/ui/Btn/Btn';
import { SERVICES } from '@/content/services';
import type { Service } from '@/content/types';
import { breadcrumbsJsonLd, faqJsonLd, organizationJsonLd, serviceJsonLd } from '@/config/jsonLd';

type ServicePageProps = {
	service: Service;
};

export default function ServicePage({ service }: ServicePageProps) {
	const path = `/uslugi/${service.slug}`;
	const crumbs = [
		{ name: 'Услуги', path: '/uslugi' },
		{ name: service.name, path }
	];
	const others = SERVICES.filter(({ slug }) => slug !== service.slug);

	const cases = CASES.filter((item) => item.service === service.slug).slice(0, 3);

	return (
		<>
			<Seo
				title={service.title}
				description={service.description}
				path={path}
				keywords={service.keywords}
				jsonLd={[
					organizationJsonLd(),
					serviceJsonLd(service, path),
					breadcrumbsJsonLd(crumbs),
					faqJsonLd(service.faq)
				]}
			/>

			<PageLayout>
				<PageHero crumbs={crumbs} title={service.h1} lead={service.lead}>
					<div className='page-hero__info'>
						<div>
							<span>Стоимость</span>
							<strong>{service.price}</strong>
						</div>
						<div>
							<span>Срок</span>
							<strong>{service.deadline}</strong>
						</div>
						<Btn href='#contacts'>Обсудить проект</Btn>
					</div>
				</PageHero>

				<section className='section container'>
					<SectionText
						className='page-list__text'
						title='Что входит'
						descr='Всё необходимое, чтобы сайт начал работать на ваш бизнес.'
					/>
					<ul className='page-list' data-reveal-stagger>
						{service.includes.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</section>

				<section className='section container'>
					<Content blocks={service.content} />
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

				<Works />
				<Faq items={service.faq} descr={`Отвечаем на вопросы об услуге «${service.name}».`} />

				<section className='section container'>
					<SectionText
						className='page-list__text'
						title='Другие услуги'
						descr='Поможем на любом этапе — от первого сайта до продвижения и поддержки.'
					/>
					<Cards
						items={others.map(({ slug, name, short, price }) => ({
							href: `/uslugi/${slug}`,
							title: name,
							text: short,
							meta: price
						}))}
					/>
				</section>
			</PageLayout>
		</>
	);
}

export const getStaticPaths: GetStaticPaths = () => ({
	paths: SERVICES.map(({ slug }) => ({ params: { slug } })),
	fallback: false
});

export const getStaticProps: GetStaticProps<ServicePageProps> = ({ params }) => {
	const service = SERVICES.find(({ slug }) => slug === params?.slug);

	if (!service) return { notFound: true };

	return { props: { service } };
};
