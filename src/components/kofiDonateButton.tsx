/**
 * Contains the {@link KofiDonateButton} component and its props interface.
 *
 * @since 15/01/2023
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import Image from 'next/image';


/**
 * Props for the {@link KofiDonateButton} component.
 */
export interface KofiDonateButtonProps {

    /**
     * The Ko-fi link ID.
     */
    linkId: string;
}


/**
 * Represents a button through which Ko-fi donations can be received.
 */
const KofiDonateButton: React.FC<KofiDonateButtonProps> = ({ linkId }: KofiDonateButtonProps) => {
    return (
        <div className="fixed bottom-5 left-5 z-15">
            <a href={`https://ko-fi.com/${linkId}`} target="_blank" rel="noreferrer">
                <Image
                    height={36}
                    width={141}
                    className="border-0 h-[36px]"
                    src="https://cdn.ko-fi.com/cdn/kofi5.png?v=2"
                    alt="Buy Me a Coffee at ko-fi.com" />
            </a>
        </div>
    );
}

export default KofiDonateButton;
