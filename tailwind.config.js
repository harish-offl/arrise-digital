/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: { DEFAULT: '#2D8CFF', 400: '#60a5fa', 500: '#2D8CFF', 600: '#1a6fd4' },
        violet: { DEFAULT: '#7B3FE4', 400: '#a78bfa', 500: '#7B3FE4' },
        magenta: { DEFAULT: '#D91E9B', 400: '#f472b6', 500: '#D91E9B' },
        dark: { DEFAULT: '#0E0E11', 800: '#16161a', 900: '#0E0E11' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #2D8CFF 0%, #7B3FE4 50%, #D91E9B 100%)',
        'brand-gradient-r': 'linear-gradient(90deg, #2D8CFF 0%, #7B3FE4 50%, #D91E9B 100%)',
        'dark-surface': 'linear-gradient(135deg, #0E0E11 0%, #16161a 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'spin-slow': 'spin 20s linear infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(45,140,255,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(123,63,228,0.5), 0 0 80px rgba(217,30,155,0.2)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'glow-blue': '0 0 30px rgba(45,140,255,0.4)',
        'glow-violet': '0 0 30px rgba(123,63,228,0.4)',
        'glow-magenta': '0 0 30px rgba(217,30,155,0.4)',
        'glow-brand': '0 0 40px rgba(123,63,228,0.3), 0 0 80px rgba(45,140,255,0.15)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
