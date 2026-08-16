import { wedding } from "@/content/wedding";
import { GalleryClient } from "@/components/interactive/GalleryClient";
import { Reveal } from "@/components/interactive/Reveal";

export function Gallery() {
  return (
    <section className="section bg-canvas" aria-labelledby="gallery-title">
      <Reveal className="page-shell mx-auto">
        <h2 id="gallery-title" className="section-title">
          사진
        </h2>
        {wedding.gallery.length === 0 ? (
          <p className="text-ink-muted">사진이 아직 준비되지 않았습니다.</p>
        ) : (
          <GalleryClient images={wedding.gallery} />
        )}
      </Reveal>
    </section>
  );
}
