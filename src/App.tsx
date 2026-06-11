import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BubbleMenu, MenuItem } from "./components/BubbleMenu";
import { SpotlightReveal } from "./components/SpotlightReveal";
import { IntroGate } from "./components/IntroGate";
import { useActiveSection } from "./hooks/useActiveSection";
import vid1 from "@/assets/video/video1.webm";
import vid2 from "@/assets/video/video2.mp4";

export default function App() {
  const [playFirst, setPlayFirst] = useState(false);
  const [playSecond, setPlaySecond] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [introExiting, setIntroExiting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [introChecked, setIntroChecked] = useState(false);

  useEffect(() => {
    const introSeen = sessionStorage.getItem("introSeen");

    if (introSeen) {
      setIntroComplete(true);
      setShowContent(true);
    }

    setIntroChecked(true);
  }, []);

  const activeSection = useActiveSection(
    "section-running-concept",
    "section-aerospace-performance",
    0.6
  );
  const isSection1Active = activeSection === 1 && introComplete;
  const isSection2Active = activeSection === 2 && introComplete;

  const menuItems: MenuItem[] = [
    {
      label: "Drops",
      href: "#",
      rotation: -6,
      hoverStyles: { bgColor: "#DA3A16", textColor: "#ffffff" },
    },
    {
      label: "Innovation",
      href: "#",
      rotation: 4,
      hoverStyles: { bgColor: "#3b82f6", textColor: "#ffffff" },
    },
    {
      label: "Collections",
      href: "#",
      rotation: -4,
      hoverStyles: { bgColor: "#10b981", textColor: "#ffffff" },
    },
    {
      label: "Community",
      href: "#",
      rotation: 6,
      hoverStyles: { bgColor: "#f59e0b", textColor: "#ffffff" },
    },
    {
      label: "Labs",
      href: "#",
      rotation: -3,
      hoverStyles: { bgColor: "#8b5cf6", textColor: "#ffffff" },
    },
  ];

  const handleIntroExitStart = () => {
    setIntroExiting(true);
  };

  const handleIntroComplete = () => {
    sessionStorage.setItem("introSeen", "true");

    setIntroComplete(true);

    // Slight delay for the hero emergence animation
    setTimeout(() => setShowContent(true), 100);
  };

  console.log({
    activeSection,
    introComplete,
    isSection1Active,
    isSection2Active,
  });

  return (
    <>
      {/* PHASE 1: Intro Gate - covers entire viewport until video completes */}
      {introChecked && !introComplete && (
        <IntroGate
          onExitStart={handleIntroExitStart}
          onComplete={handleIntroComplete}
        />
      )}
      {/* Main content - emerges from behind the intro */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="relative w-full flex flex-col bg-brand-dark overflow-x-hidden select-none font-sans"
            id="app-viewport-container"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                duration: 1.2,
                ease: [0.45, 0, 0.1, 1],
                delay: introComplete ? 0 : 0,
              },
            }}
          >
            {/* SECTION 1: THE RUNNING CONCEPT */}
            <section
              className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-between active:cursor-grabbing"
              onMouseEnter={() => isSection1Active && setPlayFirst(true)}
              onMouseLeave={() => setPlayFirst(false)}
              id="section-running-concept"
            >
              <SpotlightReveal
                maskId="mask-one"
                imageSrc="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=2000&q=90"
                videoSrc={vid1}
                isPlaying={playFirst}
                baseRadius={380}
                active={isSection1Active}
              />

              <header
                className="relative z-50 w-full flex justify-between items-center px-6 md:px-12 pt-8 pointer-events-none"
                id="section-one-header"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-white font-sans font-bold tracking-widest text-xs md:text-sm uppercase"
                >
                  NIKE // LAB
                </motion.div>
                <BubbleMenu items={menuItems} className="pointer-events-auto" />
              </header>

              {/* Global Scaled Vector Brand Centerpiece */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-[22%] left-1/2 -translate-x-1/2 z-10 w-full max-w-[280px] md:max-w-[440px] pointer-events-none"
                id="nike-swoosh-container"
              >
                <svg
                  viewBox="135.5 361.38 420.32 149.8"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
                >
                  <path d="m181.86 511.11c-12.524-0.49755-22.77-3.9244-30.782-10.289-1.529-1.2159-5.1725-4.8616-6.3949-6.3992-3.2489-4.0853-5.4578-8.0611-6.931-12.472-4.5334-13.579-2.2002-31.397 6.6737-50.953 7.5979-16.742 19.322-33.347 39.776-56.344 3.013-3.384 11.986-13.281 12.043-13.281 0.0216 0-0.46749 0.84706-1.083 1.8786-5.3183 8.9082-9.8689 19.401-12.348 28.485-3.9823 14.576-3.502 27.085 1.4068 36.784 3.3862 6.6822 9.1913 12.47 15.719 15.67 11.428 5.5993 28.159 6.0625 48.592 1.3554 1.4068-0.32599 71.116-18.831 154.91-41.123 83.794-22.294 152.36-40.52 152.37-40.505 0.0237 0.0193-194.68 83.333-295.75 126.56-16.007 6.8431-20.287 8.5715-27.812 11.214-19.236 6.7551-36.467 9.9783-50.396 9.4251z" />
                </svg>
              </motion.div>

              <main
                className="relative z-30 w-full flex flex-col items-center justify-end pb-12 md:pb-20 px-6 text-center text-white pointer-events-none"
                id="section-one-main"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.2,
                  }}
                  className="font-sans leading-[1.1] tracking-tight max-w-5xl mx-auto uppercase"
                  style={{ fontSize: "clamp(20px, 4vw, 56px)" }}
                >
                  <span className="block text-white/60 font-light tracking-wider mb-2">
                    Pure Comfort For
                  </span>
                  <span className="block font-extrabold tracking-tight">
                    Next-Generation Athletes.{" "}
                    <span className="font-serif italic font-normal lowercase text-brand-orange pr-2 block md:inline-block">
                      We craft
                    </span>
                  </span>
                  <span className="block font-serif italic font-normal normal-case text-white/95 mt-1">
                    the ultimate footwear for elite performance,
                  </span>
                  <span className="block font-serif italic font-normal normal-case text-white/95">
                    urban exploration, and raw style.
                  </span>
                </motion.h1>

                {/* Indicator label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="mt-12 text-xs font-mono tracking-widest uppercase flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                  Hover to Reveal Motion // Scroll for Spec
                </motion.div>
              </main>
            </section>

            {/* SECTION 2: AEROSPACE PERFORMANCE */}
            {/* <section
              className="relative w-full h-[100dvh] overflow-hidden bg-black text-white flex flex-col justify-between p-6 md:p-12"
              onMouseEnter={() => isSection2Active && setPlaySecond(true)}
              onMouseLeave={() => setPlaySecond(false)}
              id="section-aerospace-performance"
            >
              <SpotlightReveal
                maskId="mask-two"
                imageSrc="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=2000&q=90"
                videoSrc={vid2}
                isPlaying={playSecond}
                baseRadius={460}
                active={isSection2Active}
              />

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute left-6 md:left-20 top-[12%] md:top-[15%] z-30 w-[300px] md:w-[360px] p-6 rounded-xl border border-white/10 bg-[#050505]/45 backdrop-blur-[80px] pointer-events-none shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
                id="telemetry-display-panel"
              >
                <div className="flex items-end justify-between mb-4">
                  <span className="font-serif italic text-brand-orange text-6xl md:text-7xl font-bold leading-none tracking-tighter">
                    78%
                  </span>
                  <div className="w-[140px] h-[55px] opacity-90">
                    <svg
                      viewBox="0 0 289 138"
                      className="w-full h-full"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.5 48.7306C39.7833 48.7306 49.34 54.94 63.1667 69.2965C76.9933 83.653 86.55 110.5 103.833 110.5C121.117 110.5 130.673 84.2876 144.5 59.2856C158.327 34.2837 167.883 19.5573 185.167 19.5573C202.45 19.5573 208.55 57.6673 225.833 57.6673C243.117 57.6673 249.217 19.5 266.5 19.5"
                        stroke="#DA3A16"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="font-sans font-bold text-white text-xs tracking-widest uppercase mb-1">
                  NEXT-GEN CUSHIONING ARCHITECTURE
                </h3>
                <p className="font-sans text-white/50 text-[11px] leading-relaxed">
                  Impact Absorption & Energy Return Dynamics Matrix
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 flex gap-4 text-[10px] font-mono text-white/40">
                  <div>
                    <span className="block text-brand-orange font-bold uppercase">
                      SPEED VECTORS
                    </span>
                    <span className="text-white font-medium">
                      9.81 M/S² ACTIVE
                    </span>
                  </div>
                  <div>
                    <span className="block text-brand-orange font-bold uppercase">
                      THERMO-FIT
                    </span>
                    <span className="text-white font-medium">
                      OPTIMIZED 34°C
                    </span>
                  </div>
                </div>
              </motion.div>

              <div className="absolute left-6 md:left-20 bottom-[12%] md:bottom-[15%] z-30 max-w-xl pointer-events-none">
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-[32px] md:text-[56px] leading-[1.05] tracking-tight flex flex-col uppercase font-sans font-black"
                >
                  <span className="text-white/40 font-light">
                    Aerospace-Grade
                  </span>
                  <span>Infrastructure</span>
                  <span className="font-serif font-normal text-brand-orange normal-case italic mt-2 tracking-normal">
                    Directly to urban culture.
                  </span>
                </motion.h2>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute right-6 md:right-20 bottom-[12%] md:bottom-[15%] z-30 flex flex-col items-center pointer-events-none"
              >
                <div className="bg-white text-black text-[9px] font-bold tracking-widest uppercase px-6 py-3 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                  THE SCIENCE OF IMPACT CONTROL
                </div>
                <div className="bg-brand-orange w-[168px] h-[86px] flex justify-center items-center shadow-[0_15px_30px_rgba(218,58,22,0.3)] transition-transform duration-300 hover:scale-102">
                  <svg
                    width="68"
                    viewBox="135.5 361.38 420.32 149.8"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                    className="opacity-95"
                  >
                    <path d="m181.86 511.11c-12.524-0.49755-22.77-3.9244-30.782-10.289-1.529-1.2159-5.1725-4.8616-6.3949-6.3992-3.2489-4.0853-5.4578-8.0611-6.931-12.472-4.5334-13.579-2.2002-31.397 6.6737-50.953 7.5979-16.742 19.322-33.347 39.776-56.344 3.013-3.384 11.986-13.281 12.043-13.281 0.0216 0-0.46749 0.84706-1.083 1.8786-5.3183 8.9082-9.8689 19.401-12.348 28.485-3.9823 14.576-3.502 27.085 1.4068 36.784 3.3862 6.6822 9.1913 12.47 15.719 15.67 11.428 5.5993 28.159 6.0625 48.592 1.3554 1.4068-0.32599 71.116-18.831 154.91-41.123 83.794-22.294 152.36-40.52 152.37-40.505 0.0237 0.0193-194.68 83.333-295.75 126.56-16.007 6.8431-20.287 8.5715-27.812 11.214-19.236 6.7551-36.467 9.9783-50.396 9.4251z" />
                  </svg>
                </div>
              </motion.div>
            </section> */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
