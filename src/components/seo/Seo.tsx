import Head from 'next/head';

import { SITE_IMAGE, SITE_NAME, SITE_URL } from '@/config/seo';

type SeoProps = {
	title: string;
	description: string;
	path: string;
	keywords?: string[];
	jsonLd?: object[];
	noindex?: boolean;
	ogType?: 'website' | 'article';
};

export const Seo = ({
	title,
	description,
	path,
	keywords,
	jsonLd = [],
	noindex,
	ogType = 'website'
}: SeoProps) => {
	const url = `${SITE_URL}${path}`;
	const image = `${SITE_URL}${SITE_IMAGE}`;

	return (
		<Head>
			<title>{title}</title>
			<meta name='description' content={description} />
			{keywords && <meta name='keywords' content={keywords.join(', ')} />}
			<link rel='canonical' href={url} />
			{noindex && <meta name='robots' content='noindex, follow' />}

			<meta property='og:type' content={ogType} />
			<meta property='og:locale' content='ru_RU' />
			<meta property='og:site_name' content={SITE_NAME} />
			<meta property='og:title' content={title} />
			<meta property='og:description' content={description} />
			<meta property='og:url' content={url} />
			<meta property='og:image' content={image} />

			<meta name='twitter:card' content='summary_large_image' />
			<meta name='twitter:title' content={title} />
			<meta name='twitter:description' content={description} />
			<meta name='twitter:image' content={image} />

			{jsonLd.map((data, index) => (
				<script
					key={index}
					type='application/ld+json'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
				/>
			))}
		</Head>
	);
};
