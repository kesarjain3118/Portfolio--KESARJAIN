/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./index.html'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['DM Sans', 'sans-serif'],
                serif: ['DM Serif Display', 'serif'],
                handwriting: ['Caveat', 'cursive'],
            },
            colors: {
                cream: '#FAF7F2',
                'accent-orange': '#e97451',
                'accent-blue': '#5B9BD5',
            }
        }
    },
    plugins: [],
}
