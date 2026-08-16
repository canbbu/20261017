import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { wedding } from "@/content/wedding";
import { formatEventDateLine } from "@/lib/calendar";
import { coupleNames } from "@/lib/content";

export const alt = wedding.hero.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const photo = await readFile(join(process.cwd(), `public${wedding.hero.src}`));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          position: "relative",
          background: "#f8f8f4",
        }}
      >
        {/* OG canvas requires a raw img inside ImageResponse. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          width={1200}
          height={630}
          style={{
            width: 1200,
            height: 630,
            objectFit: "cover",
            objectPosition: wedding.hero.objectPositionDesktop,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 48,
            background:
              "linear-gradient(to top, rgba(32,35,31,0.42), transparent 55%)",
            color: "#f8f8f4",
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 600 }}>{coupleNames()}</div>
          <div style={{ fontSize: 24, marginTop: 8 }}>
            {formatEventDateLine(wedding.event.startsAt, wedding.event.timezone)}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
