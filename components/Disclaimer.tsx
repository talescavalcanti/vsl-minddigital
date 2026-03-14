"use client";

import { motion } from "framer-motion";

const disclaimerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.9,
      ease: "easeOut",
    },
  },
};

export default function Disclaimer() {
  return (
    <motion.p
      className="disclaimer"
      variants={disclaimerVariants}
      initial="hidden"
      animate="visible"
    >
      Detalhe: Mesmo que esteja começando do zero, sem aparecer, e sem investir.
    </motion.p>
  );
}
