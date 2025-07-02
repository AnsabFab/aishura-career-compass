
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

    // Enhanced MetaHuman animation with sophisticated visuals
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      phase: number;
    }> = [];

    // MetaHuman silhouette with detailed structure
    const humanPoints: Array<{ 
      x: number; 
      y: number; 
      pulse: number; 
      intensity: number;
      connectionStrength: number;
    }> = [];
    
    // Neural network connections
    const neuralConnections: Array<{
      start: number;
      end: number;
      strength: number;
      pulse: number;
    }> = [];

    // Initialize cosmic particles with enhanced properties
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        color: `hsl(${Math.random() * 120 + 240}, 80%, 70%)`,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Create sophisticated MetaHuman silhouette
    const centerX = canvas.width * 0.5;
    const centerY = canvas.height * 0.5;
    
    // Head outline
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const radius = 80 + Math.sin(angle * 2) * 15;
      humanPoints.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY - 100 + Math.sin(angle) * radius * 0.8,
        pulse: Math.random() * Math.PI * 2,
        intensity: 0.8 + Math.random() * 0.4,
        connectionStrength: Math.random()
      });
    }

    // Body structure
    for (let i = 0; i < 40; i++) {
      const progress = i / 40;
      const bodyWidth = 60 - progress * 20;
      const side = i % 2 === 0 ? -1 : 1;
      humanPoints.push({
        x: centerX + side * bodyWidth,
        y: centerY + progress * 200,
        pulse: Math.random() * Math.PI * 2,
        intensity: 0.6 + Math.random() * 0.4,
        connectionStrength: Math.random()
      });
    }

    // Neural connections between points
    for (let i = 0; i < humanPoints.length; i++) {
      for (let j = i + 1; j < humanPoints.length; j++) {
        const distance = Math.sqrt(
          Math.pow(humanPoints[i].x - humanPoints[j].x, 2) + 
          Math.pow(humanPoints[i].y - humanPoints[j].y, 2)
        );
        
        if (distance < 120 && Math.random() > 0.7) {
          neuralConnections.push({
            start: i,
            end: j,
            strength: Math.random() * 0.5 + 0.3,
            pulse: Math.random() * Math.PI * 2
          });
        }
      }
    }

    let animationFrame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animationFrame++;

      // Update and draw enhanced cosmic particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.phase += 0.02;

        // Advanced wrapping with smooth transitions
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;

        // Dynamic size and opacity based on phase
        const dynamicSize = particle.size * (1 + Math.sin(particle.phase) * 0.3);
        const dynamicOpacity = particle.opacity * (0.7 + Math.sin(particle.phase * 0.5) * 0.3);

        // Draw particle with glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, dynamicSize * 3
        );
        gradient.addColorStop(0, particle.color.replace('70%)', `${dynamicOpacity})`));
        gradient.addColorStop(1, particle.color.replace('70%)', '0)'));
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, dynamicSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, dynamicSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('70%)', `${dynamicOpacity * 1.5})`);
        ctx.fill();

        // Advanced particle connections
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const distance = Math.sqrt(
            Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
          );
          
          if (distance < 150) {
            const connectionOpacity = (1 - distance / 150) * 0.4;
            const connectionGradient = ctx.createLinearGradient(
              particle.x, particle.y, other.x, other.y
            );
            connectionGradient.addColorStop(0, `rgba(139, 92, 246, ${connectionOpacity})`);
            connectionGradient.addColorStop(0.5, `rgba(236, 72, 153, ${connectionOpacity * 1.5})`);
            connectionGradient.addColorStop(1, `rgba(6, 182, 212, ${connectionOpacity})`);
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = connectionGradient;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      });

      // Draw enhanced MetaHuman with neural network
      const currentCenterX = canvas.width * 0.5;
      const currentCenterY = canvas.height * 0.5;
      
      // Update MetaHuman points with sophisticated animation
      humanPoints.forEach((point, i) => {
        point.pulse += 0.03;
        const pulseIntensity = Math.sin(point.pulse) * 0.4 + 0.8;
        
        // Dynamic positioning with breath-like movement
        const breathOffset = Math.sin(animationFrame * 0.01) * 5;
        const angle = (i / humanPoints.length) * Math.PI * 2;
        const isHead = i < 30;
        
        if (isHead) {
          const radius = (80 + Math.sin(angle * 2) * 15) * pulseIntensity;
          point.x = currentCenterX + Math.cos(angle) * radius + breathOffset;
          point.y = currentCenterY - 100 + Math.sin(angle) * radius * 0.8 + breathOffset * 0.5;
        } else {
          const progress = (i - 30) / 40;
          const bodyWidth = (60 - progress * 20) * pulseIntensity;
          const side = i % 2 === 0 ? -1 : 1;
          point.x = currentCenterX + side * bodyWidth + breathOffset * 0.3;
          point.y = currentCenterY + progress * 200 + breathOffset * 0.2;
        }

        // Enhanced glowing points with multiple layers
        const mainGradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 20);
        mainGradient.addColorStop(0, `rgba(139, 92, 246, ${pulseIntensity * point.intensity})`);
        mainGradient.addColorStop(0.3, `rgba(236, 72, 153, ${pulseIntensity * 0.8})`);
        mainGradient.addColorStop(0.7, `rgba(6, 182, 212, ${pulseIntensity * 0.6})`);
        mainGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, 15 * pulseIntensity, 0, Math.PI * 2);
        ctx.fillStyle = mainGradient;
        ctx.fill();

        // Inner core
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5 * pulseIntensity, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${pulseIntensity * 0.9})`;
        ctx.fill();
      });

      // Draw neural connections with dynamic pulses
      neuralConnections.forEach(connection => {
        connection.pulse += 0.04;
        const startPoint = humanPoints[connection.start];
        const endPoint = humanPoints[connection.end];
        
        if (!startPoint || !endPoint) return;

        const pulseStrength = Math.sin(connection.pulse) * 0.5 + 0.5;
        const connectionOpacity = connection.strength * pulseStrength;

        // Create gradient along the connection
        const connectionGradient = ctx.createLinearGradient(
          startPoint.x, startPoint.y, endPoint.x, endPoint.y
        );
        connectionGradient.addColorStop(0, `rgba(139, 92, 246, ${connectionOpacity})`);
        connectionGradient.addColorStop(0.5, `rgba(236, 72, 153, ${connectionOpacity * 1.2})`);
        connectionGradient.addColorStop(1, `rgba(6, 182, 212, ${connectionOpacity})`);

        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.strokeStyle = connectionGradient;
        ctx.lineWidth = 3 * pulseStrength;
        ctx.stroke();

        // Add moving energy pulses along connections
        if (Math.random() > 0.95) {
          const progress = Math.random();
          const pulseX = startPoint.x + (endPoint.x - startPoint.x) * progress;
          const pulseY = startPoint.y + (endPoint.y - startPoint.y) * progress;
          
          const energyGradient = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 10);
          energyGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          energyGradient.addColorStop(1, 'rgba(139, 92, 246, 0.3)');
          
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 8, 0, Math.PI * 2);
          ctx.fillStyle = energyGradient;
          ctx.fill();
        }
      });

      // Add central consciousness core
      const coreRadius = 40 + Math.sin(animationFrame * 0.02) * 10;
      const coreGradient = ctx.createRadialGradient(
        currentCenterX, currentCenterY - 50, 0,
        currentCenterX, currentCenterY - 50, coreRadius
      );
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      coreGradient.addColorStop(0.3, 'rgba(139, 92, 246, 0.6)');
      coreGradient.addColorStop(0.6, 'rgba(236, 72, 153, 0.4)');
      coreGradient.addColorStop(1, 'rgba(6, 182, 212, 0.2)');
      
      ctx.beginPath();
      ctx.arc(currentCenterX, currentCenterY - 50, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Add rotating energy rings around consciousness core
      for (let ring = 0; ring < 3; ring++) {
        const ringRadius = 60 + ring * 20;
        const ringRotation = animationFrame * 0.01 * (ring + 1);
        
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + ringRotation;
          const ringX = currentCenterX + Math.cos(angle) * ringRadius;
          const ringY = currentCenterY - 50 + Math.sin(angle) * ringRadius * 0.3;
          
          const ringGradient = ctx.createRadialGradient(ringX, ringY, 0, ringX, ringY, 5);
          ringGradient.addColorStop(0, `rgba(139, 92, 246, 0.8)`);
          ringGradient.addColorStop(1, `rgba(139, 92, 246, 0)`);
          
          ctx.beginPath();
          ctx.arc(ringX, ringY, 4, 0, Math.PI * 2);
          ctx.fillStyle = ringGradient;
          ctx.fill();
        }
      }

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
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
      style={{ background: 'transparent' }}
    />
  );
};
