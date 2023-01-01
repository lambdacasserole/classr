const GitHubRibbon: React.FC = () => {
    return (
        <a href="https://github.com/lambdacasserole/classr" target="_blank" rel="noreferrer">
            <img src="/images/github-ribbon.svg" style={{
                position: 'fixed',
                bottom: 0,
                right: 0,
                zIndex: 10,
                width: '94px',
                height: 'auto',
            }} />
        </a>
    );
}

export default GitHubRibbon;
