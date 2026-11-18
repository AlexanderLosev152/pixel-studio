import { Seo } from '@/components/seo/Seo';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHero } from '@/components/section/PageHero/PageHero';
import { Cards } from '@/components/ui/Cards/Cards';
import { ARTICLES } from '@/content/articles';
import { breadcrumbsJsonLd, organizationJsonLd } from '@/config/jsonLd';
import { formatDate } from '@/utils/formatDate';

const crumbs = [{ name: 'Блог', path: '/blog' }];

export default function BlogPage() {
	return (
		<>
			<Seo
				title='Блог о разработке сайтов: цены, сроки, этапы | Веб-студия'
				description='Полезные статьи для тех, кто планирует заказать сайт: сколько стоит разработка, чем лендинг отличается от сайта, как составить ТЗ и выбрать веб-студию.'
				path='/blog'
				jsonLd={[organizationJsonLd(), breadcrumbsJsonLd(crumbs)]}
			/>

			<PageLayout>
				<PageHero
					crumbs={crumbs}
					title='Блог о разработке сайтов'
					lead='Простыми словами о том, как заказать сайт, сколько это стоит и на что обратить внимание, чтобы сайт приносил клиентов.'
				/>

				<section className='section container'>
					<Cards
						items={ARTICLES.map(({ slug, h1, short }) => ({
							href: `/blog/${slug}`,
							title: h1,
							text: short
						}))}
					/>
				</section>
			</PageLayout>
		</>
	);
}
