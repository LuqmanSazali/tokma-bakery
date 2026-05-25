/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#FF4500', // deep vivid orange-red
        secondary: '#FFC800', // rich golden yellow
        accent:    '#00C853', // vivid green
        pink:      '#FF3D7F', // hot pink
        cream:     '#FFF5E6', // warm cream background
        brown:     '#3B1F0F', // very dark brown for text
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        body:    ['Nunito', 'sans-serif'],
      },
      keyframes: {
        'slide-up': {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
