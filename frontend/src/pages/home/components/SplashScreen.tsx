import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [tagline, setTagline] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [backgroundParticles, setBackgroundParticles] = useState<{ top: number; left: number; size: number; opacity: number }[]>([]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      navigate("/"); // Redirect to Main App Page
    }, 3500);

    // Simulate loading progress with smoother progression
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = prev > 80 ? 1 : prev > 60 ? 2 : 3;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  // Typing Effect for professional tagline
  useEffect(() => {
    const fullTagline = "Where Sound Meets Emotion";
    let i = 0;

    const typingInterval = setInterval(() => {
      if (i < fullTagline.length) {
        setTagline(fullTagline.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, []);

  // Generate background particles
  useEffect(() => {
    const particles = Array.from({ length: 10 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.5 + 0.5,
    }));
    setBackgroundParticles(particles);
  }, []);

  if (!showSplash) return null;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative overflow-hidden">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        {backgroundParticles.map((particle, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              opacity: particle.opacity,
            }}
          />
        ))}
      </div>

      {/* Logo container with subtle glow */}
      {/* Logo container with subtle glow */}
<div className="relative mb-8 flex justify-center items-center">
  <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-20 scale-125"></div>
  <img
    src="/spotify.png"
    alt="Melodify Logo"
    className="w-32 h-32 rounded-full relative z-10 shadow-2xl object-cover"
  />
</div>


      {/* App Name */}
      <h1 className="text-4xl font-bold tracking-wider mb-1 text-purple-400" style={{ fontFamily: "Montserrat" }}>
        MELODIFY
      </h1>
      <div className="w-16 h-px bg-purple-700 mx-auto mb-2"></div>

      <p className="text-sm font-light tracking-wide uppercase text-purple-300">{tagline}</p>
      
      {/* Loading Bar */}
      <div className="w-56 mt-10 mb-2">
        <div className="flex justify-between text-xs text-purple-300 mb-1">
          <span>Loading</span>
          <span>{loadingProgress}%</span>
        </div>
        <div className="h-1 bg-gray-800 rounded overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Equalizer Animation */}
      <div className="flex space-x-1 mt-8">
        {[0.8, 1.0, 1.2, 1.4, 1.6].map((duration, index) => (
          <div 
            key={index}
            className="w-1 h-4 bg-gradient-to-t from-purple-600 to-pink-400 opacity-80 animate-equalizer"
            style={{ animationDuration: `${duration}s` }}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes equalizer {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
        .animate-equalizer {
          animation-name: equalizer;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
      `}</style>

      {/* Footer */}
      <div className="absolute bottom-6 text-center">
        <p className="text-xs text-gray-500 tracking-wide">v1.0.0</p>
      </div>
    </div>
  );
};

export default SplashScreen;
