import Image from 'next/image';
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
