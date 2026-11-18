import Link from 'next/link';

import { SectionText } from '@/components/ui/SectionText/SectionText';
import { NICHES } from '@/content/niches';

export const Services = () => {
	const servicesItems = [
		{
			id: 1,
			href: '/uslugi/korporativnyy-sayt',
			title: 'Корпоративный сайт',
			descr:
				'Сайт компании под ключ: имиджевые страницы, каталог услуг, новости, вакансии. Помогает бизнесу выглядеть солидно и получать заявки.'
		},
		{
			id: 2,
			href: '/uslugi/korporativnyy-sayt',
			title: 'Сложный функционал',
			descr:
				'Личный кабинет, онлайн-оплата, интеграция с CRM, 1С и МойСклад, многоязычный сайт. Разработка сайта с нуля под ваши процессы.'
		},
		{
			id: 3,
			href: '/uslugi/redizayn-sayta',
			title: 'Редизайн и доработка',
			descr:
				'Обновим дизайн, сделаем адаптивную мобильную версию, доработаем функционал или перенесём сайт на новую платформу без потери позиций.'
		},
		{
			id: 4,
			href: '/uslugi/seo-prodvizhenie',
			title: 'SEO-продвижение',
			descr:
				'SEO-аудит и техническая оптимизация сайта, продвижение в Яндексе и Google. Разработка сайта под ключ сразу с SEO-настройкой.'
		},
		{
			id: 5,
			href: '/uslugi/podderzhka-sayta',
			title: 'Поддержка сайта',
			descr:
				'Техническая поддержка, обслуживание и администрирование: обновления, резервные копии, правки контента и сопровождение сайта.'
		},
		{
			id: 6,
			href: '/uslugi',
			title: 'Технологии',
			descr:
				'Пишем на React, Next.js и Laravel. По запросу делаем сайты на WordPress, 1С-Битрикс и Tilda — подберём решение под бюджет.'
		}
	];

	return (
		<section className='services section container' id='more-services'>
			<SectionText
				className='services__text'
				title='Ещё мы делаем'
				descr='Не только новые сайты: дорабатываем, продвигаем и поддерживаем уже работающие проекты.'
			/>

			<ul className='services__items' data-reveal-stagger>
				{servicesItems.map(({ id, href, title, descr }) => (
					<li key={id}>
						<Link href={href}>
							<h3>{title}</h3>
							<p>{descr}</p>
						</Link>
					</li>
				))}
			</ul>

			<h3 className='services__subtitle' data-reveal>
				Делаем сайты для бизнеса
			</h3>
			<ul className='services__tags' data-reveal-stagger>
				{NICHES.map(({ slug, name }) => (
					<li key={slug}>
						<Link href={`/otrasli/${slug}`}>{name}</Link>
					</li>
				))}
			</ul>
		</section>
	);
};
