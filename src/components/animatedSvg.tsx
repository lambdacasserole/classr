import { useEffect, useState } from "react";

export interface AnimatedSvgProps {
    baseUrl: string;
    imageAlt: string;
    frameCount: number;
    frameDelay: number;
}

const AnimatedSvg: React.FC<AnimatedSvgProps> = ({ baseUrl, imageAlt, frameCount, frameDelay }: AnimatedSvgProps) => {

    const [frame, setFrame] = useState({ previous: 0, current: 1 });

    useEffect(() => {
        const animationInterval = setInterval(() => {
            const nextFrame = frame.current === frameCount ? 1 : frame.current + 1;
            setFrame({ previous: frame.current, current: nextFrame });
        }, frameDelay);
        return () => clearInterval(animationInterval);
    }, [frame, frameCount, frameDelay]);

    return (
        <img src={baseUrl.replace('#', frame.previous.toString())} alt={imageAlt} />
    );
};

export default AnimatedSvg;
