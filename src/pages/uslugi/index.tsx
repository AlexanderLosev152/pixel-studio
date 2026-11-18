import { Seo } from '@/components/seo/Seo';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHero } from '@/components/section/PageHero/PageHero';
import { Cards } from '@/components/ui/Cards/Cards';
import { SERVICES } from '@/content/services';
import { breadcrumbsJsonLd, organizationJsonLd } from '@/config/jsonLd';

const crumbs = [{ name: 'Услуги', path: '/uslugi' }];

export default function ServicesPage() {
	return (
		<>
			<Seo
				title='Услуги веб-студии: разработка сайтов под ключ | Веб-студия'
				description='Лендинги, сайты-визитки, корпоративные сайты и интернет-магазины под ключ. Редизайн, SEO-продвижение и поддержка сайтов. Лендинг — от 30 000 ₽ за 7 дней.'
				path='/uslugi'
				jsonLd={[organizationJsonLd(), breadcrumbsJsonLd(crumbs)]}
			/>

			<PageLayout>
				<PageHero
					crumbs={crumbs}
					title='Услуги веб-студии'
					lead='Создаём сайты с нуля, дорабатываем и продвигаем уже работающие. Выберите услугу — расскажем, что входит, сколько стоит и сколько займёт.'
				/>

				<section className='section container'>
					<Cards
						items={SERVICES.map(({ slug, name, short, price }) => ({
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
