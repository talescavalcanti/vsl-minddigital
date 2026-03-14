"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const videoVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 18,
      delay: 0.5,
    },
  },
};

interface VideoPlayerProps {
  onVideoEnd?: () => void;
}

export default function VideoPlayer({ onVideoEnd }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ctaTriggeredRef = useRef(false);
  const onVideoEndRef = useRef(onVideoEnd);
  onVideoEndRef.current = onVideoEnd;

  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [fakeTotal, setFakeTotal] = useState("0:00");

  // The fake duration is ~30% of the real duration to make it feel short
  const fakeDurationRatio = 0.3;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) return;

    progressIntervalRef.current = setInterval(() => {
      if (!playerRef.current || typeof playerRef.current.getCurrentTime !== "function") return;

      const current = playerRef.current.getCurrentTime() || 0;
      const duration = playerRef.current.getDuration() || 1;
      const realProgress = current / duration;

      // Non-linear progress: accelerates so the bar fills faster
      // This makes the video feel much shorter
      const displayProgress = Math.min(Math.pow(realProgress, 0.45) * 100, 100);

      const displayDuration = duration * fakeDurationRatio;
      const displayCurrent = Math.min(current * fakeDurationRatio, displayDuration);

      setProgress(displayProgress);
      setCurrentTime(formatTime(displayCurrent));
      setFakeTotal(formatTime(displayDuration));

      // Trigger CTA at 5:35 (335 seconds)
      if (current >= 335 && !ctaTriggeredRef.current) {
        ctaTriggeredRef.current = true;
        onVideoEndRef.current?.();
      }

      if (realProgress >= 0.99) {
        setProgress(100);
      }
    }, 250);
  }, [fakeDurationRatio]);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const initPlayer = useCallback(() => {
    if (!containerRef.current || playerRef.current) return;

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: "80TfhUV17P0",
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        disablekb: 1,
        fs: 0,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          setIsReady(true);
          setIsPlaying(true);
          startProgressTracking();
        },
        onStateChange: (event: any) => {
          if (event.data === 1) {
            // Playing
            setIsPlaying(true);
            startProgressTracking();
          } else if (event.data === 2) {
            // Paused
            setIsPlaying(false);
            stopProgressTracking();
          } else if (event.data === 0) {
            // Ended
            setIsPlaying(false);
            stopProgressTracking();
            setProgress(100);
            onVideoEndRef.current?.();
          }
        },
      },
    });
  }, [startProgressTracking, stopProgressTracking]);

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    const existingScript = document.getElementById("yt-iframe-api");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "yt-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }

    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    return () => {
      stopProgressTracking();
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [initPlayer, stopProgressTracking]);

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  return (
    <motion.div
      className="video-wrapper"
      variants={videoVariants}
      initial="hidden"
      animate="visible"
    >
      {/* YouTube iframe container */}
      <div
        ref={containerRef}
        className="yt-container"
      />

      {/* Clickable overlay to play/pause */}
      {isReady && (
        <div className="player-click-overlay" onClick={togglePlay}>
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                className="play-indicator"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Mute/Unmute button */}
      <AnimatePresence>
        {isReady && (
          <motion.button
            className="mute-toggle"
            onClick={toggleMute}
            aria-label={isMuted ? "Ativar som" : "Desativar som"}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Custom progress bar */}
      {isReady && (
        <div className="player-controls">
          <div className="progress-bar-track">
            <motion.div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.25, ease: "linear" }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
