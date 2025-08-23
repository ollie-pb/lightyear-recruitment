import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC',
          dark: '#0052A3',
          light: '#3385D6',
        },
        secondary: {
          DEFAULT: '#FF6B35',
          dark: '#E5522C',
          light: '#FF8A5B',
        },
        success: '#28A745',
        neutral: {
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#6C757D',
          700: '#495057',
          800: '#343A40',
          900: '#212529',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.8rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.563rem', { lineHeight: '2.25rem' }],
        '3xl': ['1.953rem', { lineHeight: '2.75rem' }],
        '4xl': ['2.441rem', { lineHeight: '3.25rem' }],
        '5xl': ['3.052rem', { lineHeight: '3.75rem' }],
      },
      spacing: {
        '0': '0',
        '1': '0.5rem',   // 8px
        '2': '1rem',      // 16px
        '3': '1.5rem',    // 24px
        '4': '2rem',      // 32px
        '6': '3rem',      // 48px
        '8': '4rem',      // 64px
        '12': '6rem',     // 96px
      },
      screens: {
        'xs': '320px',
        'sm': '768px',
        'md': '1024px',
        'lg': '1440px',
      },
    },
  },
  plugins: [],
}

export default config