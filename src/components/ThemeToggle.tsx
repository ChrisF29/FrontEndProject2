"use client";

import { usePlaygroundStore } from "@/store/playgroundStore";

/**
 * ThemeToggle – Animated switch between light and dark themes.
 * Uses a track/thumb style for clear affordance.
 */
export default function ThemeToggle() {
  const theme = usePlaygroundStore((s) => s.theme);
  const toggleTheme = usePlaygroundStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 group"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}
    >
      {/* Sun icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          color: isDark ? "var(--text-secondary)" : "#f59e0b",
          transition: "color 0.2s ease",
        }}
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>

      {/* Track */}
      <div
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          backgroundColor: isDark ? "var(--accent)" : "var(--border-color)",
          position: "relative",
          transition: "background-color 0.25s ease",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15)",
        }}
      >
        {/* Thumb */}
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: "#fff",
            position: "absolute",
            top: 2,
            left: isDark ? 18 : 2,
            transition: "left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </div>

      {/* Moon icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          color: isDark ? "#818cf8" : "var(--text-secondary)",
          transition: "color 0.2s ease",
        }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
