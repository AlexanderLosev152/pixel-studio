import { FaqItem } from '@/config/faq';

// Блок текста для статей и описаний. h2/h3 — подзаголовки внутри страницы (h1 задаётся отдельно)
export type ContentBlock =
	| { type: 'h2'; text: string }
	| { type: 'h3'; text: string }
	| { type: 'p'; text: string }
	| { type: 'ul'; items: string[] }
	| { type: 'ol'; items: string[] };

type SeoFields = {
	slug: string; // латиница через дефис — часть адреса страницы
	title: string; // <title>, 50–70 символов
	description: string; // meta description, 140–160 символов
	keywords: string[];
	h1: string;
	lead: string; // абзац под заголовком, 1–2 предложения
	content: ContentBlock[];
};

// Страница услуги: /uslugi/[slug]
export type Service = SeoFields & {
	name: string; // короткое название для меню и карточек: «Лендинг»
	short: string; // одно предложение для карточки услуги
	price: string; // «от 30 000 ₽» или «Индивидуально»
	deadline: string; // «7–10 дней» или «Индивидуально»
	includes: string[]; // что входит в работу, 4–8 пунктов
	faq: FaqItem[];
};

// Страница отрасли: /otrasli/[slug]
export type Niche = SeoFields & {
	name: string; // для меню и тегов: «Стоматологии»
	short: string; // одно предложение для карточки
	features: string[]; // что обязательно нужно на сайте для этой отрасли, 5–8 пунктов
	services: string[]; // slug подходящих услуг из SERVICES
	faq: FaqItem[];
};

// Статья блога: /blog/[slug]
export type Article = SeoFields & {
	date: string; // YYYY-MM-DD
	short: string; // анонс для списка статей, 1–2 предложения
	services: string[]; // slug связанных услуг из SERVICES
};

// Кейс портфолио: /raboty/[slug]
export type Case = {
	slug: string;
	title: string; // название проекта
	category: string; // «Лендинг для онлайн-курса»
	cover: string; // обложка для карточки, 1200×750
	img: string; // скриншот всей страницы, ширина 1200
	imgHeight: number; // высота скриншота в пикселях
	short: string;
	task: string;
	solution: string[];
	service: string; // slug услуги из SERVICES
	niche?: string; // slug отрасли из NICHES
	// true — пример-заглушка: страница закрыта от индексации и не попадает в sitemap
	placeholder: boolean;
};
