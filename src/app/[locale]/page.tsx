'use client';

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="h-screen font-[family-name:var(--font-geist-sans)]">
      <div>
        <h1>{t('home.title')}</h1>
        <p>{t('home.description')}</p>
      </div>
    </div>
  );
}
