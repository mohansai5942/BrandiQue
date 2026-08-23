import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const VideoIntro: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Optional: Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleVideoEnd = () => {
    setShowIntro(false);
  };

  const handleSkip = () => {
    setShowIntro(false);
  };

  // Prevent scrolling while intro is playing and signal intro status for chatbot
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    if (showIntro) {
      document.body.classList.add('intro-playing');
      document.body.classList.remove('intro-finished');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('wheel', preventScroll, { passive: false });
    } else {
      document.body.classList.remove('intro-playing');
      document.body.classList.add('intro-finished');
      window.dispatchEvent(new CustomEvent('videoIntroEnded'));
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('wheel', preventScroll);
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('wheel', preventScroll);
    };
  }, [showIntro]);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center items-stretch"
        >
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            onError={handleVideoEnd}
            src={isMobile ? "https://cdn.imgchest.com/files/f54be27e0e3c.mp4" : "https://cdn.imgchest.com/files/151b55323eb5.mp4"}
          />
          
          <button 
            onClick={handleSkip}
            className="absolute bottom-6 right-6 md:bottom-10 md:right-10 text-white/70 hover:text-white border border-white/30 hover:border-white/80 px-4 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 z-10 text-xs font-medium tracking-wider uppercase bg-black/20"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoIntro;
