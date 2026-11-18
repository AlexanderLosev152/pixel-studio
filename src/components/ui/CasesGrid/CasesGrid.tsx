import Image from 'next/image';
import Link from 'next/link';

import { useTiltGrid } from '@/hooks/useTiltGrid';
import type { Case } from '@/content/types';

type CasesGridProps = {
	items: Case[];
};

export const CasesGrid = ({ items }: CasesGridProps) => {
	const gridRef = useTiltGrid<HTMLUListElement>();

	return (
		<ul className='portfolio__items' ref={gridRef} data-reveal-stagger>
			{items.map(({ slug, cover, title, category }) => (
				<li className='portfolio__item' key={slug}>
					<Link className='portfolio__link' href={`/raboty/${slug}`} data-tilt>
						<div className='portfolio__media'>
							<Image
								className='portfolio__img'
								src={cover}
								alt={`${title} — ${category}`}
								width={1200}
								height={750}
								sizes='(max-width: 768px) 100vw, 33vw'
							/>
						</div>

						<div className='portfolio__caption'>
							<div className='portfolio__titles'>
								<h3>{title}</h3>
								<p className='portfolio__category'>{category}</p>
							</div>

							<span className='portfolio__arrow' aria-hidden='true'>
								<svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
									<path
										d='M3 11 11 3M11 3H5.5M11 3v5.5'
										stroke='currentColor'
										strokeWidth='1.5'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</span>
						</div>

						<span className='portfolio__glare' aria-hidden='true' />
					</Link>
				</li>
			))}
		</ul>
	);
};
