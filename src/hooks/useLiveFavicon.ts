import { useEffect } from "react";

/**
 * Custom hook to deliver a live, continuous rotating & pulsing favicon animation
 * across all modern desktop and mobile browsers (Chrome, Safari, Firefox, Edge).
 */
export function useLiveFavicon() {
  useEffect(() => {
    // Check for canvas support
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Find or create the primary favicon link
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/favicon.png";

    let angle = 0;
    let animId: number;
    let lastTime = 0;
    const frameInterval = 70; // ~14 FPS: fluid animation with near-zero CPU footprint

    const renderFrame = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;

      if (delta >= frameInterval) {
        lastTime = time;

        // Only render and update when tab is active and image is loaded
        if (!document.hidden && img.complete && img.naturalWidth > 0) {
          ctx.clearRect(0, 0, 32, 32);

          ctx.save();
          ctx.translate(16, 16);
          ctx.rotate((angle * Math.PI) / 180);

          // Subtle breathing scale
          const pulse = 1.0 + 0.05 * Math.sin((angle * 2 * Math.PI) / 180);
          ctx.scale(pulse, pulse);

          ctx.drawImage(img, -16, -16, 32, 32);
          ctx.restore();

          link.href = canvas.toDataURL("image/png");
          angle = (angle + 10) % 360;
        }
      }

      animId = requestAnimationFrame(renderFrame);
    };

    img.onload = () => {
      animId = requestAnimationFrame(renderFrame);
    };

    return () => {
      if (animId) cancelAnimationFrame(animId);
      // Reset to default static favicon on unmount
      if (link) {
        link.href = "/favicon.png";
      }
    };
  }, []);
}
