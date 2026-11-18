import Link from 'next/link';

import { SectionText } from '@/components/ui/SectionText/SectionText';
import { CITIES, REGIONS } from '@/config/seo';

type CitiesProps = {
	currentSlug?: string;
};

export const Cities = ({ currentSlug }: CitiesProps) => {
	return (
		<section className='cities section container' id='cities'>
			<SectionText
				className='cities__text'
				title='География работы'
				descr='Создаём сайты для бизнеса Нижегородской области, Москвы, Санкт-Петербурга, Казани и удалённо работаем по всей России.'
			/>

			<div className='cities__groups' data-reveal-stagger>
				{REGIONS.map((region) => (
					<div className='cities__group' key={region}>
						<h3 className='cities__region'>{region}</h3>
						<ul className='cities__items'>
							{CITIES.filter((city) => city.region === region).map(({ slug, name, inCity }) => (
								<li key={slug}>
									{slug === currentSlug ? (
										<span className='cities__link cities__link--active'>{name}</span>
									) : (
										<Link className='cities__link' href={`/${slug}`} title={`Создание сайтов ${inCity}`}>
											{name}
										</Link>
									)}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</section>
	);
};
