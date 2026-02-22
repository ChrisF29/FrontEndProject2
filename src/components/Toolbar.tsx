"use client";

import { usePlaygroundStore } from "@/store/playgroundStore";
import { saveToLocalStorage, downloadAsHTML } from "@/utils/helpers";
import { encodeShareState } from "@/utils/share";
import { useCallback, useEffect, useRef } from "react";

/** Show a lightweight toast notification */
function showToast(message: string, icon?: string) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `${icon ? `<span>${icon}</span>` : ""}${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-exit");
    toast.addEventListener("animationend", () => toast.remove());
  }, 2200);
}

/**
 * Toolbar – Control buttons for Run, Reset, Save, Download, and Share.
 * Includes keyboard shortcut badges and toast-based feedback.
 */
export default function Toolbar() {
  const { html, css, js, resetAll } = usePlaygroundStore();
  const stateRef = useRef({ html, css, js });

  // Keep ref in sync for keyboard shortcuts
  useEffect(() => {
    stateRef.current = { html, css, js };
  }, [html, css, js]);

  const handleRun = useCallback(() => {
    window.dispatchEvent(new CustomEvent("playground:run"));
    showToast("Preview updated", "▶");
  }, []);

  const handleSave = useCallback(() => {
    const s = stateRef.current;
    saveToLocalStorage(s);
    showToast("Saved to browser", "💾");
  }, []);

  const handleDownload = useCallback(() => {
    const s = stateRef.current;
    downloadAsHTML(s.html, s.css, s.js);
    showToast("Downloading file…", "⬇");
  }, []);

  const handleShare = useCallback(async () => {
    const s = stateRef.current;
    const encoded = encodeShareState(s.html, s.css, s.js);
    const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard", "🔗");
    } catch {
      window.prompt("Copy this link:", url);
    }
  }, []);

  const handleReset = useCallback(() => {
    resetAll();
    showToast("Reset to defaults", "↺");
  }, [resetAll]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      if (e.key === "Enter") {
        e.preventDefault();
        handleRun();
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleRun, handleSave]);

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* Run */}
      <button
        onClick={handleRun}
        className="pg-btn pg-btn-success"
        title="Run code (Ctrl+Enter)"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
        Run
        <span className="kbd-badge">⌘↵</span>
      </button>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="pg-btn pg-btn-secondary"
        title="Reset to defaults"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 1 3.3-6.9" />
          <path d="M3 3v6h6" />
        </svg>
        Reset
      </button>

      {/* Save */}
      <button
        onClick={handleSave}
        className="pg-btn pg-btn-secondary"
        title="Save to local storage (Ctrl+S)"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        Save
        <span className="kbd-badge">⌘S</span>
      </button>

      {/* Download */}
      <button
        onClick={handleDownload}
        className="pg-btn pg-btn-secondary"
        title="Download as HTML file"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download
      </button>

      {/* Share */}
      <button
        onClick={handleShare}
        className="pg-btn pg-btn-secondary"
        title="Copy shareable link"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Share
      </button>
    </div>
  );
}
