"use client";

import { motion, useReducedMotion } from "motion/react";

export function Reveal({
  children,
  className,
  distance = 12,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ y: distance }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
