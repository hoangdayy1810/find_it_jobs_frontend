import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};

const intlMiddleware = createMiddleware({
    locales: ['en', 'vi'],
    defaultLocale: 'en',
    localePrefix: 'never', // Ẩn tiền tố /en, /vi
});

export function middleware(request: NextRequest) {
    // Đọc locale từ cookie (nếu có)
    const localeFromCookie = request.cookies.get('NEXT_LOCALE')?.value;
    const locale = localeFromCookie || 'en'; // Nếu không có cookie, dùng defaultLocale

    // Gọi middleware của next-intl với request
    const response = intlMiddleware(request);

    // Nếu locale từ cookie khác với locale hiện tại, cập nhật cookie
    if (localeFromCookie) {
        response.cookies.set('NEXT_LOCALE', locale, { path: '/' });
    }

    return response;
}