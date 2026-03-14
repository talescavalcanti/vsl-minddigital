"use client";

import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

export default function Hero() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
    >
      <motion.h1 className="headline" variants={itemVariants}>
        O sistema com IA que me faz vender{" "}
        <span className="highlight">TODOS OS DIAS</span> no automático e pode te
        gerar <span className="highlight">R$500 POR DIA</span> ainda essa
        semana.
      </motion.h1>

      <motion.p className="sub-headline" variants={itemVariants}>
        Toque no vídeo abaixo para iniciar.
      </motion.p>
    </motion.div>
  );
}
