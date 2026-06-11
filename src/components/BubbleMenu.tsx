import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export interface MenuItem {
  label: string;
  href: string;
  rotation?: number;
  hoverStyles?: { bgColor: string; textColor: string };
}

interface BubbleMenuProps {
  items: MenuItem[];
  className?: string;
}

export function BubbleMenu({ items, className = '' }: BubbleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleToggle = () => {
    const nextState = !isOpen;
    if (nextState) setShowOverlay(true);
    setIsOpen(nextState);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!overlay || !bubbles.length) return;

    if (isOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 20, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * 0.08;
        const tl = gsap.timeline({ delay });
        tl.to(bubble, { scale: 1, duration: 0.4, ease: 'back.out(1.4)' });
        if (labels[i]) {
          tl.to(labels[i], { y: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, '-=0.25');
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, { y: 20, autoAlpha: 0, duration: 0.2, ease: 'power2.in' });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setShowOverlay(false);
        }
      });
    }
  }, [isOpen, showOverlay]);

  return (
    <>
      <div className={`z-50 ${className}`}>
        <button
          type="button"
          onClick={handleToggle}
          className="w-14 h-14 rounded-full bg-white flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:scale-105 transition-transform duration-300 pointer-events-auto"
          aria-label="Toggle Menu"
          id="menu-toggle-btn"
        >
          <span className={`h-[2px] bg-black transition-all duration-300 ${isOpen ? 'w-5 translate-y-[4px] rotate-45' : 'w-5'}`} />
          <span className={`h-[2px] bg-black transition-all duration-300 ${isOpen ? 'w-5 -translate-y-[4px] -rotate-45' : 'w-3.5 self-start ml-[18px]'}`} />
        </button>
      </div>

      {showOverlay && (
        <div ref={overlayRef} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-40 flex items-center justify-center p-4">
          <ul className="flex flex-wrap gap-4 justify-center max-w-4xl list-none">
            {items.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.href}
                  className="block px-8 py-4 rounded-full bg-white text-black font-sans font-semibold text-xl md:text-3xl border border-white/10 transition-all duration-300 hover:scale-105"
                  style={{
                    transform: `rotate(${item.rotation ?? 0}deg)`,
                  }}
                  ref={(el) => { bubblesRef.current[idx] = el; }}
                  onClick={handleToggle}
                  onMouseEnter={(e) => {
                    if (item.hoverStyles) {
                      e.currentTarget.style.backgroundColor = item.hoverStyles.bgColor;
                      e.currentTarget.style.color = item.hoverStyles.textColor;
                      e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#000000';
                    e.currentTarget.style.transform = `rotate(${item.rotation ?? 0}deg)`;
                  }}
                  id={`bubble-menu-item-${idx}`}
                >
                  <span ref={(el) => { labelRefs.current[idx] = el; }} className="block">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
