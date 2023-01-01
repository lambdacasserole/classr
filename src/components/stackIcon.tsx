export interface StackIconProps {
    src: string,
    alt: string,
}

const StackIcon: React.FC<StackIconProps> = ({ src, alt }: StackIconProps) => {
    return (
        <img src={src} alt={alt} className="opacity-50 hover:opacity-100 mr-2" style={{
            width: '32px',
            height: 'auto',
            display: 'inline-block',
        }} />
    );
};

export default StackIcon;
