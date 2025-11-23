import { useEffect, useRef } from 'react';

export const QuantumLoader = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 200;

    let angle = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Efecto cuántico de capas
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle + i * Math.PI / 2);
        
        const gradient = ctx.createLinearGradient(-50, -50, 50, 50);
        gradient.addColorStop(0, `hsla(${180 + i * 30}, 80%, 60%, ${0.3 - i * 0.05})`);
        gradient.addColorStop(1, `hsla(${200 + i * 30}, 80%, 70%, ${0.1 - i * 0.02})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 30 + i * 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      
      angle += 0.02;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} className="opacity-80" />
    </div>
  );
};
