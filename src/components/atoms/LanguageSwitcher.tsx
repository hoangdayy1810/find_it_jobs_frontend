'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';



export default function LanguageSwitcher() {
    const locale = useLocale();
    const t = useTranslations();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const languages = [
        { code: 'vi', label: t('header.vi'), flag: '/images/flags/vi.png' },
        { code: 'en', label: t('header.en'), flag: '/images/flags/en.png' }
    ];

    const currentLang = languages.find(l => l.code === locale) || languages[0];

    const handleLocaleChange = async (newLocale: string) => {

        // Cập nhật cookie
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`; // Lưu 1 năm

        // Tải lại trang để áp dụng locale mới
        router.refresh();
    };

    return (
        <div className="relative inline-block">
            {/* Nút hiển thị ngôn ngữ hiện tại */}
            <button onClick={() => setOpen(prev => !prev)} className="border rounded-4xl hover:shadow">
                <Image
                    src={currentLang?.flag}
                    alt={currentLang?.label!}
                    width={30}
                    height={20}
                    className="rounded"
                />
            </button>

            {/* Dropdown lựa chọn */}
            {open && (
                <div className="absolute mt-2 right-1 z-50 bg-white border rounded shadow-md w-40">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => handleLocaleChange(lang.code)}
                            className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
                        >
                            <Image
                                src={lang.flag}
                                alt={lang.label}
                                width={24}
                                height={16}
                                className="rounded mr-2"
                            />
                            <span>{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}