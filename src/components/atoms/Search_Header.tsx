'use client'
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Search_Header = () => {
    const router = useRouter();
    const t = useTranslations();
    const pathname = usePathname();

    const [searchName, setSearchName] = useState('');

    //handleChange
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(e.target.value);
    };

    //handleSubmit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchName.length > 0) {
            if (pathname === '/search') {
                router.replace(`/search?searchName=${searchName}`);
            } else {
                router.push(`/search?searchName=${searchName}`);
            }
        }
    }
    return (
        <form action="" onSubmit={handleSubmit}>
            <div className="relative h-8 md:h-11 border rounded-xl">
                <input
                    type="text"
                    className="w-full h-full focus:outline-none focus:ring-0 border rounded-lg pl-4 md:pr-12"
                    placeholder={t('header.search_placeholder')}
                    onChange={handleChange}
                />
                <button className="absolute right-1 top-1 h-4/5 w-1/12 bg-[#C92127] rounded-md cursor-pointer hidden md:block">
                    <img
                        className="h-6 w-6 m-auto"
                        src="/images/header/ico_search_white.svg"
                        alt="search"
                    />
                </button>
            </div>
        </form>
    )
}

export default Search_Header;