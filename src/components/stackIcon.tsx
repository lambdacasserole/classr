/**
 * Contains the {@link StackIcon} component and its props interface.
 *
 * @since 02/01/2023
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import Image from "next/image";
import Link from "next/link";


/**
 * Props for the {@link StackIcon} component.
 */
export interface StackIconProps {

    /**
     * The image to associate with the stack logo icon.
     */
    src: string,

    /**
     * The alt text to associate with the stack logo icon.
     */
    alt: string,

    /**
     * The hypelink to associate with the stack logo icon.
     */
    href?: string,
}


/**
 * Represents a stack logo icon.
 */
const StackIcon: React.FC<StackIconProps> = ({ src, alt, href }: StackIconProps) => {
    return (
        <Link href={href ?? 'javascript:'} target="_blank">
            <Image src={src} alt={alt} className="opacity-50 hover:opacity-100 mr-2" style={{
                display: 'inline-block',
            }} width={32} height={32} />
        </Link>
    );
};

export default StackIcon;
