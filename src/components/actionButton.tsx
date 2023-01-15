/**
 * Contains the {@link ActionButton} component and its props interface.
 *
 * @since 29/12/2022
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import Image from "next/image";
import type { MouseEventHandler } from "react";


/**
 * Props for the {@link ActionButton} component.
 */
export interface ActionButtonProps {

    /**
     * The text to display on the action button.
     */
    text: string;

    /**
     * Whether the action button is disabled.
     */
    disabled?: boolean;

    /**
     * Any additional CSS classes to add to the component.
     */
    className?: string;

    /**
     * The event handler for when the action button is clicked.
     */
    onClick?: MouseEventHandler<HTMLButtonElement>;

    /**
     * The icon to display in the button.
     */
    icon?: string;
}


/**
 * Represents an action button.
 */
const ActionButton: React.FC<ActionButtonProps> = ({
    text,
    disabled,
    className,
    onClick,
    icon,
}: ActionButtonProps) => {
    return (
        <button
            disabled={disabled}
            className={['py-2.5 px-5 mr-2 mb-2 text-sm font-medium'
                + ` ${disabled ? 'text-neutral-500 border-neutral-500' : 'text-neutral-100 border-neutral-100'}`
                + ' focus:outline-none rounded-lg border focus:z-10', className].join(' ')}
            onClick={onClick}>
            {icon ?
                <Image
                    className="inline-block mr-3"
                    src={icon}
                    style={{
                        marginTop: '-3px',
                    }}
                    alt=""
                    width={16}
                    height={16} /> : <></>}
            {text}
        </button>
    );
};

export default ActionButton;
