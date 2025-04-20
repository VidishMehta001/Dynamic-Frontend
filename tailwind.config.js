/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'mt-4',
    'w-full',
    'rounded-md',
    'bg-blue-600',
    'py-2',
    'px-4',
    'text-white',
    'hover:bg-blue-700',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'transition',
    'duration-150',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}