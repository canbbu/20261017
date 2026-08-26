import { Allura, Cormorant_Garamond } from "next/font/google";

export const allura = Allura({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hero-allura",
  fallback: ["cursive"],
  preload: true,
});

export const cormorant = Cormorant_Garamond({
  weight: ["500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hero-cormorant",
  fallback: ["Times New Roman", "serif"],
  preload: true,
});

export const heroFontClassName = [allura.variable, cormorant.variable].join(" ");
