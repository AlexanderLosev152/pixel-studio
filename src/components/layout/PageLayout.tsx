import { ReactNode } from 'react';

import styles from '@/styles/Home.module.scss';
import { Header } from '@/components/section/Header/Header';
import { Contacts } from '@/components/section/Contacts/Contacts';
import { Footer } from '@/components/section/Fotter/Footer';

type PageLayoutProps = {
	children: ReactNode;
};

export const PageLayout = ({ children }: PageLayoutProps) => {
	return (
		<>
			<Header />

			<main className={styles.main}>
				{children}
				<Contacts />
			</main>

			<Footer />
		</>
	);
};
