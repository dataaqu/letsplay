/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px', // Extra small screens
      },
      animation: {
        'bounce-scale-x': 'bounceScaleX 1s infinite',
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'fadeOut': 'fadeOut 0.3s ease-in-out',
        'slideIn': 'slideIn 0.3s ease-out',
        'slideOut': 'slideOut 0.3s ease-in',
        'simple-bounce': 'simpleBounce 1s infinite',
      },
      keyframes: {
        bounceScaleX: {
          '0%, 100%': { transform: 'translateY(0) scaleX(1)' },
          '50%': { transform: 'translateY(-25px) scaleX(1.1)' }
        },
        // Safari-friendly simple bounce animation
        simpleBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25px)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' }
        }
      },
      dropShadow: {
        'glow-white': '0 0 10px rgba(255, 255, 255, 0.7)'
      }
    },
  },
  plugins: [],
}

