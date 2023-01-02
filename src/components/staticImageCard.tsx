/**
 * Contains the {@link StaticImageCard} component and its props interface.
 *
 * @since 02/01/2023
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import Image from 'next/image';

import type { CardProps } from './card';
import Card from './card';


/**
 * Props fo the {@link StaticImageCard} component.
 */
export interface StaticImageCardProps extends CardProps {
    imageSrc?: string;
    imageAlt?: string;
}

/**
 * Represents a card with an static image.
 */
const StaticImageCard: React.FC<StaticImageCardProps> = ({
    title,
    text,
    imageSrc,
    imageAlt,
    buttonText,
    buttonHref,
    onButtonClick,
    buttonDisabled,
}: StaticImageCardProps) => {
    return (
        <Card buttonDisabled={buttonDisabled} title={title} text={text} buttonText={buttonText} buttonHref={buttonHref} onButtonClick={onButtonClick}>
            {imageSrc && imageAlt ?
                <Image src={imageSrc} alt={imageAlt} width={384} height={208} />
                : <></>}
        </Card>
    );
};

export default StaticImageCard;
