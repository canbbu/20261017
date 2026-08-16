"use client";

import { motion, useReducedMotion } from "motion/react";

export function HeroPhotoMotion({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className="absolute inset-0">{children}</div>;
  }

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ scale: 1.02 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const container = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.16,
    },
  },
};

const titleReveal = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const detail = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
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
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      aria-label={`${title}. ${names}. ${date}`}
    >
      <h1 className="hero-title" aria-hidden="true">
        <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span className="inline-block" variants={titleReveal}>
            {title}
          </motion.span>
        </span>
      </h1>
      <motion.p className="hero-names" variants={detail}>
        {names}
      </motion.p>
      <motion.p className="hero-date" variants={detail}>
        {date}
      </motion.p>
    </motion.div>
  );
}
