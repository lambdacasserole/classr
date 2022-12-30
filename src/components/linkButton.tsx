/**
 * Contains the {@link LinkButton} component and its props interface.
 *
 * @since 30/12/2022
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */


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
   * The link to associate with the button.
   */
  href: string;
}

/**
 * Represents a link button.
 */
const LinkButton: React.FC<LinkButtonProps> = ({ text, disabled, href }: LinkButtonProps) => {
  return (
    <a
      className={'py-2.5 px-5 mr-2 mb-2 text-sm font-medium '
        + ` ${disabled ? 'text-neutral-500 border-neutral-500' : 'text-neutral-100 border-neutral-100'}`
        + ' focus:outline-none rounded-lg border focus:z-10'}
      href={disabled ? 'javascript:void' : href}
      role="button">
      {text}
    </a>
  );
}

export default LinkButton;
