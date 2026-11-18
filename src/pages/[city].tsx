import type { GetStaticPaths, GetStaticProps } from 'next';

import { Seo } from '@/components/seo/Seo';
import { Landing } from '@/components/layout/Landing';
import { CITIES, City, cityKeywords, getCity } from '@/config/seo';
import { FAQ } from '@/config/faq';
import { breadcrumbsJsonLd, faqJsonLd, organizationJsonLd } from '@/config/jsonLd';

type CityPageProps = {
	city: City;
};

export default function CityPage({ city }: CityPageProps) {
	return (
		<>
			<Seo
				title={`Создание сайтов ${city.inCity} под ключ — веб-студия | ${city.name}`}
				description={`Разработка сайтов ${city.inCity}: лендинг от 30 000 ₽, сайт-визитка, корпоративный сайт и интернет-магазин под ключ. Адаптивный дизайн, SEO-настройка, договор и поддержка 30 дней.`}
				path={`/${city.slug}`}
				keywords={cityKeywords(city)}
				jsonLd={[organizationJsonLd(city), breadcrumbsJsonLd([{ name: `Создание сайтов ${city.inCity}`, path: `/${city.slug}` }]), faqJsonLd(FAQ)]}
			/>

			<Landing
				heroTitle={`Создание сайтов ${city.inCity}`}
				heroText={city.intro}
				citySlug={city.slug}
			/>
		</>
	);
}

export const getStaticPaths: GetStaticPaths = () => ({
	paths: CITIES.map(({ slug }) => ({ params: { city: slug } })),
	fallback: false
});

export const getStaticProps: GetStaticProps<CityPageProps> = ({ params }) => {
	const city = getCity(String(params?.city));

	if (!city) return { notFound: true };

	return { props: { city } };
};
