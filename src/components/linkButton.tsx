
export interface LinkButtonProps {
  text: string;
  href: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ text, href }: LinkButtonProps) => {
  return (
    <a
      className="inline-block px-7 py-3 mb-1 border-2 border-gray-200 text-gray-200 font-medium text-sm leading-snug uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
      href={href}
      role="button">{text}</a>
  );
}

export default LinkButton;
