"use client";

import { usePlaygroundStore } from "@/store/playgroundStore";
import Toolbar from "./Toolbar";
import ThemeToggle from "./ThemeToggle";

/**
 * Header – Top bar with logo, toolbar controls, and theme toggle.
 */
export default function Header() {
  const theme = usePlaygroundStore((s) => s.theme);

  return (
    <header
      className="flex items-center justify-between flex-wrap gap-2"
      style={{
        backgroundColor: "var(--bg-header)",
        borderBottom: "1px solid var(--border-color)",
        padding: "0.5rem 1rem",
      }}
      data-theme={theme}
    >
      {/* Logo / Title */}
      <div className="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="14" y1="4" x2="10" y2="20" />
        </svg>
        <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
          Code Playground
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <Toolbar />
        <ThemeToggle />
      </div>
    </header>
  );
}
