import { create } from "zustand";

/** Default starter code for each editor panel */
const DEFAULT_HTML = `<div class="container">
  <h1>Hello, Playground! 🎉</h1>
  <p>Start editing to see your changes live.</p>
  <button id="btn">Click me</button>
</div>`;

const DEFAULT_CSS = `body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.container {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border: 2px solid #fff;
  background: transparent;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  background: #fff;
  color: #764ba2;
}`;

const DEFAULT_JS = `document.getElementById('btn').addEventListener('click', () => {
  alert('Button clicked! 🚀');
});`;

export type EditorTab = "html" | "css" | "js";

interface PlaygroundStore {
  /** Editor contents */
  html: string;
  css: string;
  js: string;

  /** Currently active editor tab */
  activeTab: EditorTab;

  /** Theme: 'dark' | 'light' */
  theme: "dark" | "light";

  /** Actions */
  setHtml: (html: string) => void;
  setCss: (css: string) => void;
  setJs: (js: string) => void;
  setActiveTab: (tab: EditorTab) => void;
  toggleTheme: () => void;
  resetAll: () => void;
  loadState: (state: { html: string; css: string; js: string }) => void;
}

export const usePlaygroundStore = create<PlaygroundStore>((set) => ({
  html: DEFAULT_HTML,
  css: DEFAULT_CSS,
  js: DEFAULT_JS,
  activeTab: "html",
  theme: "dark",

  setHtml: (html) => set({ html }),
  setCss: (css) => set({ css }),
  setJs: (js) => set({ js }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  resetAll: () =>
    set({ html: DEFAULT_HTML, css: DEFAULT_CSS, js: DEFAULT_JS }),
  loadState: (state) => set({ html: state.html, css: state.css, js: state.js }),
}));
