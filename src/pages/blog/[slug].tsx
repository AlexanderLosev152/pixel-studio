import type { GetStaticPaths, GetStaticProps } from 'next';

import { Seo } from '@/components/seo/Seo';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHero } from '@/components/section/PageHero/PageHero';
import { SectionText } from '@/components/ui/SectionText/SectionText';
import { Content } from '@/components/ui/Content/Content';
import { Cards } from '@/components/ui/Cards/Cards';
import { ARTICLES } from '@/content/articles';
import { SERVICES } from '@/content/services';
import type { Article } from '@/content/types';
import { articleJsonLd, breadcrumbsJsonLd, organizationJsonLd } from '@/config/jsonLd';
import { formatDate } from '@/utils/formatDate';

type ArticlePageProps = {
	article: Article;
};

export default function ArticlePage({ article }: ArticlePageProps) {
	const path = `/blog/${article.slug}`;
	const crumbs = [
		{ name: 'Блог', path: '/blog' },
		{ name: article.h1, path }
	];
	const services = SERVICES.filter(({ slug }) => article.services.includes(slug));
	const others = ARTICLES.filter(({ slug }) => slug !== article.slug).slice(0, 3);

	return (
		<>
			<Seo
				title={article.title}
				description={article.description}
				path={path}
				keywords={article.keywords}
				ogType='article'
				jsonLd={[organizationJsonLd(), articleJsonLd(article, path), breadcrumbsJsonLd(crumbs)]}
			/>

			<PageLayout>
				<article>
					<PageHero crumbs={crumbs} title={article.h1} lead={article.lead}>
						<time className='page-hero__date' dateTime={article.date}>
							{formatDate(article.date)}
						</time>
					</PageHero>

					<div className='section container'>
						<Content blocks={article.content} />
					</div>
				</article>

				{services.length > 0 && (
					<section className='section container'>
						<SectionText
							className='page-list__text'
							title='Поможем с сайтом'
							descr='Если после статьи остались вопросы — напишите, обсудим вашу задачу.'
						/>
						<Cards
							items={services.map(({ slug, name, short, price }) => ({
								href: `/uslugi/${slug}`,
								title: name,
								text: short,
								meta: price
							}))}
						/>
					</section>
				)}

				<section className='section container'>
					<SectionText className='page-list__text' title='Читайте также' descr='Ещё статьи о разработке сайтов.' />
					<Cards
						items={others.map(({ slug, h1, short, date }) => ({
							href: `/blog/${slug}`,
							title: h1,
							text: short,
							meta: formatDate(date)
						}))}
					/>
				</section>
			</PageLayout>
		</>
	);
}

export const getStaticPaths: GetStaticPaths = () => ({
	paths: ARTICLES.map(({ slug }) => ({ params: { slug } })),
	fallback: false
});

export const getStaticProps: GetStaticProps<ArticlePageProps> = ({ params }) => {
	const article = ARTICLES.find(({ slug }) => slug === params?.slug);

	if (!article) return { notFound: true };

	return { props: { article } };
};
