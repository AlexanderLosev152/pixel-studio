import { Seo } from '@/components/seo/Seo';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHero } from '@/components/section/PageHero/PageHero';
import { Cards } from '@/components/ui/Cards/Cards';
import { NICHES } from '@/content/niches';
import { breadcrumbsJsonLd, organizationJsonLd } from '@/config/jsonLd';

const crumbs = [{ name: 'Отрасли', path: '/otrasli' }];

export default function NichesPage() {
	return (
		<>
			<Seo
				title='Сайты для бизнеса под ключ: клиники, рестораны, стройка | Веб-студия'
				description='Делаем сайты под задачи вашей отрасли: стоматологии и клиники, строительные компании, рестораны, автосервисы, юристы, недвижимость, онлайн-школы и производство.'
				path='/otrasli'
				jsonLd={[organizationJsonLd(), breadcrumbsJsonLd(crumbs)]}
			/>

			<PageLayout>
				<PageHero
					crumbs={crumbs}
					title='Сайты для бизнеса'
					lead='У каждой отрасли свои клиенты и свои вопросы. Мы знаем, какие блоки и функции нужны сайту, чтобы он приводил заявки именно в вашей сфере.'
				/>

				<section className='section container'>
					<Cards
						items={NICHES.map(({ slug, name, short }) => ({
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
