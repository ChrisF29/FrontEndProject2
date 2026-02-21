import { create } from "zustand";
import templates from "./templates";

/** LocalStorage key for persisted snippets */
const STORAGE_KEY = "code-playground-snippets";

/**
 * Load saved snippets from LocalStorage.
 * Returns an array of { name, html, css, js, date } objects.
 */
const loadSnippets = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Persist snippets array to LocalStorage.
 */
const persistSnippets = (snippets) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
};

/**
 * Global application store powered by Zustand.
 *
 * Slices:
 *  - Code content (html, css, js)
 *  - Active editor tab
 *  - Theme (dark / light)
 *  - Editor syntax theme
 *  - Saved snippets
 */
const useStore = create((set, get) => ({
  // ── Code content ──────────────────────────────────────────
  html: templates[1].html,
  css: templates[1].css,
  js: templates[1].js,

  setHtml: (html) => set({ html }),
  setCss: (css) => set({ css }),
  setJs: (js) => set({ js }),

  // ── Active editor tab ─────────────────────────────────────
  activeTab: "html", // "html" | "css" | "js"
  setActiveTab: (activeTab) => set({ activeTab }),

  // ── Theme ─────────────────────────────────────────────────
  theme: "dark", // "dark" | "light"
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

  // ── Editor syntax theme ───────────────────────────────────
  editorTheme: "oneDark", // "oneDark" | "default"
  setEditorTheme: (editorTheme) => set({ editorTheme }),

  // ── Templates ─────────────────────────────────────────────
  loadTemplate: (index) => {
    const t = templates[index];
    if (t) set({ html: t.html, css: t.css, js: t.js });
  },

  // ── Reset all code ────────────────────────────────────────
  resetCode: () => set({ html: "", css: "", js: "" }),

  // ── Saved snippets (LocalStorage) ─────────────────────────
  savedSnippets: loadSnippets(),

  saveSnippet: (name) => {
    const { html, css, js, savedSnippets } = get();
    const snippet = {
      name: name || `Snippet ${savedSnippets.length + 1}`,
      html,
      css,
      js,
      date: new Date().toISOString(),
    };
    const updated = [snippet, ...savedSnippets];
    persistSnippets(updated);
    set({ savedSnippets: updated });
  },

  loadSnippet: (index) => {
    const { savedSnippets } = get();
    const s = savedSnippets[index];
    if (s) set({ html: s.html, css: s.css, js: s.js });
  },

  deleteSnippet: (index) => {
    const { savedSnippets } = get();
    const updated = savedSnippets.filter((_, i) => i !== index);
    persistSnippets(updated);
    set({ savedSnippets: updated });
  },
}));

export default useStore;
