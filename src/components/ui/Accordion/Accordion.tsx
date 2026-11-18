import classNames from 'classnames';
import { ComponentProps, ReactNode } from 'react';

type AccordionProps = ComponentProps<'div'>;

/** Обёртка аккордеона: отвечает за отступы и раскладку элементов. */
export const Accordion = ({ className, children, ...rest }: AccordionProps) => {
	return (
		<div className={classNames('accordion', className)} {...rest}>
			{children}
		</div>
	);
};

type AccordionItemProps = {
	title: ReactNode;
	children: ReactNode;
	className?: string;
	defaultOpen?: boolean;
};

/**
 * Один пункт аккордеона на нативных details/summary:
 * работает без JS и доступен с клавиатуры.
 */
export const AccordionItem = ({
	title,
	children,
	className,
	defaultOpen = false
}: AccordionItemProps) => {
	return (
		<details className={classNames('accordion__item', className)} open={defaultOpen || undefined}>
			<summary className='accordion__question'>{title}</summary>
			<div className='accordion__panel'>
				<div className='accordion__answer'>
					<div className='accordion__content'>{children}</div>
				</div>
			</div>
		</details>
	);
};
