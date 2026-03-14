"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import VideoPlayer from "@/components/VideoPlayer";
import Disclaimer from "@/components/Disclaimer";
import CTAButton from "@/components/CTAButton";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Home() {
  const [videoEnded, setVideoEnded] = useState(false);

  return (
    <motion.main
      className="vsl-container"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <Hero />
      <VideoPlayer onVideoEnd={() => setVideoEnded(true)} />
      <Disclaimer />
      <CTAButton visible={videoEnded} />
    </motion.main>
  );
}
