import type { MouseEventHandler } from "react";


export interface NavItemProps {
  text: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}


const NavItem: React.FC<NavItemProps> = ({ text, href, onClick }: NavItemProps) => {
  return (
    <li>
      <a
        href={href ?? "javascript:"}
        onClick={onClick}
        className="block py-2 pl-3 pr-4 text-neutral-400 rounded hover:bg-neutral-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
        {text}
      </a>
    </li>
  );
};

export default NavItem;
