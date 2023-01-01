import Image from 'next/image';
import Link from "next/link";

import { useEffect, useRef } from "react";

export interface NavBarProps {
  onScrollListenerRegistered?: (offsetHeight: number) => void,
  children: JSX.Element,
}

/**
 *
 * @returns
 */
const NavBar: React.FC<NavBarProps> = ({ onScrollListenerRegistered, children }: NavBarProps) => {

  // Transform
  const navRef = useRef<HTMLElement>(null);

  // Runs only on initialization (when component is mounted).
  useEffect(() => {
    const navbar = navRef.current;

    /**
     * Triggered when the page is scrolled.
     */
    function handleScroll() {

      // Add opacity to navbar when page is scrolled.
      if (navbar) {
        if (window.pageYOffset > 0) {
          navbar.classList.add('bg-neutral-800');
        } else {
          navbar.classList.remove('bg-neutral-800');
        }
      }
    }

    // Register handler on page scroll.
    window.addEventListener('scroll', handleScroll);
    if (onScrollListenerRegistered) {
      onScrollListenerRegistered(navbar?.offsetHeight ?? 0);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array. Will only run on initialization.

  return (
    <nav ref={navRef} className="px-2 sm:px-4 py-2.5 fixed left-0 right-0 top-0 z-10" style={{
      transition: 'background-color 0.25s',
    }}>
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <Link href="/" className="flex items-center">
          <Image src="/logo-nav.svg" className="h-6 mr-3 sm:h-9" alt="Classr Logo" height={36} width={36} />
        </Link>
        <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-400 rounded-lg md:hidden bg-neutral-700 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
        </button>
        <div className="hidden w-full md:block md:w-auto bg-transparent" id="navbar-default">
          <ul className="flex flex-col p-4 mt-4 border border-transparent rounded-lg bg-transparent md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
            {children}
          </ul>
        </div>
      </div>
    </nav>
  )
};

export default NavBar;
