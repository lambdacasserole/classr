/**
 * Contains the {@link AnimatedImage} component and its props interface.
 *
 * @since 29/12/2022
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import { useEffect, useState } from "react";

import Image from "next/image";


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

    /**
     * The width of the image.
     */
    width?: number;

    /**
     * The height of the image.
     */
    height?: number;

    /**
     * Whether or not the image should fill its parent.
     */
    fill?: boolean;
}


/**
 * Represents an animated image.
 */
const AnimatedImage: React.FC<AnimatedImageProps> = ({
    baseUrl,
    imageAlt,
    frameCount,
    frameDelay,
    width,
    height,
    fill,
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
        <Image src={baseUrl.replace('#', frame.toString())} alt={imageAlt} width={width} height={height} fill={fill} />
    );
};

export default AnimatedImage;
