/**
 * Contains the {@link Jumbotron} component and its props interface.
 *
 * @since 30/12/2022
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import type { MouseEventHandler } from 'react';

import Image from 'next/image';

import ActionButton from './actionButton';


/**
 * Props for the {@link Jumbotron} component.
 */
export interface JumbotronProps {

    /**
     * The click event handler to associate with the jumbotron button.
     */
    onButtonClick?: MouseEventHandler<HTMLButtonElement>,

    /**
     * The URL of the image to display as the logo in the jumbotron.
     */
    imageSrc: string,

    /**
     * The alt text of the image to display as the logo in the jumbotron.
     */
    imageAlt: string,

    /**
     * Any additional CSS classes to add to the component.
     */
    className?: string,

    /**
     * The subtitle to display in the jumbotron.
     */
    subtitle: string,

    /**
     * Whether or not to show the button in the jumbotron.
     */
    showButton?: boolean,
}


/**
 * Represents a jumbotron.
 */
const Jumbotron: React.FC<JumbotronProps> = ({
    onButtonClick,
    imageSrc,
    imageAlt,
    className,
    subtitle,
    showButton,
}: JumbotronProps) => {
    return (
        <section
            className={["p-12 text-center relative overflow-hidden bg-no-repeat bg-cover bg-fixed rounded-lg", className].join(' ')}
            style={{
                backgroundImage: "url('/images/hero-wisps.png')",
            }}>
            <div
                className="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                }}>
                <div className="flex justify-center items-center h-full px-6">
                    <div className="text-white">
                        <Image
                            src={imageSrc}
                            className="mx-auto mb-4"
                            width={512}
                            height={100}
                            alt={imageAlt} />
                        <h4 className="text-lg mb-6">
                            {subtitle}
                        </h4>
                        {showButton && <ActionButton text="Get started" onClick={onButtonClick} />}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Jumbotron;
