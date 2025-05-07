import React from 'react'

interface MyComponentProps {
    style: string;
    src: string;
    href?: string;
    target?: string;
}

const Logo: React.FC<MyComponentProps> = ({ style, src, href = "/", target = "_self" }) => {
    return (
        <div>
            <a href={href} target={target} rel="noopener noreferrer">
                <img src={src} alt="logo" className={style} />
            </a>
        </div>
    )
}

export default Logo