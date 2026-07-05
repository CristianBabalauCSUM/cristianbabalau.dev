"use client";

import { useEffect } from "react";

/**
 * The four fixed background layers: grid, dot matrix, mouse "torch" that
 * brightens dots around the cursor, and a vignette. The torch follows the
 * pointer by updating the --mx/--my CSS variables (throttled to one update
 * per animation frame).
 */
export function BackgroundLayers() {
  useEffect(() => {
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          document.documentElement.style.setProperty("--mx", `${x}px`);
          document.documentElement.style.setProperty("--my", `${y}px`);
        });
      }
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="bg-layer bg-grid"></div>
      <div className="bg-layer bg-dots-base"></div>
      <div className="bg-layer bg-dots-torch"></div>
      <div className="bg-layer bg-vignette"></div>
    </>
  );
}
