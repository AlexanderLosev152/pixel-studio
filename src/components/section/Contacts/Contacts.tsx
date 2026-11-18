import { SectionText } from '@/components/ui/SectionText/SectionText';
import Image from 'next/image';

export const Contacts = () => {
	const contactItems = [
		{ id: 1, name: 'Телеграм', href: '', img: '/images/telegram-trim.webp', width: 269, height: 269 },
		{ id: 2, name: 'Макс', href: '', img: '/images/max.webp', width: 447, height: 447 },
		{ id: 3, name: 'Вк', href: '', img: '/images/vk-trim.webp', width: 371, height: 232 }
	];

	return (
		<section className='contacts section container' id='contacts'>
			<SectionText
				className='contacts__text'
				title='Заказать сайт'
				descr='Расскажите о задаче — ответим в течение 15 минут'
			/>

			<ul className='contacts__items' data-reveal-stagger>
				{contactItems.map(({ id, name, href, img, width, height }) => (
					<li className='contacts__item' key={id}>
						<a className='contacts__link' href={href}>
							<Image
								className='contacts__img'
								src={img}
								alt={`Написать в ${name}`}
								width={width}
								height={height}
							/>
						</a>
					</li>
				))}
			</ul>
		</section>
	);
};
