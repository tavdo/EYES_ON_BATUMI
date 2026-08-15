"use client";

import { useEffect, useRef } from "react";

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
        <div className="scene-frame scene-frame-a" />
        <div className="scene-frame scene-frame-b" />
        <div className="scene-frame scene-frame-c" />
        <div className="scene-frame scene-frame-d" />
      </div>
      <div className="scene-grain" />
      <div className="scene-vignette" />
    </div>
  );
}
