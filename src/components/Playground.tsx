"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { usePlaygroundStore } from "@/store/playgroundStore";
import { loadFromLocalStorage } from "@/utils/helpers";
import { decodeShareState } from "@/utils/share";
import Header from "./Header";
import EditorTabs from "./EditorTabs";
import LivePreview from "./LivePreview";

/**
 * Dynamically import CodeEditor with SSR disabled
 * to prevent server-side rendering errors with CodeMirror.
 */
const CodeEditor = dynamic(() => import("./CodeEditor"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center w-full h-full"
      style={{ backgroundColor: "var(--bg-editor)", color: "var(--text-secondary)" }}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor: "var(--border-color)", borderTopColor: "var(--accent)" }}
        />
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Loading editor…</span>
      </div>
    </div>
  ),
});

/**
 * Playground – Main application component that orchestrates the
 * editor panels, preview, and resizable layout.
 */
export default function Playground() {
  const {
    html,
    css,
    js,
    activeTab,
    theme,
    setHtml,
    setCss,
    setJs,
    loadState,
  } = usePlaygroundStore();

  /** Force-run counter: incremented by the Run button */
  const [runCounter, setRunCounter] = useState(0);

  /** Resizable split: percentage of the editor panel width */
  const [editorWidth, setEditorWidth] = useState(50);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /** Apply theme to the document root */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /** Load saved state from URL params or LocalStorage on mount */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get("code");
    if (codeParam) {
      const shared = decodeShareState(codeParam);
      if (shared) {
        loadState(shared);
        return;
      }
    }
    const saved = loadFromLocalStorage();
    if (saved) {
      loadState(saved);
    }
  }, [loadState]);

  /** Listen for manual "Run" events from the toolbar */
  useEffect(() => {
    const handleRun = () => setRunCounter((c) => c + 1);
    window.addEventListener("playground:run", handleRun);
    return () => window.removeEventListener("playground:run", handleRun);
  }, []);

  /** Handle drag-based resizing */
  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      setEditorWidth(Math.min(Math.max(newWidth, 25), 75));
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  /** Get the current onChange handler based on active tab */
  const currentValue = activeTab === "html" ? html : activeTab === "css" ? css : js;
  const currentOnChange = activeTab === "html" ? setHtml : activeTab === "css" ? setCss : setJs;

  return (
    <div className="flex flex-col h-screen transition-theme" data-theme={theme}>
      <Header />

      {/* Main content area */}
      <div
        ref={containerRef}
        className="flex flex-1 overflow-hidden flex-col md:flex-row"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {/* Editor Panel */}
        <div
          className="flex flex-col overflow-hidden md:h-full"
          style={{
            width: "100%",
            flex: "none",
            borderRight: "1px solid var(--border-color)",
          }}
          ref={(el) => {
            if (el) {
              const mq = window.matchMedia("(min-width: 768px)");
              if (mq.matches) {
                el.style.width = `${editorWidth}%`;
                el.style.height = "100%";
              } else {
                el.style.width = "100%";
                el.style.height = "50%";
              }
            }
          }}
        >
          <EditorTabs />
          <div className="flex-1 overflow-hidden" style={{ backgroundColor: "var(--bg-editor)" }}>
            <CodeEditor
              key={activeTab}
              value={currentValue}
              onChange={currentOnChange}
              language={activeTab}
              theme={theme}
            />
          </div>
        </div>

        {/* Resize Handle (desktop only) */}
        <div
          className="hidden md:flex items-center justify-center cursor-col-resize resize-handle group"
          style={{ width: "6px", flexShrink: 0 }}
          onMouseDown={handleMouseDown}
          role="separator"
          aria-orientation="vertical"
          tabIndex={0}
        >
          <div
            style={{
              width: 3,
              height: 32,
              borderRadius: 3,
              backgroundColor: "var(--text-secondary)",
              opacity: 0.35,
              transition: "opacity 0.15s ease, height 0.15s ease",
            }}
            className="group-hover:!opacity-70 group-hover:!h-12"
          />
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="panel-label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Preview
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.6rem",
                opacity: 0.6,
                fontWeight: 400,
                textTransform: "none",
                letterSpacing: 0,
              }}
            >
              Auto-refresh
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <LivePreview key={runCounter} html={html} css={css} js={js} />
          </div>
        </div>
      </div>
    </div>
  );
}
