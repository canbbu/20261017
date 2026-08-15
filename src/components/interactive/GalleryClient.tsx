"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { GalleryImage } from "@/content/wedding";
import { SafeImage } from "@/components/interactive/SafeImage";

const GalleryLightbox = dynamic(
  () => import("./GalleryLightbox").then((mod) => mod.GalleryLightbox),
  { ssr: false },
);

const INITIAL_COUNT = 6;

export function GalleryClient({ images }: { images: readonly GalleryImage[] }) {
  const [expanded, setExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const visible = expanded ? images : images.slice(0, INITIAL_COUNT);

  return (
    <>
      <motion.ul
        className="gallery-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduce ? 0 : 0.07 } },
        }}
      >
        <AnimatePresence initial={false}>
          {visible.map((image, index) => (
          <motion.li
            key={image.src}
            className={image.featured ? "gallery-featured" : undefined}
            variants={{
              hidden: { opacity: 0, y: 16, scale: 0.985 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            initial={reduce ? false : "hidden"}
            animate="visible"
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            layout
          >
            <button
              type="button"
              className="control w-full overflow-hidden rounded-[12px] p-0"
              onClick={() => setOpenIndex(index)}
              aria-label={`${image.alt} 크게 보기`}
            >
              <SafeImage
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                fallbackLabel="갤러리"
                className="media gallery-image h-full w-full object-cover transition-transform duration-700 ease-out"
                sizes={image.featured ? "(max-width: 720px) 100vw, 720px" : "(max-width: 720px) 50vw, 360px"}
                loading="lazy"
                style={{ aspectRatio: image.featured ? "16 / 10" : "3 / 4" }}
              />
            </button>
          </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {!expanded && images.length > INITIAL_COUNT ? (
        <button
          type="button"
          className="control mt-6 w-full border border-line bg-surface text-[0.9375rem]"
          onClick={() => setExpanded(true)}
        >
          사진 더 보기
        </button>
      ) : null}
      {openIndex !== null ? (
        <GalleryLightbox
          images={images}
          startIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      ) : null}
    </>
  );
}
