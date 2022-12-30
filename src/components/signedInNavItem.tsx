import type { Session } from "next-auth/core/types";


export interface SignedInNavItemProps {
  sessionData: Session;
}


const SignedInNavItem: React.FC<SignedInNavItemProps> = ({ sessionData }: SignedInNavItemProps) => {
  return (
    <li>
      <span
        className="block py-2 pl-3 pr-4 text-neutral-400 rounded hover:bg-neutral-100 md:hover:bg-transparent md:border-0 md:p-0">
        <span className="text-neutral-500">Hi</span> <span className="font-bold">{sessionData.user?.name}</span> &middot; <a href="/app" className="md:hover:text-red-700">Classifiers</a> &middot; <a href="javascript:" className="md:hover:text-red-700">Sign out</a>
      </span>
    </li>
  );
};

export default SignedInNavItem;
