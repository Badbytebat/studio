'use client';

import { cn } from '@/lib/utils';

type PixelArtBackgroundProps = {
    darkMode: boolean;
};

const PixelArtBackground: React.FC<PixelArtBackgroundProps> = ({ darkMode }) => {
  const stars = Array.from({ length: 25 }, (_, i) => ({
    id: `star-${i}`,
    style: {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 2 + 2}s`
    }
  }));

  const birds = Array.from({ length: 3 }, (_, i) => ({
      id: `bird-${i}`,
      style: {
        top: `${10 + Math.random() * 20}%`,
        animationDelay: `${i * 4 + Math.random() * 2}s`,
        animationDuration: `${Math.random() * 8 + 10}s`
      }
  }));
  
  const clouds = Array.from({ length: 4 }, (_, i) => ({
    id: `cloud-${i}`,
    style: {
      top: `${15 + Math.random() * 30}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${i * 5 + Math.random() * 4}s`,
      animationDuration: `${Math.random() * 15 + 25}s`
    }
  }));

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {darkMode && stars.map(star => (
        <div key={star.id} className="pixel-star" style={star.style} />
      ))}
      
      {birds.map(bird => (
         <div key={bird.id} className="pixel-bird" style={bird.style} />
      ))}

      {clouds.map(cloud => (
        <div key={cloud.id} className={cn("pixel-cloud", darkMode ? "opacity-30" : "opacity-60")} style={cloud.style} />
      ))}
    </div>
  );
};

export default PixelArtBackground;
