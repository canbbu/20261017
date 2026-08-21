"use client";

import { motion, useReducedMotion } from "motion/react";

const easeOut = [0.16, 1, 0.3, 1] as const;
const photoScale = 1.03;
const photoDuration = 1.6;
const textDelay = 0.4;
const textStagger = 0.24;
const textDuration = 0.8;

export function HeroPhotoMotion({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className="absolute inset-0">{children}</div>;
  }

  return (
    <motion.div
      className="absolute inset-0 origin-center"
      initial={{ scale: photoScale }}
      animate={{ scale: 1 }}
      transition={{ duration: photoDuration, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

const container = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: textDelay,
      staggerChildren: textStagger,
    },
  },
};

const textReveal = {
  hidden: { y: 8, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: textDuration, ease: easeOut },
  },
};

export function HeroTextMotion({
  title,
  names,
  date,
}: {
  title: string;
  names: string;
  date: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <>
        <h1 className="hero-title">{title}</h1>
        <p className="hero-names">{names}</p>
        <p className="hero-date">{date}</p>
      </>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="visible">
      <motion.h1 className="hero-title" variants={textReveal}>
        {title}
      </motion.h1>
      <motion.p className="hero-names" variants={textReveal}>
        {names}
      </motion.p>
      <motion.p className="hero-date" variants={textReveal}>
        {date}
      </motion.p>
    </motion.div>
  );
}
