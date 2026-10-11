import React, { useRef, useEffect, useCallback } from 'react';

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: string;
  extraScale?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor = '#e8eb14',
  sparkSize = 28,
  sparkRadius = 70,
  sparkCount = 9,
  duration = 700,
  easing = 'ease-out',
  extraScale = 1.0,
  children,
  className,
  style
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animationRef = useRef<number | null>(null);
  const drawRef = useRef<(timestamp: number) => void>(() => {});

  // Performance: the spark canvas used to cover the whole page (thousands of pixels tall) and was
  // cleared and redrawn on every animation frame even with no sparks. It now covers only the viewport
  // (position: fixed), follows the page while sparks are alive, and the draw loop runs only while
  // there are sparks to draw. Sparks look and move exactly as before.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeTimeout: any;

    const resizeCanvas = () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case 'linear':
          return t;
        case 'ease-in':
          return t * t;
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t); // ease-out
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sparks are stored relative to the page container, so they scroll with the page as before.
      const container = containerRef.current;
      const rect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };

      sparksRef.current = sparksRef.current.filter(spark => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const cx = spark.x + rect.left;
        const cy = spark.y + rect.top;
        const x1 = cx + distance * Math.cos(spark.angle);
        const y1 = cy + distance * Math.sin(spark.angle);
        const x2 = cx + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = cy + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationRef.current = sparksRef.current.length > 0 ? requestAnimationFrame(draw) : null;
    };

    drawRef.current = draw;

    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easeFunc, extraScale]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = performance.now();
    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now
    }));

    sparksRef.current.push(...newSparks);
    if (animationRef.current === null) {
      animationRef.current = requestAnimationFrame(drawRef.current);
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style
      }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          userSelect: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99999 // Ensure sparks render on top of backgrounds but allow interaction below
        }}
      />
      {children}
    </div>
  );
};

export default ClickSpark;
