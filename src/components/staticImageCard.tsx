import type { CardProps } from './card';
import Card from './card';

export interface StaticImageCardProps extends CardProps {
    imageSrc?: string;
    imageAlt?: string;
}

/**
 *
 * @returns
 */
const StaticImageCard: React.FC<StaticImageCardProps> = ({
    title,
    text,
    imageSrc,
    imageAlt,
    buttonText,
    buttonHref,
    buttonOnClick,
}: StaticImageCardProps) => {
    return (
        <Card title={title} text={text} buttonText={buttonText} buttonHref={buttonHref} buttonOnClick={buttonOnClick}>
            {imageSrc && imageAlt ?
                <img src={imageSrc} alt={imageAlt} />
                : <></>}
        </Card>
    );
};

export default StaticImageCard;
