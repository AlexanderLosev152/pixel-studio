import { CITIES, City, SITE_EMAIL, SITE_IMAGE, SITE_NAME, SITE_REGION, SITE_URL } from '@/config/seo';
import { FaqItem } from '@/config/faq';
import type { Article, Service } from '@/content/types';

const offer = (name: string, price: number) => ({
	'@type': 'Offer',
	priceCurrency: 'RUB',
	price,
	itemOffered: { '@type': 'Service', name }
});

export const organizationJsonLd = (city?: City) => ({
	'@context': 'https://schema.org',
	'@type': 'ProfessionalService',
	'@id': `${SITE_URL}/#organization`,
	name: SITE_NAME,
	url: SITE_URL,
	image: `${SITE_URL}${SITE_IMAGE}`,
	email: SITE_EMAIL,
	priceRange: '30000–90000+ ₽',
	address: {
		'@type': 'PostalAddress',
		addressRegion: SITE_REGION,
		addressCountry: 'RU'
	},
	areaServed: (city ? [city] : CITIES).map(({ name }) => ({ '@type': 'City', name })),
	hasOfferCatalog: {
		'@type': 'OfferCatalog',
		name: 'Разработка сайтов под ключ',
		itemListElement: [
			offer('Лендинг под ключ', 30000),
			offer('Сайт-визитка под ключ', 50000),
			offer('Интернет-магазин под ключ', 90000)
		]
	}
});

export const faqJsonLd = (items: FaqItem[]) => ({
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: items.map(({ question, answer }) => ({
		'@type': 'Question',
		name: question,
		acceptedAnswer: { '@type': 'Answer', text: answer }
	}))
});

export type Crumb = {
	name: string;
	path: string;
};

export const breadcrumbsJsonLd = (crumbs: Crumb[]) => ({
	'@context': 'https://schema.org',
	'@type': 'BreadcrumbList',
	itemListElement: [{ name: SITE_NAME, path: '/' }, ...crumbs].map(({ name, path }, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name,
		item: `${SITE_URL}${path}`
	}))
});

export const serviceJsonLd = (service: Service, path: string) => ({
	'@context': 'https://schema.org',
	'@type': 'Service',
	name: service.name,
	description: service.description,
	url: `${SITE_URL}${path}`,
	provider: { '@id': `${SITE_URL}/#organization` },
	areaServed: { '@type': 'Country', name: 'Россия' },
	...(/\d/.test(service.price) && {
		offers: {
			'@type': 'Offer',
			priceCurrency: 'RUB',
			price: Number(service.price.replace(/\D/g, ''))
		}
	})
});

export const articleJsonLd = (article: Article, path: string) => ({
	'@context': 'https://schema.org',
	'@type': 'Article',
	headline: article.h1,
	description: article.description,
	datePublished: article.date,
	dateModified: article.date,
	mainEntityOfPage: `${SITE_URL}${path}`,
	image: `${SITE_URL}${SITE_IMAGE}`,
	author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
	publisher: { '@id': `${SITE_URL}/#organization` }
});
