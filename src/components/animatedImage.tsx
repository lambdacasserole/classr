/**
 * Contains the {@link AnimatedImage} component and its props interface.
 *
 * @since 29/12/2022
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import { useEffect, useState } from "react";


/**
 * Props for the {@link AnimatedImage} component.
 */
export interface AnimatedImageProps {

    /**
     * The base URL of the image (including '#' as the frame number placeholder).
     */
    baseUrl: string;

    /**
     * The alt next for the image.
     */
    imageAlt: string;

    /**
     * The total number of frames in the animation.
     */
    frameCount: number;

    /**
     * The amount of time each frame should be displayed for in milliseconds.
     */
    frameDelay: number;
}


/**
 * Represents an animated image.
 */
const AnimatedImage: React.FC<AnimatedImageProps> = ({
    baseUrl,
    imageAlt,
    frameCount,
    frameDelay,
}: AnimatedImageProps) => {

    // Maintain current frame number as state.
    const [frame, setFrame] = useState(1);

    useEffect(() => {

        // Increment frame number in state at interval.
        const animationInterval = setInterval(() => {
            const nextFrame = frame === frameCount ? 1 : frame + 1; // Loop back to frame 1 if at end of animation.
            setFrame(nextFrame);
        }, frameDelay);
        return () => clearInterval(animationInterval);
    }, [frame, frameCount, frameDelay]);

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={baseUrl.replace('#', frame.toString())} alt={imageAlt} />
    );
};

export default AnimatedImage;
