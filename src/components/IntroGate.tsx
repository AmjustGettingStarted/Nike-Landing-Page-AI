import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import intro from "@/assets/video/intro.mp4";

interface IntroGateProps {
  onExitStart: () => void;
  onComplete: () => void;
}

export function IntroGate({ onExitStart, onComplete }: IntroGateProps) {
  const [exiting, setExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Trigger exit during the final second of the video
      if (video.duration - video.currentTime <= 1.0 && !exiting) {
        setExiting(true);
        onExitStart();
      }
    };

    const handleEnded = () => {
      // Safety: ensure complete fires if video ends without the timeupdate trigger
      if (!exiting) {
        setExiting(true);
        onExitStart();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    video.play().catch(() => {
      // Autoplay blocked — fallback: trigger exit after 2s
      setTimeout(() => {
        if (!exiting) {
          setExiting(true);
          onExitStart();
        }
      }, 2000);
    });

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onExitStart, exiting]);

  // Once exit animation completes, notify parent
  useEffect(() => {
    if (!exiting) return;
    const timer = setTimeout(() => onComplete(), 1000); // matches animation duration
    return () => clearTimeout(timer);
  }, [exiting, onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-9999 w-full h-full overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src="/assets/video/intro.mp4"
            muted
            playsInline
            preload="auto"
          />
        </motion.div>
      )}

      {/* Exit overlay that handles the cinema transition */}
      {exiting && (
        <motion.div
          className="fixed inset-0 z-9999 w-full h-full overflow-hidden bg-black pointer-events-none"
          initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          animate={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(12px)",
          }}
          transition={{ duration: 1, ease: [0.45, 0, 0.1, 1] }}
        >
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={intro}
            muted
            playsInline
            preload="auto"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
