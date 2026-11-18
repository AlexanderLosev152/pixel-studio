import type { GetServerSideProps } from 'next';

import { CITIES, SITE_URL } from '@/config/seo';
import { SERVICES } from '@/content/services';
import { NICHES } from '@/content/niches';
import { ARTICLES } from '@/content/articles';
import { CASES } from '@/content/cases';

// Кейсы-заглушки (placeholder: true) закрыты от индексации и в sitemap не попадают
const realCases = CASES.filter(({ placeholder }) => !placeholder);

const pages = [
	{ path: '/', priority: '1.0' },
	{ path: '/uslugi', priority: '0.9' },
	...SERVICES.map(({ slug }) => ({ path: `/uslugi/${slug}`, priority: '0.9' })),
	...CITIES.map(({ slug }) => ({ path: `/${slug}`, priority: '0.8' })),
	{ path: '/otrasli', priority: '0.8' },
	...NICHES.map(({ slug }) => ({ path: `/otrasli/${slug}`, priority: '0.8' })),
	{ path: '/blog', priority: '0.7' },
	...ARTICLES.map(({ slug }) => ({ path: `/blog/${slug}`, priority: '0.7' })),
	...(realCases.length > 0 ? [{ path: '/raboty', priority: '0.6' }] : []),
	...realCases.map(({ slug }) => ({ path: `/raboty/${slug}`, priority: '0.6' }))
];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const lastmod = new Date().toISOString().slice(0, 10);
	const urls = pages
		.map(
			({ path, priority }) =>
				`<url><loc>${SITE_URL}${path}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`
		)
		.join('');

	res.setHeader('Content-Type', 'application/xml; charset=utf-8');
	res.write(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
	);
	res.end();

	return { props: {} };
};

export default function Sitemap() {
	return null;
}
