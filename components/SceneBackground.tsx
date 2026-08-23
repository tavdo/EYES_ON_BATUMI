"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const FALLBACK = [
  "/scene/frame-a.png",
  "/scene/frame-b.png",
  "/scene/frame-c.png",
  "/scene/frame-d.png",
] as const;

type FrameSlot = {
  left: string;
  right?: string;
  top: string;
  w: string;
  h: string;
  z: number;
  ry: number;
  rx: number;
  s: number;
  d: number;
  reverse?: boolean;
  keep?: boolean;
};

const SLOTS: FrameSlot[] = [
  { left: "2%", top: "3%", w: "12%", h: "21%", z: -80, ry: 18, rx: 6, s: 14, d: 0, keep: true },
  { left: "16%", top: "1%", w: "14%", h: "13%", z: -140, ry: 8, rx: 12, s: 20, d: -4 },
  { left: "auto", right: "2%", top: "4%", w: "12%", h: "20%", z: 40, ry: -22, rx: -4, s: 16, d: -2, reverse: true, keep: true },
  { left: "70%", top: "2%", w: "10%", h: "16%", z: 90, ry: -12, rx: 2, s: 12, d: -6, reverse: true },
  { left: "7%", top: "30%", w: "11%", h: "18%", z: -40, ry: 14, rx: -8, s: 15, d: -3, reverse: true },
  { left: "78%", top: "28%", w: "13%", h: "21%", z: -100, ry: -16, rx: 7, s: 18, d: -8 },
  { left: "26%", top: "16%", w: "9%", h: "15%", z: 60, ry: 10, rx: -5, s: 13, d: -1, reverse: true },
  { left: "56%", top: "12%", w: "14%", h: "12%", z: -160, ry: -6, rx: 10, s: 19, d: -7 },
  { left: "3%", top: "58%", w: "12%", h: "20%", z: 20, ry: 20, rx: 4, s: 14, d: -5 },
  { left: "34%", top: "68%", w: "10%", h: "17%", z: -50, ry: -10, rx: 8, s: 17, d: -9, reverse: true },
  { left: "auto", right: "3%", top: "78%", w: "11%", h: "16%", z: 70, ry: -18, rx: -3, s: 12, d: -2, reverse: true, keep: true },
  { left: "50%", top: "58%", w: "13%", h: "12%", z: -120, ry: 7, rx: 11, s: 21, d: -10 },
  { left: "20%", top: "44%", w: "9%", h: "16%", z: 110, ry: -14, rx: 3, s: 11, d: -4, reverse: true },
  { left: "63%", top: "40%", w: "11%", h: "18%", z: -30, ry: 12, rx: -6, s: 16, d: -11 },
  { left: "40%", top: "6%", w: "12%", h: "11%", z: -90, ry: -8, rx: 9, s: 18, d: -3 },
  { left: "86%", top: "46%", w: "10%", h: "17%", z: 30, ry: -20, rx: 5, s: 15, d: -7, reverse: true },
  { left: "12%", top: "76%", w: "11%", h: "16%", z: -70, ry: 16, rx: -4, s: 15, d: -12, reverse: true },
  { left: "44%", top: "36%", w: "8%", h: "14%", z: 50, ry: -9, rx: 6, s: 14, d: -8 },
  { left: "4%", top: "80%", w: "11%", h: "15%", z: -55, ry: 16, rx: 4, s: 17, d: -6, keep: true },
  { left: "30%", top: "28%", w: "10%", h: "12%", z: -110, ry: 11, rx: -7, s: 19, d: -10 },
  { left: "88%", top: "18%", w: "9%", h: "15%", z: 25, ry: -18, rx: 3, s: 13, d: -5, reverse: true },
  { left: "48%", top: "78%", w: "13%", h: "14%", z: -85, ry: 6, rx: 8, s: 16, d: -14 },
  { left: "5%", top: "18%", w: "8%", h: "13%", z: 80, ry: 13, rx: -3, s: 12, d: -9, reverse: true },
  { left: "58%", top: "48%", w: "9%", h: "15%", z: -45, ry: -11, rx: 5, s: 18, d: -3 },
];

export function SceneBackground() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/scene-photos")
      .then((response) => response.json())
      .then((data: { urls?: string[] }) => {
        if (cancelled || !Array.isArray(data.urls)) return;
        setGalleryUrls(data.urls.filter((url) => typeof url === "string"));
      })
      .catch(() => {
        // keep fallbacks
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const images = useMemo(() => {
    const pool = [...galleryUrls, ...FALLBACK];
    if (pool.length === 0) return [...FALLBACK];
    return pool;
  }, [galleryUrls]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 14;
      const y = (event.clientY / window.innerHeight - 0.5) * -10;
      stage.style.setProperty("--tilt-x", `${y.toFixed(2)}deg`);
      stage.style.setProperty("--tilt-y", `${x.toFixed(2)}deg`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="scene" aria-hidden>
      <div className="scene-wash" />
      <div className="scene-orb scene-orb-a" />
      <div className="scene-orb scene-orb-b" />
      <div className="scene-orb scene-orb-c" />
      <div ref={stageRef} className="scene-stage">
        {SLOTS.map((slot, index) => {
          const src = images[index % images.length];
          return (
            <div
              key={`${src}-${index}`}
              className={`scene-frame${slot.reverse ? " scene-frame-reverse" : ""}${
                slot.keep ? " scene-frame-keep" : ""
              }`}
              style={{
                left: slot.left === "auto" ? "auto" : slot.left,
                right: slot.right ?? "auto",
                top: slot.top,
                width: slot.w,
                height: slot.h,
                backgroundImage: `url("${src}")`,
                transform: `translateZ(${slot.z}px) rotateY(${slot.ry}deg) rotateX(${slot.rx}deg)`,
                animationDuration: `${slot.s}s`,
                animationDelay: `${slot.d}s`,
              }}
            />
          );
        })}
      </div>
      <div className="scene-grain" />
      <div className="scene-vignette" />
    </div>
  );
}
