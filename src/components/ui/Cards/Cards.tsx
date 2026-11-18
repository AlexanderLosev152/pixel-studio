import Link from 'next/link';

export type CardItem = {
	href: string;
	title: string;
	text: string;
	meta?: string;
};

type CardsProps = {
	items: CardItem[];
};

export const Cards = ({ items }: CardsProps) => {
	return (
		<ul className='cards' data-reveal-stagger>
			{items.map(({ href, title, text, meta }) => (
				<li className='cards__item' key={href}>
					<Link className='cards__link' href={href}>
						{meta && <span className='cards__meta'>{meta}</span>}
						<h3 className='cards__title'>{title}</h3>
						<p className='cards__text'>{text}</p>
						<span className='cards__more'>Подробнее →</span>
					</Link>
				</li>
			))}
		</ul>
	);
};
