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
    onButtonClick: MouseEventHandler<HTMLButtonElement>,
}


/**
 * Represents a jumbotron.
 */
const Jumbotron: React.FC<JumbotronProps> = ({ onButtonClick }: JumbotronProps) => {
    return (
        <section
            className="p-12 min-h-screen text-center relative overflow-hidden bg-no-repeat bg-cover bg-fixed rounded-lg"
            style={{
                backgroundImage: "url('/images/hero-wisps.png')",
                height: "400px",
            }}>
            <div
                className="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                }}>
                <div className="flex justify-center items-center h-full">
                    <div className="text-white">
                        <Image
                            src="/logo-hero.svg"
                            className="mx-auto mb-4"
                            width={512}
                            height={100}
                            alt="Classr Logo" />
                        <h4 className="text-lg mb-6">
                            Train microclassifiers in the cloud for spam detection, sentiment analysis and more.
                        </h4>
                        <ActionButton text="Get started" onClick={onButtonClick} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Jumbotron;
