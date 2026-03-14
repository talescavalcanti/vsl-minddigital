"use client";

import { motion, AnimatePresence } from "framer-motion";

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    transition: { duration: 0.3 },
  },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  boxShadow: [
    "0 4px 20px rgba(0, 200, 83, 0.4)",
    "0 6px 32px rgba(0, 200, 83, 0.65)",
    "0 4px 20px rgba(0, 200, 83, 0.4)",
  ],
};

interface CTAButtonProps {
  visible?: boolean;
}

export default function CTAButton({ visible = true }: CTAButtonProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="https://checkout.applyfy.com.br/checkout/cmhcc2wdj0dza14dflp1wza7u?code=6x9c4wl&offer=BYBJ1VE"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.span
            animate={pulseAnimation}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ADQUIRIR AGORA
          </motion.span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
