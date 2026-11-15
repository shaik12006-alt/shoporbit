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
        navy: {
          950: '#070a12',
          900: '#0B0F19',
          850: '#0f172a',
          800: '#131b2e',
          700: '#1e293b',
        },
        orbit: {
          purple: '#8B5CF6',
          violet: '#7C3AED',
          indigo: '#6366F1',
          pink: '#EC4899',
          cyan: '#06B6D4',
        },
        amazon: {
          DEFAULT: '#FF9900',
          hover: '#e68a00',
          dark: '#146eb4',
        },
        myntra: {
          DEFAULT: '#FF3F6C',
          hover: '#e02857',
          dark: '#535766',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.15) 0%, rgba(11, 15, 25, 0) 70%)',
      },
      boxShadow: {
        'neon-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'neon-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'card-hover': '0 20px 30px -10px rgba(0, 0, 0, 0.5), 0 0 20px -5px rgba(124, 58, 237, 0.25)',
      }
    },
  },
  plugins: [],
}
