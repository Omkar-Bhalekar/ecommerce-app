/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#172033',
        accent: '#2563EB',
        page: '#F8FAFC',
        ink: '#1E293B',
        mute: '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(23, 32, 51, 0.18)',
      },
    },
  },
  plugins: [],
};
