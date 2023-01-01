import Image from "next/image";

export interface StackIconProps {
    src: string,
    alt: string,
}

const StackIcon: React.FC<StackIconProps> = ({ src, alt }: StackIconProps) => {
    return (
        <Image src={src} alt={alt} className="opacity-50 hover:opacity-100 mr-2" style={{
            display: 'inline-block',
        }} width={32} height={32} />
    );
};

export default StackIcon;
