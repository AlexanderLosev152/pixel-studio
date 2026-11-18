import { SectionText } from '@/components/ui/SectionText/SectionText';
import { Accordion, AccordionItem } from '@/components/ui/Accordion/Accordion';
import { FAQ, FaqItem } from '@/config/faq';

type FaqProps = {
	items?: FaqItem[];
	descr?: string;
};

export const Faq = ({
	items = FAQ,
	descr = 'Коротко о цене, сроках и о том, как проходит разработка сайта.'
}: FaqProps) => {
	return (
		<section className='faq section container' id='faq'>
			<SectionText className='faq__text' title='Частые вопросы' descr={descr} />

			<Accordion className='faq__items' data-reveal-stagger>
				{items.map(({ question, answer }) => (
					<AccordionItem key={question} title={question}>
						<p>{answer}</p>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
};
