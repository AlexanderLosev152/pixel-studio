import styles from '@/styles/Home.module.scss';
import { Header } from '@/components/section/Header/Header';
import { Hero } from '@/components/section/Hero/Hero';
import { Story } from '@/components/section/Story/Story';
import { About } from '@/components/section/About/About';
import { Services } from '@/components/section/Services/Services';
import { Portfolio } from '@/components/section/Portfolio/Portfolio';
import { Works } from '@/components/section/Works/Works';
import { Faq } from '@/components/section/Faq/Faq';
import { Cities } from '@/components/section/Cities/Cities';
import { Contacts } from '@/components/section/Contacts/Contacts';
import { Footer } from '@/components/section/Fotter/Footer';

type LandingProps = {
	heroTitle: string;
	heroText: string;
	citySlug?: string;
};

export const Landing = ({ heroTitle, heroText, citySlug }: LandingProps) => {
	return (
		<>
			<Header />

			<main className={styles.main}>
				<Hero title={heroTitle} text={heroText} />
				<Story />
				<About />
				<Services />
				<Portfolio />
				<Works />
				<Faq />
				<Cities currentSlug={citySlug} />
				<Contacts />
			</main>

			<Footer />
		</>
	);
};
