import { CSSProperties } from 'react';

// Строки «кода» на экране: отступ, ширина и цвет подсветки
const codeLines = [
	{ indent: 0, width: 42, color: 'accent' },
	{ indent: 0, width: 0, color: 'muted' },
	{ indent: 0, width: 64, color: 'green' },
	{ indent: 1, width: 48, color: 'muted' },
	{ indent: 1, width: 70, color: 'orange' },
	{ indent: 2, width: 38, color: 'accent' },
	{ indent: 2, width: 56, color: 'light' },
	{ indent: 1, width: 30, color: 'muted' },
	{ indent: 0, width: 0, color: 'muted' },
	{ indent: 0, width: 52, color: 'green' },
	{ indent: 1, width: 66, color: 'light' },
	{ indent: 1, width: 44, color: 'orange' },
	{ indent: 0, width: 24, color: 'accent' }
];

export const Laptop = () => {
	return (
		<div className='laptop' aria-hidden='true'>
			<div className='laptop__scene'>
				<div className='laptop__lid'>
					<div className='laptop__screen'>
						<div className='laptop__bar'>
							<i />
							<i />
							<i />
						</div>
						<div className='laptop__code'>
							{codeLines.map(({ indent, width, color }, index) => (
								<span
									key={index}
									className={`laptop__line laptop__line--${color}`}
									style={
										{
											'--indent': indent,
											'--width': `${width}%`,
											'--index': index
										} as CSSProperties
									}
								/>
							))}
							<span className='laptop__cursor' />
						</div>
					</div>
				</div>

				<div className='laptop__base'>
					<div className='laptop__keyboard' />
					<div className='laptop__trackpad' />
				</div>
			</div>

			<div className='laptop__shadow' />
		</div>
	);
};
