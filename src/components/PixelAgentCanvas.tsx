"use client";

import { useEffect, useRef, useState } from "react";

type AgentMode = "idle" | "thinking" | "working" | "error" | "done";

class PixelAgent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = (Math.random() - 0.5) * 1.2;
    this.color = "#ff4fd8";
  }

  update(width: number, height: number, mode: AgentMode, target: { x: number; y: number } | null) {
    const speed = mode === "working" ? 1.4 : mode === "error" ? 2.2 : 0.9;

    // Steering behavior in thinking/working modes
    if (target && (mode === "thinking" || mode === "working")) {
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const mag = Math.max(1, Math.hypot(dx, dy));
      this.vx += (dx / mag) * 0.015;
      this.vy += (dy / mag) * 0.015;
    }

    this.x += this.vx * speed;
    this.y += this.vy * speed;

    if (this.x <= 0 || this.x >= width - 2) this.vx *= -1;
    if (this.y <= 0 || this.y >= height - 2) this.vy *= -1;

    if (mode === "thinking") {
      this.vx += (Math.random() - 0.5) * 0.05;
      this.vy += (Math.random() - 0.5) * 0.05;
    }

    if (mode === "error") {
      this.vx += (Math.random() - 0.5) * 0.25;
      this.vy += (Math.random() - 0.5) * 0.25;
    }

    this.vx = Math.max(-2.6, Math.min(2.6, this.vx));
    this.vy = Math.max(-2.6, Math.min(2.6, this.vy));
  }

  draw(ctx: CanvasRenderingContext2D, mode: AgentMode) {
    const modeColor =
      mode === "error"
        ? "#ff4d4d"
        : mode === "done"
          ? "#7dff9f"
          : mode === "thinking"
            ? "#7db9ff"
            : "#ff4fd8";

    this.color = modeColor;
    ctx.fillStyle = this.color;
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), 6, 6);

    if (mode === "thinking" || mode === "done") {
      ctx.fillStyle = mode === "done" ? "#d6ffe4" : "#b5d3ff";
      ctx.fillRect(Math.floor(this.x - this.vx), Math.floor(this.y - this.vy), 1, 1);
    }
  }
}

function drawCoreAvatar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  mode: AgentMode,
  blink: boolean,
) {
  const body =
    mode === "error" ? "#ff5b5b" : mode === "done" ? "#8cffaa" : mode === "thinking" ? "#7db9ff" : "#ff4fd8";

  // Body (pixel blob)
  ctx.fillStyle = body;
  ctx.fillRect(x - 3, y - 3, 6, 6);
  ctx.fillRect(x - 4, y - 2, 8, 4);

  // Eyes
  ctx.fillStyle = "#0b0b12";
  if (blink) {
    ctx.fillRect(x - 2, y - 1, 1, 1);
    ctx.fillRect(x + 1, y - 1, 1, 1);
  } else {
    ctx.fillRect(x - 2, y - 2, 1, 1);
    ctx.fillRect(x + 1, y - 2, 1, 1);
  }

  // Aura by mode
  if (mode === "thinking" || mode === "done") {
    ctx.fillStyle = mode === "done" ? "#d6ffe4" : "#c5dcff";
    ctx.fillRect(x - 6, y - 6, 1, 1);
    ctx.fillRect(x + 5, y - 6, 1, 1);
    ctx.fillRect(x - 6, y + 5, 1, 1);
    ctx.fillRect(x + 5, y + 5, 1, 1);
  }
}

export default function PixelAgentCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const agentsRef = useRef<PixelAgent[]>([]);
  const targetRef = useRef<{ x: number; y: number } | null>(null);
  const [mode, setMode] = useState<AgentMode>(() => {
    if (typeof window === "undefined") return "working";
    const saved = localStorage.getItem("ml-pixel-mode") as AgentMode | null;
    return saved && ["idle", "thinking", "working", "error", "done"].includes(saved)
      ? saved
      : "working";
  });

  useEffect(() => {
    localStorage.setItem("ml-pixel-mode", mode);
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    const cx = Math.max(40, Math.floor(canvas.clientWidth / 2));
    const cy = Math.max(30, Math.floor(canvas.clientHeight / 2));
    agentsRef.current = Array.from({ length: 70 }, () => {
      const a = new PixelAgent(cx + (Math.random() - 0.5) * 30, cy + (Math.random() - 0.5) * 30);
      return a;
    });

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onLeave = () => {
      targetRef.current = null;
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const start = performance.now();
    const render = (t: number) => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      agentsRef.current.forEach((agent) => {
        agent.update(canvas.clientWidth, canvas.clientHeight, mode, targetRef.current);
        agent.draw(ctx, mode);
      });

      const pulse = Math.sin((t - start) / 300);
      const coreX = Math.floor(canvas.clientWidth / 2 + pulse * 2);
      const coreY = Math.floor(canvas.clientHeight / 2);
      const blink = Math.floor((t - start) / 1000) % 5 === 0;
      drawCoreAvatar(ctx, coreX, coreY, mode, blink);

      raf = window.requestAnimationFrame(render);
    };

    raf = window.requestAnimationFrame(render);

    const onMessage = (event: MessageEvent) => {
      const incoming = event.data as { type?: string; mode?: AgentMode };
      if (incoming?.type === "pixelAgentMode" && incoming.mode) {
        setMode(incoming.mode);
      }
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("message", onMessage);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [mode]);

  return (
    <section className="card mt-8 rounded-2xl p-4 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Pixel Agent — Live</h3>
        <div className="flex items-center gap-2 text-xs">
          {(["idle", "thinking", "working", "error", "done"] as AgentMode[]).map((m) => (
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

      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
        <span>⚡ Michael is active</span>
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
      </div>

      <canvas
        ref={canvasRef}
        className="h-56 w-full rounded-xl border border-zinc-200 bg-zinc-900 [image-rendering:pixelated] dark:border-zinc-700"
      />
      <p className="mt-3 text-xs text-zinc-500">
        Core avatar + swarm. Cursor-seeking enabled in thinking/working modes. Mode persists in local storage.
      </p>
    </section>
  );
}
