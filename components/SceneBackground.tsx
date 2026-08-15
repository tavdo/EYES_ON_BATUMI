"use client";

import { useEffect, useRef } from "react";

const IMAGES = [
  "/scene/frame-a.png",
  "/scene/frame-b.png",
  "/scene/frame-c.png",
  "/scene/frame-d.png",
] as const;

const FRAMES = [
  { src: IMAGES[0], left: "2%", top: "6%", w: "13%", h: "22%", z: -80, ry: 18, rx: 6, s: 14, d: 0, keep: true },
  { src: IMAGES[2], left: "18%", top: "2%", w: "16%", h: "14%", z: -140, ry: 8, rx: 12, s: 20, d: -4 },
  { src: IMAGES[1], left: "auto", right: "4%", top: "8%", w: "12%", h: "20%", z: 40, ry: -22, rx: -4, s: 16, d: -2, reverse: true, keep: true },
  { src: IMAGES[3], left: "72%", top: "3%", w: "9%", h: "16%", z: 90, ry: -12, rx: 2, s: 12, d: -6, reverse: true },
  { src: IMAGES[1], left: "8%", top: "38%", w: "11%", h: "18%", z: -40, ry: 14, rx: -8, s: 15, d: -3, reverse: true },
  { src: IMAGES[0], left: "78%", top: "32%", w: "12%", h: "20%", z: -100, ry: -16, rx: 7, s: 18, d: -8 },
  { src: IMAGES[3], left: "28%", top: "18%", w: "8%", h: "14%", z: 60, ry: 10, rx: -5, s: 13, d: -1, reverse: true },
  { src: IMAGES[2], left: "58%", top: "14%", w: "15%", h: "12%", z: -160, ry: -6, rx: 10, s: 19, d: -7 },
  { src: IMAGES[0], left: "4%", top: "68%", w: "12%", h: "20%", z: 20, ry: 20, rx: 4, s: 14, d: -5 },
  { src: IMAGES[3], left: "36%", top: "72%", w: "9%", h: "16%", z: -50, ry: -10, rx: 8, s: 17, d: -9, reverse: true },
  { src: IMAGES[1], left: "auto", right: "6%", top: "66%", w: "11%", h: "18%", z: 70, ry: -18, rx: -3, s: 12, d: -2, reverse: true },
  { src: IMAGES[2], left: "52%", top: "62%", w: "14%", h: "12%", z: -120, ry: 7, rx: 11, s: 21, d: -10 },
  { src: IMAGES[3], left: "22%", top: "48%", w: "8%", h: "15%", z: 110, ry: -14, rx: 3, s: 11, d: -4, reverse: true },
  { src: IMAGES[0], left: "64%", top: "44%", w: "10%", h: "17%", z: -30, ry: 12, rx: -6, s: 16, d: -11 },
  { src: IMAGES[2], left: "42%", top: "8%", w: "13%", h: "11%", z: -90, ry: -8, rx: 9, s: 18, d: -3 },
  { src: IMAGES[1], left: "86%", top: "50%", w: "10%", h: "16%", z: 30, ry: -20, rx: 5, s: 15, d: -7, reverse: true },
] as const;

export function SceneBackground() {
  const stageRef = useRef<HTMLDivElement>(null);

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
        {FRAMES.map((frame, index) => (
          <div
            key={index}
            className={`scene-frame${frame.reverse ? " scene-frame-reverse" : ""}${
              "keep" in frame && frame.keep
                ? index === 0
                  ? " scene-frame-keep scene-frame-keep-tl"
                  : " scene-frame-keep scene-frame-keep-tr"
                : ""
            }`}
            style={{
              left: frame.left === "auto" ? "auto" : frame.left,
              right: "right" in frame ? frame.right : "auto",
              top: frame.top,
              width: frame.w,
              height: frame.h,
              backgroundImage: `url("${frame.src}")`,
              transform: `translateZ(${frame.z}px) rotateY(${frame.ry}deg) rotateX(${frame.rx}deg)`,
              animationDuration: `${frame.s}s`,
              animationDelay: `${frame.d}s`,
            }}
          />
        ))}
      </div>
      <div className="scene-grain" />
      <div className="scene-vignette" />
    </div>
  );
}
