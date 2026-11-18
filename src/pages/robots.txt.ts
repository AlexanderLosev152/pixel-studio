import type { GetServerSideProps } from 'next';

import { SITE_URL } from '@/config/seo';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	res.write(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
	res.end();

	return { props: {} };
};

export default function Robots() {
	return null;
}
