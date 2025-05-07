import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
    const effectiveLocale = locale || 'vi';

    return {
        locale: effectiveLocale,
        messages: (await import(`../messages/${effectiveLocale}.json`)).default,
    };
});