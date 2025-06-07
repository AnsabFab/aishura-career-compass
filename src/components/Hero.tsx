
import { VideoHero } from '@/components/VideoHero';
import { FeatureCards } from '@/components/FeatureCards';

interface HeroProps {
  onAuthClick: () => void;
}

export const Hero = ({ onAuthClick }: HeroProps) => {
  return (
    <div className="relative">
      <VideoHero onAuthClick={onAuthClick} />
      <FeatureCards />
    </div>
  );
};
