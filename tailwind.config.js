/** Build-time Tailwind (v3.4). This is the exact config that used to run in the browser via the
 *  Play CDN (tailwind.config in index.html); compiling it at build time gives the same CSS without the
 *  in-browser compiler. Keep `content` covering every file that holds class names. */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.{ts,tsx}',
    './{components,pages,context,seo,utils,data}/**/*.{ts,tsx,js,json}',
  ],
  // ScrollReveal delays are built at runtime (`delay-${i * 100}`), which a content scan cannot see.
  safelist: [{ pattern: /^delay-(0|75|100|150|200|300|500|700|1000)$/ }],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'lg': '768px', // Legacy: desktop layout from tablet width
        'desk': '1024px', // Real laptop/desktop breakpoint for redesigned sections
      },
      colors: {
        navy: {
          900: '#05070A', 
          800: '#0A0C11',
          700: '#12151C',
          card: 'rgba(255, 255, 255, 0.02)',
        },
        neon: {
          purple: '#D97706', 
          blue: '#FACC15',
          pink: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      transitionTimingFunction: {
        'custom': 'cubic-bezier(0.16, 1, 0.3, 1)', 
        'bounce-custom': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backgroundImage: {
        'dot-matrix': 'radial-gradient(#2a2d3d 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'reveal-text': 'revealText 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-blur': 'slideInBlur 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s infinite',
        'gradient-x': 'gradient-x 5s ease infinite',
        'blob': 'blob 10s infinite',
        'spin-slow': 'spin 12s linear infinite',
        'border-beam': 'borderBeam 8s linear infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee-half': 'marqueeHalf 40s linear infinite',
      },
      keyframes: {
        marqueeHalf: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        revealText: {
          '0%': { transform: 'translateY(110%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInBlur: {
          '0%': { opacity: '0', transform: 'translateX(100px)', filter: 'blur(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)', filter: 'blur(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(234, 179, 8, 0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(234, 179, 8, 0.6)' },
        },
        'gradient-x': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(50px, -50px) scale(1.2)' },
          '66%': { transform: 'translate(-30px, 30px) scale(0.8)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        borderBeam: {
          '100%': { offsetDistance: '100%' },
        }
      },
      boxShadow: {
        'neon': '0 0 20px rgba(234, 179, 8, 0.3)',
        'neon-strong': '0 0 40px rgba(234, 179, 8, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
};
