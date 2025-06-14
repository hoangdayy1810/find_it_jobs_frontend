import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
    return (
        <div className="md:w-11/12 mx-auto md:my-2">
            {children}
        </div>
    );
}

export default Container;