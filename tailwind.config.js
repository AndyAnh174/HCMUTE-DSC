/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],  // Modern, clean font
        display: ['Space Grotesk', 'sans-serif'],  // For headings, matches the DSC logo style
      },
      colors: {
        primary: {
          DEFAULT: '#E94E1B',  // Orange
          50: '#FEF2ED',
          100: '#FDE4D6',
          200: '#F9C4A8',
          300: '#F5A47A',
          400: '#F1844C',
          500: '#E94E1B',  // Base
          600: '#C13E12',
          700: '#992F0E',
          800: '#711F09',
          900: '#491005',
        },
        secondary: {
          DEFAULT: '#0A1B3F',  // Navy Blue
          50: '#E6EBF4',
          100: '#CCD7E9',
          200: '#99AFD3',
          300: '#6687BD',
          400: '#335FA7',
          500: '#0A1B3F',  // Base
          600: '#081632',
          700: '#061025',
          800: '#040B18',
          900: '#02060B',
        },
        accent: {
          DEFAULT: '#2563EB',  // Blue
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',  // Base
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#1E3A8A',
        },
      },
      backgroundImage: {
        'hero-pattern': "url('/patterns/hero-pattern.svg')",
        'dot-pattern': "radial-gradient(circle, #E94E1B 1px, transparent 1px)",
        'grid-pattern': "linear-gradient(to right, #0A1B3F 1px, transparent 1px), linear-gradient(to bottom, #0A1B3F 1px, transparent 1px)",
      },
      backgroundSize: {
        'dot-sm': '20px 20px',
        'dot-md': '30px 30px',
        'grid-sm': '20px 20px',
        'grid-md': '30px 30px',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          'primary': '#E94E1B',
          'primary-focus': '#C13E12',
          'primary-content': '#FFFFFF',
          
          'secondary': '#0A1B3F',
          'secondary-focus': '#081632',
          'secondary-content': '#FFFFFF',
          
          'accent': '#2563EB',
          'accent-focus': '#1D4ED8',
          'accent-content': '#FFFFFF',
          
          'base-100': '#FFFFFF',
          'base-200': '#F8F9FA',
          'base-300': '#E9ECEF',
          'base-content': '#0A1B3F',

          // Custom background colors
          'bg-gradient-start': '#0A1B3F',
          'bg-gradient-end': '#102C66',
        },
      },
    ],
  },
} 