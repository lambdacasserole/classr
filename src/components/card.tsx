/**
 * Contains the {@link Card} component and its props interface.
 *
 * @since 29/12/2022
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import type { MouseEventHandler } from 'react';

import LinkButton from './linkButton';
import ActionButton from './actionButton';


/**
 * Props for the {@link Card} component.
 */
export interface CardProps {

	/**
	 * The title of the card.
	 */
	title: string;

	/**
	 * The text displayed on the card.
	 */
	text: string;

	/**
	 * The text displayed on the card button.
	 */
	buttonText: string;

	/**
	 * The link to associate with the card button (will not work if {@link onButtonClick} is also given).
	 */
	buttonHref?: string;

	/**
	 * The click event handler to associate with the card button (will override {@link buttonLink} if given).
	 */
	onButtonClick?: MouseEventHandler<HTMLButtonElement>;

	/**
	 * Whether or not the card button should be disabled.
	 */
	buttonDisabled?: boolean;

	/**
	 * Children of this component.
	 */
	children?: JSX.Element;
}


/**
 * Represents a card.
 */
const Card: React.FC<CardProps> = ({
	title,
	text,
	buttonText,
	buttonHref,
	onButtonClick,
	buttonDisabled,
	children,
}: CardProps) => {
	return (
		<div className="flex justify-center">
			<div className="text-white max-w-sm">
				{children}
				<div className="p-6">
					<h5 className="text-xl font-medium mb-2">{title}</h5>
					<p className="text-base mb-4">
						{text}
					</p>
					{onButtonClick ? // If an event handler is given, use an action button, otherwise use a link.
						<ActionButton disabled={buttonDisabled} text={buttonText} onClick={onButtonClick} />
						: <LinkButton disabled={buttonDisabled} text={buttonText} href={buttonHref ?? 'javascript:'} />}
				</div>
			</div>
		</div>
	);
};

export default Card;
