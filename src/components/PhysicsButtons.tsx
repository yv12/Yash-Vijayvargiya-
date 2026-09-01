import { useEffect, useRef } from 'react';

interface PhysicsButtonsProps {
  titleRef: React.RefObject<HTMLHeadingElement>;
}

interface BodyState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  element: HTMLAnchorElement | null;
}

const BUTTONS = [
  {
    id: 'btn-linkedin',
    label: 'LinkedIn ↗',
    url: 'https://www.linkedin.com/in/yv12/',
    className: 'bg-ink text-paper px-5 py-2.5 rounded-full font-mono text-[14px] font-bold shadow-2xl hover:scale-110 hover:shadow-xl transition-all'
  },
  {
    id: 'btn-github',
    label: 'GitHub ↗',
    url: 'https://github.com/yv12',
    className: 'bg-blue-700 text-white px-5 py-2.5 rounded-full font-mono text-[14px] font-bold shadow-2xl hover:scale-110 hover:shadow-xl transition-all'
  },
  {
    id: 'btn-resume',
    label: 'Resume ↗',
    url: 'https://drive.google.com/file/d/1JZkzoh-SYACCPBsUqiDshAnVTsgCiWC_/view?usp=sharing',
    className: 'bg-[#A33726] text-white px-5 py-2.5 rounded-full font-mono text-[14px] font-bold shadow-2xl hover:scale-110 hover:shadow-xl transition-all'
  }
];

export function PhysicsButtons({ titleRef }: PhysicsButtonsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    let animationFrameId: number;
    const container = containerRef.current;
    if (!container) return;

    // Initialize physics state
    const bodies: BodyState[] = BUTTONS.map((_, i) => ({
      x: 100 + i * 150,
      y: 100 + (i % 2) * 150,
      vx: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random()),
      vy: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random()),
      radius: 50, // Approximate bounding radius
      element: refs.current[i]
    }));

    const update = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;

      // Update positions & screen boundaries
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        b.x += b.vx;
        b.y += b.vy;

        // Ensure minimum speed so they don't stop
        if (Math.abs(b.vx) < 0.5) b.vx = b.vx > 0 ? 0.5 : -0.5;
        if (Math.abs(b.vy) < 0.5) b.vy = b.vy > 0 ? 0.5 : -0.5;
        
        // Speed limit
        const maxV = 3;
        if (b.vx > maxV) b.vx = maxV;
        if (b.vx < -maxV) b.vx = -maxV;
        if (b.vy > maxV) b.vy = maxV;
        if (b.vy < -maxV) b.vy = -maxV;

        if (b.x - b.radius < 0) { b.x = b.radius; b.vx *= -1; }
        if (b.x + b.radius > cw) { b.x = cw - b.radius; b.vx *= -1; }
        if (b.y - b.radius < 0) { b.y = b.radius; b.vy *= -1; }
        if (b.y + b.radius > ch) { b.y = ch - b.radius; b.vy *= -1; }
      }

      // Circle-Circle collisions
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const b1 = bodies[i];
          const b2 = bodies[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const min_dist = b1.radius + b2.radius;

          if (dist < min_dist) {
            // Simple elastic collision
            const angle = Math.atan2(dy, dx);
            const targetX = b1.x + Math.cos(angle) * min_dist;
            const targetY = b1.y + Math.sin(angle) * min_dist;
            const ax = (targetX - b2.x) * 0.1;
            const ay = (targetY - b2.y) * 0.1;
            
            b1.vx -= ax;
            b1.vy -= ay;
            b2.vx += ax;
            b2.vy += ay;
          }
        }
      }

      // Circle-AABB collision (Title)
      if (titleRef.current) {
        const cRect = container.getBoundingClientRect();
        const tRect = titleRef.current.getBoundingClientRect();
        
        // Expand the title box slightly for better visual bounding
        const padding = 10;
        const titleBox = {
          left: (tRect.left - cRect.left) - padding,
          right: (tRect.right - cRect.left) + padding,
          top: (tRect.top - cRect.top) - padding,
          bottom: (tRect.bottom - cRect.top) + padding
        };

        for (let i = 0; i < bodies.length; i++) {
          const b = bodies[i];
          
          const closestX = Math.max(titleBox.left, Math.min(b.x, titleBox.right));
          const closestY = Math.max(titleBox.top, Math.min(b.y, titleBox.bottom));
          
          const dx = b.x - closestX;
          const dy = b.y - closestY;
          const distSq = dx * dx + dy * dy;

          if (distSq < b.radius * b.radius) {
            const dist = Math.sqrt(distSq);
            if (dist === 0) continue; 
            
            const overlap = b.radius - dist;
            const nx = dx / dist;
            const ny = dy / dist;
            
            b.x += nx * overlap;
            b.y += ny * overlap;

            // Reflect velocity
            const dotProduct = (b.vx * nx + b.vy * ny);
            b.vx = b.vx - 2 * dotProduct * nx;
            b.vy = b.vy - 2 * dotProduct * ny;
          }
        }
      }

      // Apply transforms
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        if (b.element) {
          b.element.style.transform = `translate(${b.x}px, ${b.y}px) translate(-50%, -50%)`;
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(animationFrameId);
  }, [titleRef]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
      {BUTTONS.map((btn, i) => (
        <a
          key={btn.id}
          ref={(el) => (refs.current[i] = el)}
          href={btn.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute top-0 left-0 pointer-events-auto ${btn.className}`}
        >
          {btn.label}
        </a>
      ))}
    </div>
  );
}
