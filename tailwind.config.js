/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary green (Groww-inspired)
        primary: {
          DEFAULT: '#00B386',
          50:  '#E6FBF6',
          100: '#C2F5E6',
          200: '#85EBD0',
          300: '#3DDDB5',
          400: '#00C99A',
          500: '#00B386',
          600: '#009970',
          700: '#007A58',
          800: '#005C42',
          900: '#003D2C',
        },
        // Semantic
        gain:    '#00B386',
        loss:    '#EB5B3C',
        caution: '#F5A623',
        info:    '#3B82F6',
        // Text
        textPrimary:   '#121316',
        textSecondary: '#44475B',
        textMuted:     '#8B8FA8',
        // Backgrounds
        bgDefault: '#FFFFFF',
        bgSurface: '#F8F8FA',
        bgMuted:   '#F0F0F4',
        // Borders
        border:    '#E8E8EB',
        borderMd:  '#D4D4D8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['10px', '14px'],
        'xs':  ['12px', '16px'],
        'sm':  ['14px', '20px'],
        'base':['16px', '24px'],
        'lg':  ['18px', '28px'],
        'xl':  ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['32px', '40px'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10)',
        'sheet': '0 -4px 24px rgba(0,0,0,0.12)',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      transitionDuration: {
        'DEFAULT': '150ms',
      },
    },
  },
  plugins: [],
}
