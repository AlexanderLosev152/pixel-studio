import { SectionText } from '@/components/ui/SectionText/SectionText';
import { CasesGrid } from '@/components/ui/CasesGrid/CasesGrid';
import { Btn } from '@/components/ui/Btn/Btn';
import { CASES } from '@/content/cases';

export const Portfolio = () => {
	return (
		<section className='portfolio section container' id='portfolio'>
			<SectionText
				className='portfolio__text'
				title='Недавние работы'
				descr='Примеры в разных сферах. Каждый проект — отдельная идея, а не шаблон.'
			/>

			<CasesGrid items={CASES.slice(0, 6)} />

			<Btn className='portfolio__all' href='/raboty' data-reveal>
				Все работы ({CASES.length})
			</Btn>
		</section>
	);
};
