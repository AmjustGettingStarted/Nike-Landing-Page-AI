import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ScrollTransitionState {
  progress: number; // 0–1 across the transition zone
  isTransitioning: boolean;
}

interface ScrollTransitionOptions {
  section1Id: string;
  section2Id: string;
  transitionStart?: number; // 0–1, default 0.6
}

gsap.registerPlugin(ScrollTrigger);

export function useScrollTransition({
  section1Id,
  section2Id,
  transitionStart = 0.6,
}: ScrollTransitionOptions): ScrollTransitionState {
  const [state, setState] = useState<ScrollTransitionState>({
    progress: 0,
    isTransitioning: false,
  });

  useEffect(() => {
    const section1 = document.getElementById(section1Id);
    const section2 = document.getElementById(section2Id);
    if (!section1 || !section2) return;

    // Create a ScrollTrigger that spans from the transition start
    // through the end of section 1 into section 2
    const st = ScrollTrigger.create({
      trigger: section1,
      start: 'top top',
      end: () => `+=${section1.offsetHeight * 0.6}`, // transition zone is the last 40% of section 1
      scrub: 1,
      onUpdate: (self) => {
        // self.progress goes 0→1 across the pin span
        // We want progress 0 at transitionStart (60% through pin) and 1 at end
        const rawProgress = self.progress;
        if (rawProgress < transitionStart) {
          setState({ progress: 0, isTransitioning: false });
        } else {
          const mapped = (rawProgress - transitionStart) / (1 - transitionStart);
          setState({
            progress: Math.min(1, Math.max(0, mapped)),
            isTransitioning: true,
          });
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [section1Id, section2Id, transitionStart]);

  return state;
}