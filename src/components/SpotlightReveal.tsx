import { useEffect, useRef } from "react";

interface SpotlightRevealProps {
  imageSrc: string;
  videoSrc: string;
  isPlaying?: boolean;
  baseRadius?: number;
  maskId: string;
  /** When false, the spotlight mask is fully open (no cursor tracking) */
  active?: boolean;
  /** Override the computed radius (used by scroll transitions) */
  radiusOverride?: number;
  /** Opacity of the entire reveal layer (used for crossfade transitions) */
  layerOpacity?: number;
}

export function SpotlightReveal({
  imageSrc,
  videoSrc,
  isPlaying = false,
  baseRadius = 380,
  maskId,
  active = true,
  radiusOverride,
  layerOpacity = 1,
}: SpotlightRevealProps) {
  const NUM_TRAILS = 6;
  const videoRef = useRef<HTMLVideoElement>(null);
  const pointsRef = useRef(
    Array.from({ length: NUM_TRAILS }, () => ({ x: -2000, y: -2000 }))
  );
  const targetRef = useRef({ x: -2000, y: -2000 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => {
        // Handle auto-play browser security block smoothly
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!active) return; // skip cursor tracking when dormant

    // Initial center sizing setup safely
    targetRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        targetRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    let animationFrameId: number;
    const animate = () => {
      const points = pointsRef.current;

      // Interpolate leading anchor element with exponential easing
      points[0].x += (targetRef.current.x - points[0].x) * 0.2;
      points[0].y += (targetRef.current.y - points[0].y) * 0.2;

      // Propagate downstream physics layers for the trailing lag
      for (let i = 1; i < points.length; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * 0.35;
        points[i].y += (points[i - 1].y - points[i].y) * 0.35;
      }

      // Draw positions straight into the DOM elements safely for 60/120fps performance without triggering React re-renders
      for (let i = 0; i < points.length; i++) {
        const circle = document.getElementById(`${maskId}-trail-${i}`);
        if (circle) {
          circle.setAttribute("cx", points[i].x.toString());
          circle.setAttribute("cy", points[i].y.toString());
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [maskId, active]);

  // Compute effective radius: use override if provided, otherwise base - offset
  const effectiveRadius = (i: number) => {
    const base = radiusOverride ?? baseRadius;
    return Math.max(10, base - i * 40);
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-brand-dark pointer-events-none overflow-hidden select-none"
      id={`spotlight-container-${maskId}`}
      style={{ opacity: layerOpacity }}
    >
      {/* Video Foundation Layer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          muted
          loop
          playsInline
        />
      </div>

      {/* Structural SVG Mask Composite Layer */}
      <svg
        className="absolute inset-0 w-full h-full mix-blend-normal"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`${maskId}-gradient`}>
            <stop offset="0%" stopColor="black" stopOpacity="1" />
            <stop offset="55%" stopColor="black" stopOpacity="0.85" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>
          <mask
            id={maskId}
            maskContentUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="100%"
            height="100%"
          >
            <rect width="100%" height="100%" fill="white" />
            {Array.from({ length: NUM_TRAILS })
              .reverse()
              .map((_, revIdx) => {
                const i = NUM_TRAILS - 1 - revIdx;
                return (
                  <circle
                    key={`trail-${i}`}
                    id={`${maskId}-trail-${i}`}
                    cx="-2000"
                    cy="-2000"
                    r={effectiveRadius(i)}
                    fill={`url(#${maskId}-gradient)`}
                    opacity={1 - i * 0.12}
                  />
                );
              })}
          </mask>
        </defs>
        <image
          href={imageSrc}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  );
}
