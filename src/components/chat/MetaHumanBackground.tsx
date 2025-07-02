
import React, { useEffect, useRef } from 'react';

export const MetaHumanBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system for neural network effect
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.8 + 0.2,
        color: ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b'][Math.floor(Math.random() * 4)]
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections between particles
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (150 - distance) / 150 * 0.3;
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach(particle => {
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        // Pulse effect
        particle.alpha = 0.3 + Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.3;
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900" />
      
      {/* MetaHuman Avatar */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Animated Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse scale-150" />
          
          {/* AI Avatar */}
          <div className="relative w-96 h-96 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
            <img 
              src="/lovable-uploads/62397bd5-a6ce-4725-b678-ce929bb028b5.png"
              alt="AI MetaHuman"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-cyan-900/40" />
          </div>

          {/* Floating Orbs */}
          <div className="absolute -top-8 -left-8 w-6 h-6 bg-purple-500 rounded-full animate-bounce opacity-80" />
          <div className="absolute -bottom-8 -right-8 w-4 h-4 bg-cyan-500 rounded-full animate-pulse opacity-80" />
          <div className="absolute top-1/2 -left-12 w-3 h-3 bg-pink-500 rounded-full animate-ping opacity-60" />
          <div className="absolute top-1/4 -right-10 w-5 h-5 bg-yellow-500 rounded-full animate-bounce opacity-70" />
        </div>
      </div>

      {/* Neural Network Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-60"
      />

      {/* Holographic Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>
    </div>
  );
};
