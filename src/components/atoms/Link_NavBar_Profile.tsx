'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react';

interface Link_NavBar_ProfileProps {
    href: string;
    text: string;
    icon: string;
}

const Link_NavBar_Profile: React.FC<Link_NavBar_ProfileProps> = ({ href, text, icon }) => {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);
    return (
        <Link
            href={href}
            className={`flex items-center p-2 rounded-lg 
            ${isActive ? 'text-red-500 bg-red-100' : 'text-gray-700 hover:text-red-500 hover:bg-red-100'}`}
        >
            <span className="mr-3">{icon}</span>
            <span>{text}</span>
        </Link>
    )
}

export default Link_NavBar_Profile