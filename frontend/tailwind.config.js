/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
      },
      colors: {
        green: {
          500: '#00C896',
        }
      },
      transitionTimingFunction: {
        'acc': 'cubic-bezier(0.85, 0, 0, 1)'
      },
      boxShadow: {
        'acc-card': '0 8px 12px 6px rgba(0,0,0,0.15), 0 4px 4px rgba(0,0,0,0.3)'
      }
    }
  },
  plugins: []
}
