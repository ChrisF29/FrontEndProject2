import { useEffect, useState } from "react";
import useStore from "./store";
import Header from "./components/Header";
import EditorPanel from "./components/EditorPanel";
import PreviewPanel from "./components/PreviewPanel";
import SplitPane from "./components/SplitPane";
import Footer from "./components/Footer";

/**
 * Detect if the viewport is narrow (mobile).
 */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

/**
 * Load code from a shareable URL hash on mount.
 */
function useShareableLink() {
  const setHtml = useStore((s) => s.setHtml);
  const setCss = useStore((s) => s.setCss);
  const setJs = useStore((s) => s.setJs);

  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith("#code=")) {
        const encoded = hash.slice(6);
        const json = decodeURIComponent(escape(atob(encoded)));
        const { html, css, js } = JSON.parse(json);
        if (html != null) setHtml(html);
        if (css != null) setCss(css);
        if (js != null) setJs(js);
      }
    } catch {
      // ignore invalid hash
    }
  }, [setHtml, setCss, setJs]);
}

/**
 * Root application component.
 */
export default function App() {
  const theme = useStore((s) => s.theme);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const saveSnippet = useStore((s) => s.saveSnippet);
  const isMobile = useIsMobile();

  // Load code from URL hash if present
  useShareableLink();

  // ── Global keyboard shortcuts ──────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      // Ctrl+Enter → Run (force refresh)
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        const html = useStore.getState().html;
        useStore.getState().setHtml(html + " ");
        requestAnimationFrame(() => useStore.getState().setHtml(html));
      }
      // Ctrl+S → Save snippet
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveSnippet();
      }
      // Ctrl+1/2/3 → Switch tabs
      if (e.ctrlKey && e.key === "1") {
        e.preventDefault();
        setActiveTab("html");
      }
      if (e.ctrlKey && e.key === "2") {
        e.preventDefault();
        setActiveTab("css");
      }
      if (e.ctrlKey && e.key === "3") {
        e.preventDefault();
        setActiveTab("js");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setActiveTab, saveSnippet]);

  const bgClass = theme === "dark" ? "bg-[#11111b] text-gray-200" : "bg-gray-50 text-gray-800";

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${bgClass}`}>
      <Header />

      {/* ── Main content area ─────────────────────────────── */}
      <main className="flex-1 overflow-hidden">
        <SplitPane
          direction={isMobile ? "vertical" : "horizontal"}
          initialSplit={isMobile ? 50 : 50}
          minPercent={20}
          left={<EditorPanel />}
          right={<PreviewPanel />}
        />
      </main>

      <Footer />
    </div>
  );
}
