
import { useEffect, useRef } from 'react';

export const MetaHumanBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Cosmic particles animation
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    // Meta human silhouette points
    const humanPoints: Array<{ x: number; y: number; pulse: number }> = [];
    
    // Initialize particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: `hsl(${Math.random() * 60 + 240}, 70%, 60%)`
      });
    }

    // Initialize meta human silhouette
    const centerX = canvas.width * 0.5;
    const centerY = canvas.height * 0.5;
    
    // Create human-like silhouette points
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      const radius = 80 + Math.sin(angle * 3) * 20;
      humanPoints.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius * 1.5,
        pulse: Math.random() * Math.PI * 2
      });
    }

    let animationFrame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animationFrame++;

      // Update and draw cosmic particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('60%)', `${particle.opacity})`);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const distance = Math.sqrt(
            Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
          );
          
          if (distance < 100) {
            const opacity = (1 - distance / 100) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      // Draw meta human silhouette with pulsing effect
      const currentCenterX = canvas.width * 0.5;
      const currentCenterY = canvas.height * 0.5;
      
      humanPoints.forEach((point, i) => {
        point.pulse += 0.05;
        const pulseIntensity = Math.sin(point.pulse) * 0.3 + 0.7;
        
        // Update position relative to current center
        const angle = (i / humanPoints.length) * Math.PI * 2;
        const radius = (80 + Math.sin(angle * 3) * 20) * pulseIntensity;
        point.x = currentCenterX + Math.cos(angle) * radius;
        point.y = currentCenterY + Math.sin(angle) * radius * 1.5;

        // Draw glowing point
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 10);
        gradient.addColorStop(0, `rgba(139, 92, 246, ${pulseIntensity})`);
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8 * pulseIntensity, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Connect human points to form silhouette
      ctx.beginPath();
      humanPoints.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.closePath();
      ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 + Math.sin(animationFrame * 0.02) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add central glow
      const centralGlow = ctx.createRadialGradient(
        currentCenterX, currentCenterY, 0,
        currentCenterX, currentCenterY, 150
      );
      centralGlow.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
      centralGlow.addColorStop(1, 'rgba(139, 92, 246, 0)');
      
      ctx.beginPath();
      ctx.arc(currentCenterX, currentCenterY, 150, 0, Math.PI * 2);
      ctx.fillStyle = centralGlow;
      ctx.fill();

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      style={{ background: 'transparent' }}
    />
  );
};
