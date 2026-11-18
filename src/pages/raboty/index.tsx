import { Seo } from '@/components/seo/Seo';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHero } from '@/components/section/PageHero/PageHero';
import { CasesGrid } from '@/components/ui/CasesGrid/CasesGrid';
import { CASES } from '@/content/cases';
import { breadcrumbsJsonLd, organizationJsonLd } from '@/config/jsonLd';

const crumbs = [{ name: 'Работы', path: '/raboty' }];

export default function CasesPage() {
	return (
		<>
			<Seo
				title='Портфолио веб-студии: примеры сайтов под ключ | Веб-студия'
				description='Примеры наших работ: лендинги, корпоративные сайты и интернет-магазины. Какие задачи стояли перед клиентами, как мы их решили и что получилось.'
				path='/raboty'
				noindex={CASES.every(({ placeholder }) => placeholder)}
				jsonLd={[organizationJsonLd(), breadcrumbsJsonLd(crumbs)]}
			/>

			<PageLayout>
				<PageHero
					crumbs={crumbs}
					title='Наши работы'
					lead='Каждый проект — отдельная задача клиента. Рассказываем, что нужно было сделать, как мы это решили и что получилось.'
				/>

				<section className='section container'>
					<CasesGrid items={CASES} />
				</section>
			</PageLayout>
		</>
	);
}
