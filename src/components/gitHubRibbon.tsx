/**
 * Contains the {@link GitHubRibbon} component.
 *
 * @since 01/01/2022
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import Image from "next/image";


/**
 * Represents a GitHub ribbon displayed in the bottom-right corner of the page.
 */
const GitHubRibbon: React.FC = () => {
    return (
        <a href="https://github.com/lambdacasserole/classr" target="_blank" rel="noreferrer">
            <Image src="/images/github-ribbon.svg" alt="Open-source on GitHub" style={{
                position: 'fixed',
                bottom: 0,
                right: 0,
                zIndex: 10,
                width: '94px',
                height: 'auto',
            }} width={94} height={94} />
        </a>
    );
}

export default GitHubRibbon;
