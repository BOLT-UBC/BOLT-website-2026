/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Event gradient classes - these are dynamically interpolated and need to be safelisted
    // First Byte gradients
    'from-[#321070]',
    'via-[#482a9f]',
    'to-[#221247]',
    // BOLT Connect gradients
    'from-[#2b0b3d]',
    'via-[#46198f]',
    'to-[#a53802]',
    // BOLT Circuit gradients
    'from-[#03111f]',
    'via-[#073455]',
    'to-[#0b5b86]',
    // BOLT Bootcamp gradients
    'from-[#12002c]',
    'via-[#2d0f82]',
    'to-[#015c92]',
    // Event glow/shadow classes
    'shadow-[0_0_25px_rgba(123,97,255,0.35)]',
    'shadow-[0_0_25px_rgba(255,136,76,0.35)]',
    'shadow-[0_0_25px_rgba(37,153,255,0.3)]',
    'shadow-[0_0_25px_rgba(134,201,255,0.25)]',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
      },
      colors: {
        'bolt-purple': '#614ea5',
        'bolt-dark': '#1a0b2e',
        'bolt-light': '#493b7b',
      },
      animation: {
        'scroll-right': 'scroll-right 20s linear infinite',
      },
      keyframes: {
        'scroll-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
