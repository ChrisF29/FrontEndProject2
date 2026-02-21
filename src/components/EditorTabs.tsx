"use client";

import { usePlaygroundStore, EditorTab } from "@/store/playgroundStore";

const TABS: { id: EditorTab; label: string; color: string }[] = [
  { id: "html", label: "HTML", color: "#e44d26" },
  { id: "css", label: "CSS", color: "#264de4" },
  { id: "js", label: "JS", color: "#f7df1e" },
];

/**
 * EditorTabs – Tab bar for switching between HTML, CSS, and JS editors.
 */
export default function EditorTabs() {
  const activeTab = usePlaygroundStore((s) => s.activeTab);
  const setActiveTab = usePlaygroundStore((s) => s.setActiveTab);

  return (
    <div
      className="flex items-center gap-1 px-2 py-1"
      style={{ backgroundColor: "var(--bg-header)", borderBottom: "1px solid var(--border-color)" }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className="relative px-4 py-1.5 text-sm font-medium rounded-t-md transition-colors duration-150"
          style={{
            backgroundColor: activeTab === tab.id ? "var(--bg-editor)" : "transparent",
            color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-secondary)",
            borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : "2px solid transparent",
          }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full mr-1.5"
            style={{ backgroundColor: tab.color }}
          />
          {tab.label}
        </button>
      ))}
    </div>
  );
}
