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
  isHovered: boolean;
  element: HTMLAnchorElement | null;
}

const BUTTONS = [
  {
    id: 'btn-linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/yv12/',
    brandClass: 'physics-btn-linkedin',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{ flexShrink: 0 }}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: 'btn-github',
    url: 'https://github.com/yv12',
    label: 'GitHub',
    brandClass: 'physics-btn-github',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{ flexShrink: 0 }}>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
  },
  {
    id: 'btn-resume',
    label: 'Résumé',
    url: 'https://drive.google.com/file/d/1JZkzoh-SYACCPBsUqiDshAnVTsgCiWC_/view?usp=sharing',
    brandClass: 'physics-btn-resume',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ flexShrink: 0 }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  }
];

export function PhysicsButtons({ titleRef }: PhysicsButtonsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
  const bodiesRef = useRef<BodyState[]>([]);

  useEffect(() => {
    let animationFrameId: number;
    const container = containerRef.current;
    if (!container) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const isMobile = cw < 640;

    // Responsive initial physics state based on container dimensions
    const bodies: BodyState[] = BUTTONS.map((_, i) => {
      // Safe distributed starting positions that never overflow on small screens
      const defaultX = isMobile
        ? Math.min(cw - 50, Math.max(50, (cw / 4) * (i + 1)))
        : 120 + i * 160;
      const defaultY = isMobile
        ? (i === 0 ? 68 : i === 1 ? ch - 72 : 115)
        : 90 + (i % 2) * 120;

      const baseSpeed = isMobile ? 0.85 : 1.2;

      return {
        x: defaultX,
        y: defaultY,
        vx: (Math.random() > 0.5 ? 1 : -1) * (baseSpeed + Math.random() * (isMobile ? 0.3 : 0.6)),
        vy: (Math.random() > 0.5 ? 1 : -1) * (baseSpeed + Math.random() * (isMobile ? 0.3 : 0.6)),
        radius: isMobile ? 42 : 54, // Responsive approximate bounding radius
        isHovered: false,
        element: refs.current[i]
      };
    });
    bodiesRef.current = bodies;

    const update = () => {
      const currentCw = container.clientWidth;
      const currentCh = container.clientHeight;
      const mobileActive = currentCw < 640;

      const rx = mobileActive ? 46 : 62;
      const ry = mobileActive ? 18 : 24;

      // Update positions & screen boundaries
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        
        // If hovered/touched, slow down smoothly so user can easily click
        if (b.isHovered) {
          b.vx *= 0.82;
          b.vy *= 0.82;
        } else {
          b.x += b.vx;
          b.y += b.vy;

          // Minimum drift speed so bubbles stay alive
          const minV = mobileActive ? 0.45 : 0.6;
          if (Math.abs(b.vx) < minV) b.vx = b.vx >= 0 ? minV : -minV;
          if (Math.abs(b.vy) < minV) b.vy = b.vy >= 0 ? minV : -minV;
          
          // Speed limit
          const maxV = mobileActive ? 1.6 : 2.5;
          if (b.vx > maxV) b.vx = maxV;
          if (b.vx < -maxV) b.vx = -maxV;
          if (b.vy > maxV) b.vy = maxV;
          if (b.vy < -maxV) b.vy = -maxV;
        }

        // Horizontal bounce with safety margin
        if (b.x - rx < 8) { 
          b.x = rx + 8; 
          b.vx = Math.abs(b.vx); 
        } else if (b.x + rx > currentCw - 8) { 
          b.x = currentCw - rx - 8; 
          b.vx = -Math.abs(b.vx); 
        }

        // Vertical bounce with safety margin
        if (b.y - ry < 8) { 
          b.y = ry + 8; 
          b.vy = Math.abs(b.vy); 
        } else if (b.y + ry > currentCh - 8) { 
          b.y = currentCh - ry - 8; 
          b.vy = -Math.abs(b.vy); 
        }
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

          if (dist < min_dist && dist > 0.01) {
            const angle = Math.atan2(dy, dx);
            const targetX = b1.x + Math.cos(angle) * min_dist;
            const targetY = b1.y + Math.sin(angle) * min_dist;
            const ax = (targetX - b2.x) * 0.12;
            const ay = (targetY - b2.y) * 0.12;
            
            b1.vx -= ax;
            b1.vy -= ay;
            b2.vx += ax;
            b2.vy += ay;
          }
        }
      }

      // Circle-AABB collision (Title heading)
      if (titleRef.current) {
        const cRect = container.getBoundingClientRect();
        const tRect = titleRef.current.getBoundingClientRect();
        
        const padding = mobileActive ? 8 : 12;
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
          b.element.style.transform = `translate(${b.x}px, ${b.y}px) translate(-50%, -50%) ${b.isHovered ? 'scale(1.06)' : 'scale(1)'}`;
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(animationFrameId);
  }, [titleRef]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-40 pointer-events-none overflow-hidden select-none">
      {BUTTONS.map((btn, i) => (
        <a
          key={btn.id}
          ref={(el) => (refs.current[i] = el)}
          href={btn.url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => {
            if (bodiesRef.current[i]) bodiesRef.current[i].isHovered = true;
          }}
          onMouseLeave={() => {
            if (bodiesRef.current[i]) bodiesRef.current[i].isHovered = false;
          }}
          onTouchStart={() => {
            if (bodiesRef.current[i]) bodiesRef.current[i].isHovered = true;
          }}
          onTouchEnd={() => {
            if (bodiesRef.current[i]) bodiesRef.current[i].isHovered = false;
          }}
          className={`physics-bubble-btn ${btn.brandClass}`}
        >
          <span className="bubble-icon-wrap">{btn.icon}</span>
          <span className="bubble-label">{btn.label}</span>
          <span className="bubble-arrow">↗</span>
        </a>
      ))}
    </div>
  );
}
