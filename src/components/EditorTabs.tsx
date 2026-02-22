"use client";

import { usePlaygroundStore, EditorTab } from "@/store/playgroundStore";

const TABS: { id: EditorTab; label: string; color: string }[] = [
  { id: "html", label: "HTML", color: "#e44d26" },
  { id: "css", label: "CSS", color: "#264de4" },
  { id: "js", label: "JS", color: "#f7df1e" },
];

/**
 * EditorTabs – Tab bar for switching between HTML, CSS, and JS editors.
 * Uses pill-dot indicators and smooth hover transitions.
 */
export default function EditorTabs() {
  const activeTab = usePlaygroundStore((s) => s.activeTab);
  const setActiveTab = usePlaygroundStore((s) => s.setActiveTab);

  return (
    <div
      className="flex items-end gap-0 px-2 pt-1.5 transition-theme"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-color)",
      }}
      role="tablist"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveTab(tab.id)}
            className={`editor-tab ${isActive ? "active" : ""}`}
            style={{
              // Active tab bottom border uses the language color
              ...(isActive ? { "--tab-accent": tab.color } as React.CSSProperties : {}),
            }}
          >
            <span className="tab-dot" style={{ backgroundColor: tab.color }} />
            {tab.label}
            {isActive && (
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "0.5rem",
                  right: "0.5rem",
                  height: 2,
                  borderRadius: "2px 2px 0 0",
                  backgroundColor: tab.color,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
