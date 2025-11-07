/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ['./src/**/*.{ts,tsx}'],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            fontFamily: {
                roboto: [
                    'Roboto_400Regular',
                    'Roboto_500Medium',
                    'Roboto_700Bold',
                ],
            },
            colors: {
                'solar-blue-primary': '#1a9cd9',
                'solar-green-primary': '#bccf00',
                'solar-orange-primary': '#f9b233',
                'solar-blue-secondary': '#0d3b85',
                'solar-green-secondary': '#fcee21',
                'solar-orange-secondary': '#e54757',
                'solar-red-primary': '#c1478a',
                'solar-red-secondary': '#7d5496',
                'solar-violet': '#5d71af',
            },
        },
    },
    plugins: [],
};
