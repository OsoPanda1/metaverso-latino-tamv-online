import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  shape: 'circle' | 'square' | 'triangle' | 'hexagon';
}

export const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 80;
    let morphTimer = 0;
    let currentShape: 'circle' | 'square' | 'triangle' | 'hexagon' = 'circle';

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random() * 100,
        maxLife: 100,
        size: Math.random() * 3 + 1,
        shape: currentShape
      });
    }

    const drawParticle = (p: Particle) => {
      const alpha = p.life / p.maxLife;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      gradient.addColorStop(0, `hsla(190, 95%, 55%, ${alpha * 0.8})`);
      gradient.addColorStop(0.5, `hsla(210, 90%, 60%, ${alpha * 0.4})`);
      gradient.addColorStop(1, `hsla(260, 80%, 65%, ${alpha * 0.1})`);

      ctx.fillStyle = gradient;
      ctx.strokeStyle = `hsla(190, 95%, 55%, ${alpha * 0.6})`;
      ctx.lineWidth = 1;

      ctx.beginPath();
      switch (p.shape) {
        case 'circle':
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          break;
        case 'square':
          ctx.rect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
          break;
        case 'triangle':
          ctx.moveTo(p.x, p.y - p.size);
          ctx.lineTo(p.x + p.size, p.y + p.size);
          ctx.lineTo(p.x - p.size, p.y + p.size);
          ctx.closePath();
          break;
        case 'hexagon':
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = p.x + p.size * Math.cos(angle);
            const y = p.y + p.size * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          break;
      }
      ctx.fill();
      ctx.stroke();
    };

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const alpha = (1 - distance / 150) * 0.3 * (particles[i].life / particles[i].maxLife);
            ctx.strokeStyle = `hsla(190, 95%, 55%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(8, 20, 30, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      morphTimer++;
      if (morphTimer > 300) {
        morphTimer = 0;
        const shapes: Array<'circle' | 'square' | 'triangle' | 'hexagon'> = ['circle', 'square', 'triangle', 'hexagon'];
        currentShape = shapes[Math.floor(Math.random() * shapes.length)];
      }

      particles.forEach((p, index) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Smoothly morph shapes
        if (morphTimer < 60 && p.shape !== currentShape) {
          p.shape = currentShape;
        }

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Keep within bounds
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        // Update life
        p.life -= 0.3;
        if (p.life <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.vx = (Math.random() - 0.5) * 2;
          p.vy = (Math.random() - 0.5) * 2;
          p.life = p.maxLife;
          p.size = Math.random() * 3 + 1;
        }

        drawParticle(p);
      });

      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'linear-gradient(180deg, hsl(220 25% 10%), hsl(220 30% 6%))' }}
    />
  );
};
