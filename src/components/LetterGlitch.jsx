"use client";

import { useEffect, useRef } from "react";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

export default function LetterGlitch({
  glitchColors = ["#2b4539", "#61dca3", "#61b3dc"],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const SIZE = 16;
    let animId;
    let lastTime = 0;
    let cols, rows, grid;

    const rChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];
    const rColor = () =>
      glitchColors[Math.floor(Math.random() * glitchColors.length)];

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      cols = Math.ceil(canvas.width / SIZE);
      rows = Math.ceil(canvas.height / SIZE);
      grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          char: rChar(),
          color: rColor(),
        }))
      );
    };

    const draw = (ts) => {
      animId = requestAnimationFrame(draw);
      if (ts - lastTime < glitchSpeed) return;
      lastTime = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${SIZE}px monospace`;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = grid[r][c];
          // smooth=true: only ~3% of cells change per frame; false: all change
          if (!smooth || Math.random() < 0.03) {
            cell.char = rChar();
            cell.color = rColor();
          }
          ctx.fillStyle = cell.color;
          ctx.fillText(cell.char, c * SIZE, (r + 1) * SIZE);
        }
      }

      if (outerVignette) {
        const r = Math.max(canvas.width, canvas.height);
        const g = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, r * 0.2,
          canvas.width / 2, canvas.height / 2, r * 0.85
        );
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, "rgba(0,0,0,0.96)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (centerVignette) {
        const r = Math.max(canvas.width, canvas.height);
        const g = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, r * 0.5
        );
        g.addColorStop(0, "rgba(0,0,0,0.88)");
        g.addColorStop(0.45, "rgba(0,0,0,0.25)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    init();

    // resize when the canvas element changes size
    const ro = new ResizeObserver(init);
    ro.observe(canvas);

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [glitchColors, glitchSpeed, centerVignette, outerVignette, smooth]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
