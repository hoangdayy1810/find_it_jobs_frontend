import type { Config } from 'tailwindcss';

export default {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        '--tw-prose-bold': 'inherit',
                    },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
} satisfies Config;