"use client";

import { useEffect, useRef, useState } from "react";

type AgentMode = "idle" | "thinking" | "working" | "blocked" | "shipped";

type Point = { x: number; y: number };

const STATE_COLOR: Record<AgentMode, string> = {
  idle: "#f97316",
  thinking: "#60a5fa",
  working: "#34d399",
  blocked: "#ef4444",
  shipped: "#facc15",
};

function drawPixelRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

function drawOffice(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // floor tiles
  const tile = 16;
  for (let y = 0; y < h; y += tile) {
    for (let x = 0; x < w; x += tile) {
      const dark = ((x / tile + y / tile) | 0) % 2 === 0;
      drawPixelRect(ctx, x, y, tile, tile, dark ? "#1f2937" : "#243244");
    }
  }

  // walls/border
  drawPixelRect(ctx, 0, 0, w, 12, "#111827");
  drawPixelRect(ctx, 0, h - 12, w, 12, "#111827");
  drawPixelRect(ctx, 0, 0, 12, h, "#111827");
  drawPixelRect(ctx, w - 12, 0, 12, h, "#111827");

  // desks
  const desks: Point[] = [
    { x: 90, y: 90 },
    { x: 240, y: 90 },
    { x: 390, y: 90 },
    { x: 90, y: 200 },
    { x: 240, y: 200 },
    { x: 390, y: 200 },
  ];
  desks.forEach((d) => {
    drawPixelRect(ctx, d.x, d.y, 90, 40, "#7c4a2e");
    drawPixelRect(ctx, d.x + 8, d.y + 8, 26, 16, "#9ca3af"); // monitor
    drawPixelRect(ctx, d.x + 36, d.y + 26, 16, 6, "#4b5563"); // keyboard
  });

  // bookshelf
  drawPixelRect(ctx, w - 120, 50, 80, 180, "#8b5e34");
  for (let i = 0; i < 5; i++) {
    drawPixelRect(ctx, w - 115, 60 + i * 32, 70, 4, "#5b3a1e");
  }

  // title panel
  drawPixelRect(ctx, 20, 20, 180, 34, "#0f172a");
  drawPixelRect(ctx, 22, 22, 176, 30, "#1e293b");
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color = "#e5e7eb") {
  ctx.fillStyle = color;
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(text, x, y);
}

function drawAgent(ctx: CanvasRenderingContext2D, p: Point, mode: AgentMode, blink: boolean) {
  const c = STATE_COLOR[mode];
  // body
  drawPixelRect(ctx, p.x - 6, p.y - 8, 12, 14, c);
  // head
  drawPixelRect(ctx, p.x - 5, p.y - 15, 10, 8, "#f5d0a3");
  // eyes
  const eyeY = blink ? p.y - 12 : p.y - 13;
  drawPixelRect(ctx, p.x - 3, eyeY, 1, 1, "#111827");
  drawPixelRect(ctx, p.x + 2, eyeY, 1, 1, "#111827");
  // legs
  drawPixelRect(ctx, p.x - 4, p.y + 6, 3, 4, "#111827");
  drawPixelRect(ctx, p.x + 1, p.y + 6, 3, 4, "#111827");

  if (mode === "thinking") drawText(ctx, "...", p.x + 10, p.y - 16, "#93c5fd");
  if (mode === "blocked") drawText(ctx, "!", p.x + 10, p.y - 16, "#fca5a5");
  if (mode === "shipped") drawText(ctx, "✓", p.x + 10, p.y - 16, "#86efac");
}

export default function PixelAgentCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<AgentMode>("working");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const waypoints: Record<AgentMode, Point[]> = {
      idle: [{ x: 70, y: 260 }, { x: 120, y: 260 }],
      thinking: [{ x: 220, y: 260 }, { x: 300, y: 260 }, { x: 260, y: 230 }],
      working: [{ x: 120, y: 110 }, { x: 270, y: 110 }, { x: 420, y: 110 }],
      blocked: [{ x: 430, y: 230 }, { x: 390, y: 230 }],
      shipped: [{ x: 270, y: 60 }, { x: 300, y: 60 }],
    };

    let pos: Point = { x: 120, y: 110 };
    let targetIdx = 0;
    let raf = 0;
    const started = performance.now();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      canvas.width = Math.floor(displayWidth * dpr);
      canvas.height = Math.floor(displayHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };

    resize();
    window.addEventListener("resize", resize);

    const onMessage = (event: MessageEvent) => {
      const incoming = event.data as { type?: string; mode?: AgentMode };
      if (incoming?.type === "pixelAgentMode" && incoming.mode) setMode(incoming.mode);
    };
    window.addEventListener("message", onMessage);

    const render = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      drawOffice(ctx, w, h);

      const path = waypoints[mode];
      const target = path[targetIdx % path.length];
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const dist = Math.max(1, Math.hypot(dx, dy));
      const speed = mode === "working" ? 1.8 : mode === "thinking" ? 1.2 : mode === "blocked" ? 2.0 : 1.0;

      pos = {
        x: pos.x + (dx / dist) * speed,
        y: pos.y + (dy / dist) * speed,
      };

      if (dist < 6) targetIdx += 1;

      const blink = Math.floor((t - started) / 900) % 5 === 0;
      drawAgent(ctx, pos, mode, blink);

      drawText(ctx, "PIXEL OFFICE v1", 28, 42, "#e2e8f0");
      drawText(ctx, `Mode: ${mode.toUpperCase()}`, 24, h - 22, "#cbd5e1");

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("message", onMessage);
    };
  }, [mode]);

  return (
    <section className="card mt-8 rounded-2xl p-4 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Pixel Office v1</h3>
        <div className="flex items-center gap-2 text-xs">
          {(["idle", "thinking", "working", "blocked", "shipped"] as AgentMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full border px-2.5 py-1 transition ${
                mode === m
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="h-[320px] w-full rounded-xl border border-zinc-200 bg-zinc-900 [image-rendering:pixelated] dark:border-zinc-700"
      />
      <p className="mt-3 text-xs text-zinc-500">
        Office scene prototype. One Michael agent moving by state. Next: more agents + task-driven events.
      </p>
    </section>
  );
}
