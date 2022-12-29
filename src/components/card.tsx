import LinkButton from './linkButton';
import ActionButton from './actionButton';
import type { MouseEventHandler } from 'react';

export interface CardProps {
  title: string;
  text: string;
  buttonText: string;
  buttonHref?: string;
  buttonOnClick?: MouseEventHandler<HTMLButtonElement>;
  buttonDisabled?: boolean;
  children?: JSX.Element;
}

/**
 *
 * @returns
 */
const Card: React.FC<CardProps> = ({
  title,
  text,
  buttonText,
  buttonHref,
  buttonOnClick,
  buttonDisabled,
  children,
}: CardProps) => {
  return (
    <div className="flex justify-center">
      <div className="text-white max-w-sm">
        {children}
        <div className="p-6">
          <h5 className="text-xl font-medium mb-2">{title}</h5>
          <p className="text-base mb-4">
            {text}
          </p>
          {buttonOnClick ?
            <ActionButton disabled={buttonDisabled} text={buttonText} onClick={buttonOnClick} />
            : <LinkButton disabled={buttonDisabled} text={buttonText} href={buttonHref ?? '#!'} />}
        </div>
      </div>
    </div>
  );
};

export default Card;
