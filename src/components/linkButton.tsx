/**
 * Contains the {@link LinkButton} component and its props interface.
 *
 * @since 30/12/2022
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import Link from "next/link";
import Image from "next/image";



/**
 * Props for the {@link LinkButton} component.
 */
export interface LinkButtonProps {

  /**
   * The text to display on the link button.
   */
  text: string;

  /**
   * Whether the link button is disabled.
   */
  disabled?: boolean;

  /**
   * Any additional CSS classes to add to the component.
   */
  className?: string;

  /**
   * The link to associate with the button.
   */
  href: string;

  /**
   * The icon to display in the button.
   */
  icon?: string;
}

/**
 * Represents a link button.
 */
const LinkButton: React.FC<LinkButtonProps> = ({ text, disabled, className, href, icon }: LinkButtonProps) => {
  return (
    <Link
      className={['py-2.5 px-5 mr-2 mb-2 text-sm font-medium '
        + ` ${disabled ? 'text-neutral-500 border-neutral-500' : 'text-neutral-100 border-neutral-100'}`
        + ' focus:outline-none rounded-lg border focus:z-10', className].join(' ')}
      href={disabled ? 'javascript:void' : href}
      role="button">
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
    </Link>
  );
}

export default LinkButton;
