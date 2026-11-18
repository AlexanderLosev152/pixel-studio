import { Fragment, type CSSProperties } from 'react';

type SectionProps = {
	className: string;
	title: string;
	descr: string;
	/** Заголовок выезжает по словам из-под маски при появлении блока */
	splitTitle?: boolean;
};

export const SectionText = ({ className, title, descr, splitTitle = false }: SectionProps) => {
	return (
		<div className={className} data-reveal>
			<h2 className={`section-title${splitTitle ? ' section-title--split' : ''}`}>
				{splitTitle
					? title.split(' ').map((word, index) => (
							<Fragment key={index}>
								{index > 0 && ' '}
								<span className='split-word'>
									<span style={{ '--i': index } as CSSProperties}>{word}</span>
								</span>
							</Fragment>
						))
					: title}
			</h2>
			<p className='section-descr'>{descr}</p>
		</div>
	);
};
