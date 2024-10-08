type HeadingSecondaryProps = {
    children: React.ReactNode;
    textCenter?: boolean;
};

export const HeadingSecondary: React.FC<HeadingSecondaryProps> = ({ children, textCenter }) => {
    return (
        <h2 className={`text-xl font-semibold text-gray-800 ${textCenter ? 'text-center' : ''}`}>
            {children}
        </h2>
    );
};
