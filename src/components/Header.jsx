import { useState } from "react";
import useStore from "../store";
import templates from "../templates";
import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * Encodes the current code into a shareable URL hash.
 */
const generateShareableLink = (html, css, js) => {
  const payload = JSON.stringify({ html, css, js });
  const encoded = btoa(unescape(encodeURIComponent(payload)));
  return `${window.location.origin}${window.location.pathname}#code=${encoded}`;
};

/**
 * Header – app title, run/reset/save/export controls, theme toggles, template picker.
 */
export default function Header() {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const editorTheme = useStore((s) => s.editorTheme);
  const setEditorTheme = useStore((s) => s.setEditorTheme);
  const resetCode = useStore((s) => s.resetCode);
  const loadTemplate = useStore((s) => s.loadTemplate);
  const saveSnippet = useStore((s) => s.saveSnippet);
  const html = useStore((s) => s.html);
  const css = useStore((s) => s.css);
  const js = useStore((s) => s.js);
  const setHtml = useStore((s) => s.setHtml);
  const setCss = useStore((s) => s.setCss);
  const setJs = useStore((s) => s.setJs);

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [snippetName, setSnippetName] = useState("");
  const [showShareToast, setShowShareToast] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);

  const savedSnippets = useStore((s) => s.savedSnippets);
  const loadSnippet = useStore((s) => s.loadSnippet);
  const deleteSnippet = useStore((s) => s.deleteSnippet);

  /* ── Export as single HTML file ──────────────────────────── */
  const exportHTML = () => {
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Code Playground Export</title>
  <style>\n${css}\n  </style>
</head>
<body>
${html}
  <script>\n${js}\n  <\/script>
</body>
</html>`;
    const blob = new Blob([content], { type: "text/html" });
    saveAs(blob, "playground-export.html");
  };

  /* ── Export as ZIP ───────────────────────────────────────── */
  const exportZIP = async () => {
    const zip = new JSZip();
    zip.file("index.html", `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Code Playground Export</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
${html}
  <script src="script.js"><\/script>
</body>
</html>`);
    zip.file("style.css", css);
    zip.file("script.js", js);
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "playground-export.zip");
  };

  /* ── Run (force preview refresh) ─────────────────────────── */
  const handleRun = () => {
    // Trigger a re-render of the preview by toggling a whitespace char
    const current = html;
    setHtml(current + " ");
    requestAnimationFrame(() => setHtml(current));
  };

  /* ── Share link ──────────────────────────────────────────── */
  const handleShare = () => {
    const link = generateShareableLink(html, css, js);
    navigator.clipboard.writeText(link).then(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    });
    // Also push to address bar
    window.history.replaceState(null, "", link.replace(window.location.origin, ""));
  };

  /* ── Save snippet dialog ────────────────────────────────── */
  const handleSave = () => {
    if (showSaveDialog) {
      saveSnippet(snippetName || undefined);
      setSnippetName("");
      setShowSaveDialog(false);
    } else {
      setShowSaveDialog(true);
    }
  };

  const bg = theme === "dark"
    ? "bg-[#11111b] border-b border-gray-700/40"
    : "bg-white border-b border-gray-200 shadow-sm";
  const text = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const btnBase = `px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer`;
  const btnPrimary = `${btnBase} bg-indigo-500 hover:bg-indigo-400 text-white`;
  const btnSecondary = `${btnBase} ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`;
  const btnDanger = `${btnBase} bg-red-500/20 hover:bg-red-500/40 text-red-400`;

  return (
    <header className={`${bg} ${text} px-4 py-2 flex items-center justify-between gap-3 flex-wrap relative z-20`}>
      {/* ── Logo / Title ───────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-indigo-500 flex items-center justify-center text-white text-sm font-bold font-mono">
          &lt;/&gt;
        </div>
        <h1 className="text-base font-bold tracking-tight">
          Code <span className="text-indigo-400">Playground</span>
        </h1>
      </div>

      {/* ── Controls ───────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Template picker */}
        <select
          onChange={(e) => loadTemplate(Number(e.target.value))}
          defaultValue=""
          className={`${btnSecondary} appearance-none pr-6 bg-no-repeat bg-[right_0.5rem_center]`}
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")` }}
          title="Load a starter template"
        >
          <option value="" disabled>Templates</option>
          {templates.map((t, i) => (
            <option key={i} value={i}>{t.name}</option>
          ))}
        </select>

        {/* Editor theme */}
        <select
          value={editorTheme}
          onChange={(e) => setEditorTheme(e.target.value)}
          className={`${btnSecondary} appearance-none pr-6 bg-no-repeat bg-[right_0.5rem_center]`}
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")` }}
          title="Editor color theme"
        >
          <option value="oneDark">One Dark</option>
          <option value="default">Light</option>
        </select>

        <div className={`w-px h-5 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`} />

        {/* Run */}
        <button onClick={handleRun} className={btnPrimary} title="Run code (Ctrl+Enter)">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.84z"/></svg>
            Run
          </span>
        </button>

        {/* Reset */}
        <button onClick={resetCode} className={btnDanger} title="Clear all code">
          Reset
        </button>

        {/* Save */}
        <div className="relative">
          <button onClick={handleSave} className={btnSecondary} title="Save snippet to LocalStorage">
            {showSaveDialog ? "Confirm" : "Save"}
          </button>
          {showSaveDialog && (
            <div className={`absolute top-full mt-1 right-0 p-2 rounded-lg shadow-xl z-50 flex gap-2
              ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
              <input
                autoFocus
                type="text"
                placeholder="Snippet name"
                value={snippetName}
                onChange={(e) => setSnippetName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className={`px-2 py-1 text-xs rounded border outline-none w-40
                  ${theme === "dark" ? "bg-gray-900 border-gray-600 text-gray-200" : "bg-gray-50 border-gray-300 text-gray-800"}`}
              />
              <button onClick={() => setShowSaveDialog(false)} className="text-xs text-gray-400 hover:text-gray-200 cursor-pointer">✕</button>
            </div>
          )}
        </div>

        {/* Load saved */}
        <div className="relative">
          <button onClick={() => setShowSnippets(!showSnippets)} className={btnSecondary} title="Saved snippets">
            Snippets {savedSnippets.length > 0 && `(${savedSnippets.length})`}
          </button>
          {showSnippets && (
            <div className={`absolute top-full mt-1 right-0 rounded-lg shadow-xl z-50 min-w-[220px] max-h-60 overflow-auto
              ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
              {savedSnippets.length === 0 ? (
                <p className="p-3 text-xs text-gray-400">No saved snippets</p>
              ) : (
                savedSnippets.map((s, i) => (
                  <div key={i} className={`flex items-center justify-between px-3 py-2 text-xs
                    ${theme === "dark" ? "hover:bg-gray-700/60" : "hover:bg-gray-100"}`}>
                    <button
                      onClick={() => { loadSnippet(i); setShowSnippets(false); }}
                      className="flex-1 text-left truncate cursor-pointer"
                    >
                      {s.name}
                    </button>
                    <button
                      onClick={() => deleteSnippet(i)}
                      className="ml-2 text-red-400 hover:text-red-300 cursor-pointer"
                      title="Delete snippet"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className={`w-px h-5 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`} />

        {/* Export */}
        <button onClick={exportHTML} className={btnSecondary} title="Export as single HTML file">
          HTML ↓
        </button>
        <button onClick={exportZIP} className={btnSecondary} title="Export as ZIP">
          ZIP ↓
        </button>

        {/* Share */}
        <button onClick={handleShare} className={btnSecondary} title="Copy shareable link">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            Share
          </span>
        </button>

        {/* Theme toggle */}
        <button onClick={toggleTheme} className={btnSecondary} title="Toggle dark/light mode">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      {/* ── Share toast ────────────────────────────────────── */}
      {showShareToast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-green-500 text-white text-xs rounded-lg shadow-lg animate-pulse z-50">
          Shareable link copied to clipboard!
        </div>
      )}
    </header>
  );
}
