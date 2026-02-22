"use client";

import dynamic from "next/dynamic";

/**
 * Dynamically import the Playground component with SSR disabled
 * to prevent hydration mismatches and CodeMirror SSR errors.
 */
const Playground = dynamic(() => import("@/components/Playground"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center h-screen"
      style={{ backgroundColor: "#0c0f1a" }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Logo placeholder */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "rgba(129, 140, 248, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#818cf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-6 h-6 border-2 rounded-full animate-spin"
            style={{
              borderColor: "#1e293b",
              borderTopColor: "#818cf8",
            }}
          />
          <span
            style={{
              color: "#94a3b8",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            Loading Code Playground…
          </span>
        </div>
      </div>
    </div>
  ),
});

export default function Home() {
  return <Playground />;
}
