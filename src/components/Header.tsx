"use client";

import { usePlaygroundStore } from "@/store/playgroundStore";
import Toolbar from "./Toolbar";
import ThemeToggle from "./ThemeToggle";

/**
 * Header – Top bar with logo, toolbar controls, and theme toggle.
 * Features glassmorphism backdrop and refined spacing.
 */
export default function Header() {
  const theme = usePlaygroundStore((s) => s.theme);

  return (
    <header
      className="flex items-center justify-between flex-wrap gap-2 transition-theme"
      style={{
        backgroundColor: "var(--bg-header)",
        backdropFilter: "blur(16px) saturate(1.8)",
        WebkitBackdropFilter: "blur(16px) saturate(1.8)",
        borderBottom: "1px solid var(--border-color)",
        padding: "0.45rem 0.75rem",
        position: "relative",
        zIndex: 20,
      }}
      data-theme={theme}
    >
      {/* Logo / Title */}
      <div className="flex items-center gap-2.5 select-none">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 32,
            height: 32,
            background: "var(--accent-glow)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <span
          className="text-sm font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Code Playground
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Toolbar />
        <div
          style={{
            width: 1,
            height: 20,
            backgroundColor: "var(--border-color)",
            margin: "0 0.25rem",
          }}
        />
        <ThemeToggle />
      </div>
    </header>
  );
}
