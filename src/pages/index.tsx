import { Seo } from '@/components/seo/Seo';
import { Landing } from '@/components/layout/Landing';
import { BASE_KEYWORDS } from '@/config/seo';
import { FAQ } from '@/config/faq';
import { faqJsonLd, organizationJsonLd } from '@/config/jsonLd';

export default function Home() {
	return (
		<>
			<Seo
				title='Создание сайтов под ключ — веб-студия | Нижний Новгород, Павлово, Богородск'
				description='Разработка сайтов под ключ: лендинг от 30 000 ₽ за 7 дней, сайт-визитка, корпоративный сайт и интернет-магазин. SEO-настройка, адаптивный дизайн, поддержка 30 дней. Нижегородская область, Москва, Санкт-Петербург, Казань и вся Россия.'
				path='/'
				keywords={BASE_KEYWORDS}
				jsonLd={[organizationJsonLd(), faqJsonLd(FAQ)]}
			/>

			<Landing
				heroTitle='Создание сайтов под ключ'
				heroText='Разрабатываем лендинги, сайты-визитки, корпоративные сайты и интернет-магазины. Чистый код, быстрая загрузка, понятная цена. Сайт под ключ — от 7 дней.'
			/>
		</>
	);
}
