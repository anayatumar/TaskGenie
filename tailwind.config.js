/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          light: '#818cf8',
        },
        secondary: '#a855f7',
        accent: '#ec4899',
        dark: {
          900: '#0B0F19',
          800: '#111827',
          700: '#1F2937',
          600: '#374151',
        }
      },
      animation: {
        'orb-pulse': 'orbPulse 3s ease-in-out infinite',
        'orb-glow': 'orbGlow 2s ease-in-out infinite alternate',
        'orb-listen': 'orbListen 1.5s ease-in-out infinite alternate',
        'orb-process': 'orbProcess 1s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        orbPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.95' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        orbGlow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 35px rgba(168, 85, 247, 0.8))' },
        },
        orbListen: {
          '0%': { transform: 'scale(1.02) rotate(0deg)', filter: 'drop-shadow(0 0 25px rgba(236, 72, 153, 0.7))' },
          '100%': { transform: 'scale(1.12) rotate(10deg)', filter: 'drop-shadow(0 0 45px rgba(99, 102, 241, 0.9))' },
        },
        orbProcess: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        }
      }
    },
  },
  plugins: [],
}
