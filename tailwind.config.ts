import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 4px/8px spacing grid from your request
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      colors: {
        // Core Shadcn/UI mapping
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: '#F0F2F5',
        foreground: '#232E42',

        // Brand Colors from your CSS
        brand: {
          dark: '#1A202C', // --color1
          navy: '#112032', // --bg5
          muted: '#4A5568', // --color4
          blue: '#1890FF', // --color5
          green: '#0ACF83', // --color8
          gray: '#767676', // from p tag color
        },

        primary: {
          DEFAULT: '#1890FF', // mapped to your primary blue
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: '#F0F2F5', // --bg1
          foreground: '#1A202C',
        },

        bcolor: {
          1: '#F0F2F5',
          2: '#E8E8E8',
          3: '#F5F5F5',
        },
        color: {
          1: ' #1A202C',
          2: ' #312000',
          3: ' #C4C4C4',
          4: ' #4A5568',
          5: ' #1890FF',
          6: ' #212121',
          7: ' #666666',
          8: '#0ACF83',
          9: '#e8f4ff',
        },
        // Mapping specific --colorX vars
        app: {
          1: '#1A202C',
          2: '#312000',
          3: '#C4C4C4',
          4: '#4A5568',
          5: '#1890FF',
          6: '#212121',
          7: '#666666',
          8: '#0ACF83',
          9: '#e8f4ff',
        },
        surface: {
          1: '#F0F2F5', // --bg1
          2: '#FFFFFF', // --bg2
          3: '#F5F5F5', // --bg3
          4: '#DFDFDF', // --bg4
        },
      },
      fontSize: {
        // Mapping your _titleX classes
        'title-1': ['45px', { lineHeight: '56px', fontWeight: '700' }],
        'title-2': ['36px', { lineHeight: '46px', fontWeight: '700' }],
        'title-3': ['26px', { lineHeight: '34px', fontWeight: '500' }],
        'title-4': ['16px', { lineHeight: '1.2', fontWeight: '500' }],
        'title-5': ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        // Standard heading tags from CSS
        h1: '30px',
        h2: '24px',
        h3: '20px',
        h4: '17px',
        base: '16px', // from p tag
      },
      boxShadow: {
        // Mapping your --b-shadowX variables
        'app-1': '7.5px 20px 7.5px 20px rgba(108, 126, 147, 0.15)',
        'app-2': '7.43px 49.03px 7.5px 49.03px rgba(108, 126, 147, 0.1)',
        'app-3': '7px 42px 7px 42px rgba(108, 126, 147, 0.15)',
        'app-inner': '0px 2px 0px 2px rgba(108, 126, 147, 0.15)', // --b-shadow4
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Poppins', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
