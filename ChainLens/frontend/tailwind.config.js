/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                flare: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    500: '#ef4444', // approximations
                    600: '#dc2626',
                }
            }
        },
    },
    plugins: [],
}
