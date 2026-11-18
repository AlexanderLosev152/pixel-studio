import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import Link from 'next/link';
import { SectionText } from '@/components/ui/SectionText/SectionText';
import { Btn } from '@/components/ui/Btn/Btn';
import { CountUp } from '@/components/ui/CountUp/CountUp';
import { ParticleMorph } from '@/components/ui/ParticleMorph/ParticleMorph';

// На сервере useLayoutEffect не выполняется — используем useEffect.
const useIsomorphicLayoutEffect =
	typeof window === 'undefined' ? useEffect : useLayoutEffect;

export const About = () => {
	const services = [
		{
			id: 'landing',
			tabTitle: 'Лендинг',
			title: 'Лендинг',
			description:
				'Одна страница с одной задачей: продать товар, собрать заявки или рассказать о запуске.',
			features: [
				'Структура и тексты под вашу аудиторию',
				'Адаптивный дизайн для телефона и компьютера',
				'Форма заявки с отправкой на почту или в Telegram',
				'Подключение аналитики'
			],
			price: 'от 30 000 ₽',
			deadline: '7–10 дней',
			buttonText: 'Заказать лендинг',
			href: '/uslugi/lending'
		},
		{
			id: 'visitka',
			tabTitle: 'Сайт-визитка',
			title: 'Сайт-визитка',
			description:
				'Короткий сайт из нескольких страниц: кто вы, чем занимаетесь и как с вами связаться.',
			features: [
				'До 5 страниц: главная, услуги, о компании, контакты',
				'Простая панель, где можно менять тексты и фото',
				'Карта, мессенджеры и форма обратной связи',
				'Базовая SEO-настройка и подключение домена'
			],
			price: 'от 50 000 ₽',
			deadline: '10–14 дней',
			buttonText: 'Заказать визитку',
			href: '/uslugi/sayt-vizitka'
		},
		{
			id: 'ecommerce',
			tabTitle: 'Интернет-магазин',
			title: 'Интернет-магазин',
			description:
				'Каталог, корзина и оплата. Магазин, которым удобно управлять и в котором удобно покупать.',
			features: [
				'Каталог с фильтрами, поиском и карточками товаров',
				'Онлайн-оплата и доставка: СДЭК, Почта, курьеры',
				'Личный кабинет и история заказов',
				'Интеграция с 1С, МойСклад и CRM'
			],
			price: 'от 90 000 ₽',
			deadline: '3–6 недель',
			buttonText: 'Заказать магазин',
			href: '/uslugi/internet-magazin'
		}
	];

	const [activeTab, setActiveTab] = useState(services[0].id);
	// Предыдущий таб — чтобы цена прокручивалась от старого значения к новому
	const [prevTab, setPrevTab] = useState<string | null>(null);
	const tabsListRef = useRef<HTMLDivElement>(null);
	const indicatorRef = useRef<HTMLSpanElement>(null);
	const activeIndex = services.findIndex((service) => service.id === activeTab);
	const prevPrice = services.find((service) => service.id === prevTab)?.price;

	const selectTab = (id: string) => {
		if (id === activeTab) return;
		setPrevTab(activeTab);
		setActiveTab(id);
	};

	// Плашка активного таба переезжает под выбранную кнопку
	useIsomorphicLayoutEffect(() => {
		const list = tabsListRef.current;
		const indicator = indicatorRef.current;
		const button = tabsRef.current.get(activeTab);
		if (!list || !indicator || !button) return;

		const place = () => {
			indicator.style.width = `${button.offsetWidth}px`;
			indicator.style.height = `${button.offsetHeight}px`;
			indicator.style.transform = `translate(${button.offsetLeft}px, ${button.offsetTop}px)`;
			list.classList.add('about__tabs-btn--indicator');
		};
		place();

		const observer = new ResizeObserver(place);
		observer.observe(list);

		return () => observer.disconnect();
	}, [activeTab]);
	const [panelHeight, setPanelHeight] = useState<number | null>(null);
	const panelsRef = useRef<HTMLDivElement>(null);
	const tabsRef = useRef(new Map<string, HTMLButtonElement>());
	const isReady = panelHeight !== null;

	// Высоту анимируем по реальному размеру активной панели:
	// на мобильных карточки заметно отличаются по высоте.
	useIsomorphicLayoutEffect(() => {
		const panel = panelsRef.current?.querySelector<HTMLElement>(
			`[data-tab-panel="${activeTab}"]`
		);
		if (!panel) return;

		const updateHeight = () => setPanelHeight(panel.getBoundingClientRect().height);
		updateHeight();

		const observer = new ResizeObserver(updateHeight);
		observer.observe(panel);

		return () => observer.disconnect();
	}, [activeTab]);

	const handleTabKeyDown = (
		event: KeyboardEvent<HTMLButtonElement>,
		index: number
	) => {
		let nextIndex: number;

		switch (event.key) {
			case 'ArrowRight':
				nextIndex = (index + 1) % services.length;
				break;
			case 'ArrowLeft':
				nextIndex = (index - 1 + services.length) % services.length;
				break;
			case 'Home':
				nextIndex = 0;
				break;
			case 'End':
				nextIndex = services.length - 1;
				break;
			default:
				return;
		}

		event.preventDefault();
		const nextService = services[nextIndex];
		selectTab(nextService.id);
		tabsRef.current.get(nextService.id)?.focus();
	};

	return (
		<section className='about section container' id='services'>
			<SectionText
				className='about__text'
				title='Разработка сайтов под ключ'
				descr='Выберите тип сайта — покажем, что входит, сколько стоит и как быстро будет готово.'
				splitTitle
			/>

			<div className='about__items' data-reveal>
				<div
					ref={tabsListRef}
					className='about__tabs-btn'
					role='tablist'
					aria-label='Типы сайтов'>
					<span ref={indicatorRef} className='about__tabs-indicator' aria-hidden='true' />
					{services.map((service, index) => (
						<button
							key={service.id}
							id={`tab-button-${service.id}`}
							className={`about__tab-btn btn ${activeTab === service.id ? 'about__tab-btn--active' : ''}`}
							role='tab'
							type='button'
							aria-selected={activeTab === service.id}
							aria-controls={`tab-${service.id}`}
							tabIndex={activeTab === service.id ? 0 : -1}
							onClick={() => selectTab(service.id)}
							onKeyDown={(event) => handleTabKeyDown(event, index)}
							ref={(node) => {
								if (node) {
									tabsRef.current.set(service.id, node);
								} else {
									tabsRef.current.delete(service.id);
								}
							}}>
							{service.tabTitle}
						</button>
					))}
				</div>
				<div className='about__tabs-content'>
					<ParticleMorph
						className='about__morph'
						shape={activeIndex}
						set='sites'
						motion='sway'
						density={0.7}
						scale={0.95}
					/>
					<div
						ref={panelsRef}
						className={`about__tabs-panels${isReady ? ' about__tabs-panels--animated' : ''}`}
						style={isReady ? { height: panelHeight } : undefined}>
						{services.map((currentService) => {
							const isActive = currentService.id === activeTab;

							return (
								<div
									className={`about__card ${isActive ? 'about__card--active' : 'about__card--inactive'}`}
									key={currentService.id}
									id={`tab-${currentService.id}`}
									data-tab-panel={currentService.id}
									role='tabpanel'
									aria-labelledby={`tab-button-${currentService.id}`}
									inert={isReady && !isActive}
									hidden={!isReady && !isActive}>
									<div className='about__card-left'>
										<h3 className='about__card-title'>
											{currentService.title}
										</h3>
										<p className='about__card-description'>
											{currentService.description}
										</p>
										<ul className='about__card-features'>
											{currentService.features.map((feature, index) => (
												<li
													key={index}
													className='about__card-feature'
													style={{ '--i': index } as CSSProperties}>
													{feature}
												</li>
											))}
										</ul>
									</div>
									<div className='about__card-right'>
										<div className='about__card-info'>
											<span className='about__card-label'>Стоимость</span>
											<span className='about__card-value'>
												<CountUp
													value={currentService.price}
													from={prevPrice}
													play={isActive}
												/>
											</span>
										</div>
										<div className='about__card-info'>
											<span className='about__card-label'>Срок</span>
											<span className='about__card-value'>
												{currentService.deadline}
											</span>
										</div>
										<Btn className='about__card-btn' href={'#contacts'}>
											{currentService.buttonText}
										</Btn>
										<Link
											className='about__card-more'
											href={currentService.href}>
											Подробнее об услуге →
										</Link>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
};
