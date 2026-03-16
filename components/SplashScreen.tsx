import React, { useState, useEffect, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const startFadeOut = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 500); // Match the CSS transition duration
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      // Start fading 0.5 seconds before the end
      if (video.duration - video.currentTime <= 0.5) {
        startFadeOut();
      }
    }
  };

  const handleSkip = () => {
    startFadeOut();
  };

  const desktopVideo = "https://res.cloudinary.com/dhgn20tjm/video/upload/v1773641509/111111_cykh81.mp4";
  const mobileVideo = "https://res.cloudinary.com/dhgn20tjm/video/upload/v1773641507/22222_gpbsta.mp4";

  return (
    <div 
      className={`fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={startFadeOut}
        className="w-full h-full object-cover"
        onError={() => onComplete()}
      >
        <source src={isMobile ? mobileVideo : desktopVideo} type="video/mp4" />
      </video>

      {/* Skip Intro Button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 z-[10001] px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-medium tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
      >
        Skip Intro
      </button>
    </div>
  );
};

export default SplashScreen;
