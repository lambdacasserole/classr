/**
 * Contains the {@link AnimatedImageCard} component and its props interface.
 *
 * @since 29/12/2022
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import type { AnimatedImageProps } from './animatedImage';
import AnimatedImage from './animatedImage';

import type { CardProps } from './card';
import Card from './card';


/**
 * Props for the {@link AnimatedImageCard} component.
 */
export interface AnimatedImageCardProps extends CardProps, AnimatedImageProps {}

/**
 * Represents a card with an animated image.
 */
const AnimatedImageCard: React.FC<AnimatedImageCardProps> = ({
    title,
    text,
    baseUrl,
    imageAlt,
    frameCount,
    frameDelay,
    buttonText,
    buttonHref,
    onButtonClick,
}: AnimatedImageCardProps) => {
    return (
        <Card title={title} text={text} buttonText={buttonText} buttonHref={buttonHref} onButtonClick={onButtonClick}>
            <AnimatedImage baseUrl={baseUrl} imageAlt={imageAlt} frameCount={frameCount} frameDelay={frameDelay} />
        </Card>
    );
};

export default AnimatedImageCard;
