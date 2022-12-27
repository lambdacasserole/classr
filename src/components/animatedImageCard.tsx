import AnimatedSvg from './animatedSvg';
import type { CardProps } from './card';
import Card from './card';

export interface AnimatedImageCardProps extends CardProps {
    baseUrl: string;
    imageAlt: string;
    frameCount: number;
    frameDelay: number;
}

/**
 *
 * @returns
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
    buttonOnClick,
}: AnimatedImageCardProps) => {
    return (
        <Card title={title} text={text} buttonText={buttonText} buttonHref={buttonHref} buttonOnClick={buttonOnClick}>
            <AnimatedSvg baseUrl={baseUrl} imageAlt={imageAlt} frameCount={frameCount} frameDelay={frameDelay} />
        </Card>
    );
};

export default AnimatedImageCard;
