"use client";

import dynamic from "next/dynamic";

/**
 * Dynamically import the Playground component with SSR disabled
 * to prevent hydration mismatches and CodeMirror SSR errors.
 */
const Playground = dynamic(() => import("@/components/Playground"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "#0f172a" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-400 text-sm font-medium">Loading Code Playground...</span>
      </div>
    </div>
  ),
});

export default function Home() {
  return <Playground />;
}
