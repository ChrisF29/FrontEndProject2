"use client";

import { usePlaygroundStore } from "@/store/playgroundStore";
import { saveToLocalStorage, downloadAsHTML } from "@/utils/helpers";
import { encodeShareState } from "@/utils/share";
import { useCallback, useState } from "react";

/**
 * Toolbar – Control buttons for Run, Reset, Save, Download, and Share.
 */
export default function Toolbar() {
  const { html, css, js, resetAll } = usePlaygroundStore();
  const [copied, setCopied] = useState(false);

  /** Force re-run by toggling a dummy state (handled in parent) */
  const handleRun = useCallback(() => {
    // Dispatch a custom event the playground listens for
    window.dispatchEvent(new CustomEvent("playground:run"));
  }, []);

  const handleSave = useCallback(() => {
    saveToLocalStorage({ html, css, js });
    // Brief visual feedback
    const btn = document.getElementById("save-btn");
    if (btn) {
      btn.textContent = "Saved!";
      setTimeout(() => {
        btn.textContent = "Save";
      }, 1500);
    }
  }, [html, css, js]);

  const handleDownload = useCallback(() => {
    downloadAsHTML(html, css, js);
  }, [html, css, js]);

  const handleShare = useCallback(async () => {
    const encoded = encodeShareState(html, css, js);
    const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: prompt with URL
      window.prompt("Copy this link:", url);
    }
  }, [html, css, js]);

  const buttonClass =
    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150";

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 flex-wrap"
      style={{
        backgroundColor: "var(--bg-header)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      {/* Run */}
      <button
        onClick={handleRun}
        className={buttonClass}
        style={{ backgroundColor: "#10b981", color: "#fff" }}
        title="Run code"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
        Run
      </button>

      {/* Reset */}
      <button
        onClick={resetAll}
        className={buttonClass}
        style={{ backgroundColor: "var(--btn-bg)", color: "var(--text-primary)" }}
        title="Reset to defaults"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12a9 9 0 1 1 3.3-6.9" />
          <path d="M3 3v6h6" />
        </svg>
        Reset
      </button>

      {/* Save */}
      <button
        id="save-btn"
        onClick={handleSave}
        className={buttonClass}
        style={{ backgroundColor: "var(--btn-bg)", color: "var(--text-primary)" }}
        title="Save to local storage"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        Save
      </button>

      {/* Download */}
      <button
        onClick={handleDownload}
        className={buttonClass}
        style={{ backgroundColor: "var(--btn-bg)", color: "var(--text-primary)" }}
        title="Download as HTML file"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download
      </button>

      {/* Share */}
      <button
        onClick={handleShare}
        className={buttonClass}
        style={{ backgroundColor: "var(--btn-bg)", color: "var(--text-primary)" }}
        title="Copy shareable link"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        {copied ? "Copied!" : "Share"}
      </button>
    </div>
  );
}
