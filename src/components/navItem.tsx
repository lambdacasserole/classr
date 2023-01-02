/**
 * Contains the {@link NavItem} component and its props interface.
 *
 * @since 01/01/2023
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import type { MouseEventHandler } from "react";

import Link from "next/link";


/**
 * Props for the {@link NavItem} component.
 */
export interface NavItemProps {

  /**
   * The text to display on the nav item.
   */
  text: string;

  /**
   * The hyperlink to associate with the nav item.
   */
  href?: string;

  /**
   * The event handler to trigger when the item is clicked.
   */
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}


/**
 * Represents a navigation bar item.
 */
const NavItem: React.FC<NavItemProps> = ({ text, href, onClick }: NavItemProps) => {
  return (
    <li>
      <Link
        href={href ?? "javascript:"}
        onClick={onClick}
        className="block py-2 pl-3 pr-4 text-neutral-400 rounded hover:bg-neutral-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
        {text}
      </Link>
    </li>
  );
};

export default NavItem;
