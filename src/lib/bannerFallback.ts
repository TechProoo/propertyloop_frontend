import type { ReactEventHandler } from "react";
import banner from "../assets/banner.png";

export const BANNER_FALLBACK = banner;

export const handleBannerError: ReactEventHandler<HTMLImageElement> = (e) => {
  const img = e.currentTarget;
  if (img.src.endsWith(banner)) return;
  img.src = banner;
};
