
export interface LinkButtonProps {
  text: string;
  disabled?: boolean;
  href: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ text, disabled, href }: LinkButtonProps) => {
  return (
    <a
      className={`py-2.5 px-5 mr-2 mb-2 text-sm font-medium ${disabled ? 'text-neutral-500 border-neutral-500' : 'text-neutral-100 border-neutral-100'} focus:outline-none rounded-lg border focus:z-10`}
      href={disabled ? 'javascript:void' : href}
      role="button">{text}</a>
  );
}

export default LinkButton;
