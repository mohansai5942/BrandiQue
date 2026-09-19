module.exports = {
        darkMode: 'class',
        theme: {
          extend: {
            screens: {
              'lg': '768px', // Force desktop layout starting from tablet width
            },
            colors: {
              navy: {
                900: '#05070A', 
                800: '#0A0C11',
                700: '#12151C',
                card: 'rgba(255, 255, 255, 0.02)',
              },
              neon: {
                purple: '#B026FF', 
                blue: '#00D4FF',
                pink: '#FF2E93',
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
              'shine': 'shine 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              'spin-slow': 'spin 12s linear infinite',
              'border-beam': 'borderBeam 8s linear infinite',
              'marquee': 'marquee 30s linear infinite',
            },
            keyframes: {
              marquee: {
                '0%': { transform: 'translateX(0%)' },
                '100%': { transform: 'translateX(-100%)' },
              },
              shine: {
                '0%': { left: '-100%', opacity: '0' },
                '50%': { opacity: '0.5' },
                '100%': { left: '100%', opacity: '0' },
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
                '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(176, 38, 255, 0.4)' },
                '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(176, 38, 255, 0.6)' },
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
              'neon': '0 0 20px rgba(176, 38, 255, 0.3)',
              'neon-strong': '0 0 40px rgba(176, 38, 255, 0.5)',
              'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }
          },
        },
content: ['./index.html', './App.tsx', './{pages,components,context,seo}/**/*.{ts,tsx}'],
safelist: ['delay-100','delay-200','delay-300','delay-400','delay-500','bg-neon-purple/10','text-neon-purple','border-neon-purple/20','bg-neon-blue/10','text-neon-blue','border-neon-blue/20'],
};
