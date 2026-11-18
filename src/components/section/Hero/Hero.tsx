import { Fragment, type CSSProperties } from 'react';

import { Btn } from '@/components/ui/Btn/Btn';
import { Laptop } from '@/components/ui/Laptop/Laptop';

type HeroProps = {
	title: string;
	text: string;
};

export const Hero = ({ title, text }: HeroProps) => {
	const heroItems = [
		{ id: 1, number: '120+', text: 'запущенных сайтов' },
		{ id: 2, number: 'от 7 дней', text: 'до запуска' },
		{ id: 3, number: '4 года', text: 'на рынке' },
		{ id: 4, number: '30 дней', text: 'поддержки после релиза' }
	];

	return (
		<section className='hero'>
			<div className='hero__wrapper container'>
				<div className='hero__main'>
					<div className='hero__title'>
						<h1>
							{title.split(' ').map((word, index) => (
								<Fragment key={index}>
									{index > 0 && ' '}
									<span className='hero__word'>
										<span style={{ '--i': index } as CSSProperties}>{word}</span>
									</span>
								</Fragment>
							))}
						</h1>
						<p>{text}</p>
						<div className='hero__btns'>
							<Btn href={'#contacts'}>Рассчитать проект</Btn>
							<Btn href={'#portfolio'}>Смотреть работы</Btn>
						</div>
					</div>
					<ul className='hero__items'>
						{heroItems.map(({ id, number, text }) => (
							<li key={id}>
								<span>{number}</span>
								<span>{text}</span>
							</li>
						))}
					</ul>
				</div>

				<Laptop />
			</div>
		</section>
	);
};
