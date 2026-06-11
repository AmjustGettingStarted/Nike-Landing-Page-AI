import { useEffect, useState } from "react";

export type ActiveSection = 1 | 2 | null;

export function useActiveSection(
  section1Id: string,
  section2Id: string,
  threshold = 0.6
): ActiveSection {
  const [active, setActive] = useState<ActiveSection>(1);

  useEffect(() => {
    const updateActiveSection = () => {
      const section1 = document.getElementById(section1Id);
      const section2 = document.getElementById(section2Id);

      if (!section1 || !section2) return;

      const viewportHeight = window.innerHeight;

      const rect1 = section1.getBoundingClientRect();
      const rect2 = section2.getBoundingClientRect();

      const visible1 =
        Math.min(rect1.bottom, viewportHeight) - Math.max(rect1.top, 0);

      const visible2 =
        Math.min(rect2.bottom, viewportHeight) - Math.max(rect2.top, 0);

      const ratio1 = Math.max(0, visible1) / viewportHeight;
      const ratio2 = Math.max(0, visible2) / viewportHeight;

      if (ratio1 >= threshold && ratio1 >= ratio2) {
        setActive(1);
      } else if (ratio2 >= threshold) {
        setActive(2);
      }
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection);
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [section1Id, section2Id, threshold]);

  return active;
}
