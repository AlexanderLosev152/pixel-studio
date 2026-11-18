import classNames from 'classnames';
import Link from 'next/link';
import { ComponentProps } from 'react';

type BtnProps = ComponentProps<typeof Link> & {
	className?: string;
};

export const Btn = ({ href = '#', className, children, ...rest }: BtnProps) => {
	return (
		<Link className={classNames(className, 'btn')} href={href} {...rest}>
			{children}
		</Link>
	);
};
