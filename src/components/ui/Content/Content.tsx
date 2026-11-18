import { ContentBlock } from '@/content/types';

type ContentProps = {
	blocks: ContentBlock[];
};

export const Content = ({ blocks }: ContentProps) => {
	return (
		<div className='content' data-reveal>
			{blocks.map((block, index) => {
				switch (block.type) {
					case 'h2':
						return <h2 key={index}>{block.text}</h2>;
					case 'h3':
						return <h3 key={index}>{block.text}</h3>;
					case 'p':
						return <p key={index}>{block.text}</p>;
					case 'ul':
					case 'ol': {
						const List = block.type;
						return (
							<List key={index}>
								{block.items.map((item) => (
									<li key={item}>{item}</li>
								))}
							</List>
						);
					}
				}
			})}
		</div>
	);
};
