import type { MouseEventHandler } from "react";

export interface ActionButtonProps {
    text: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, onClick }) => {
    return (
        <button
            className="inline-block px-7 py-3 mb-1 border-2 border-gray-200 text-gray-200 font-medium text-sm leading-snug uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            onClick={onClick}>
            {text}
        </button>
    );
};

export default ActionButton;
