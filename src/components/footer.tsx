/**
 * Contains the {@link Footer} component.
 *
 * @since 01/01/2022
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import StackIcon from "./stackIcon";


/**
 * Represents the web application footer.
 */
const Footer: React.FC = () => {
    return (
        <footer
            className="p-12 text-white relative overflow-hidden bg-neutral-800 grid lg:grid-cols-5 md:grid-cols-1 gap-4">
            <div className="col-span-1"></div>
            {/* Technical stuff column */}
            <div className="col-span-1 p-3">
                <h3 className="text-lg mb-3">🔬 The Technical Stuff</h3>
                <p className="text-neutral-400 text-sm mb-2">
                    This application trains multinomial naive bayes classifiers behind the scenes on unigrams generated
                    by splitting strings along space characters. Train/test split is 20/80 and Laplace smoothing is at 1.
                </p>
                <p className="text-neutral-400 text-sm">
                    Any ML engineer with tell you that this is a very simple classifier with a lot of caveats. Use
                    appropriately, and wield responsibly.
                </p>
            </div>
            {/* Why this project column */}
            <div className="col-span-1 p-3">
                <h3 className="text-lg mb-3">🤔 Why this project?</h3>
                <p className="mb-2 text-sm">
                    I (<a href="https://github.com/lambdacasserole">@lambdacasserole</a>) wanted to see what I could do
                    working on something from scratch with the <a href="https://create.t3.gg/en/introduction">T3 stack</a> while
                    sharpening my frontend skills in the process.
                </p>
                <p className="text-sm">
                    Turns out, it&apos;s a super cool stack that you should definitely try out if you haven&apos;t already.
                </p>
                {/* Stack icons */}
                <p className="mt-2">
                    <StackIcon src="/images/t3.svg" alt="create-t3-app" />
                    <StackIcon src="/images/typescript.svg" alt="TypeScript" />
                    <StackIcon src="/images/tailwind.svg" alt="Tailwind CSS" />
                    <StackIcon src="/images/prisma.svg" alt="Prisma ORM" />
                    <StackIcon src="/images/nextjs.svg" alt="Next.js" />
                    <StackIcon src="/images/trpc.svg" alt="tRPC" />
                </p>
            </div>
            {/* Limitations column */}
            <div className="col-span-1 p-3">
                <h3 className="text-lg mb-3">🚧 Limitations</h3>
                <p className="text-neutral-400 text-sm">
                    Classr does not support any of the following features yet:
                </p>
                <ul className="text-neutral-400 list-disc mt-2 text-sm">
                    <li>Training on n-grams.</li>
                    <li>Tokenization based on anything but splitting documents along spaces.</li>
                    <li>Stopword removal.</li>
                    <li>More advanced classifiers (SVMs, random forests etc.)</li>
                </ul>
            </div>
            <div className="col-span-1"></div>
            {/* Copyright section */}
            <div className="md:col-span-1 lg:col-span-5 opacity-50 text-center text-xs mt-6">
                Made with curiosity 🤔 as an experiment 🔬🧪 in T3
                &middot; MIT Licensed
                &middot; Copyright &copy; Saul Johnson 2022 (<a href="https://github.com/lambdacasserole" target="_blank" referrerPolicy="no-referrer" rel="noreferrer">@lambdacasserole</a>)
            </div>
        </footer>
    );
};

export default Footer;
