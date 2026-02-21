import useStore from "../store";
import CodeEditor from "./CodeEditor";

/**
 * Maps each tab to its store getter and setter.
 */
const TAB_CONFIG = {
  html: { label: "HTML", color: "text-orange-400" },
  css:  { label: "CSS",  color: "text-blue-400" },
  js:   { label: "JS",   color: "text-yellow-400" },
};

/**
 * EditorPanel – renders the tab bar and the active CodeMirror editor.
 */
export default function EditorPanel() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const editorTheme = useStore((s) => s.editorTheme);
  const theme = useStore((s) => s.theme);

  // Get current code + setter based on active tab
  const html = useStore((s) => s.html);
  const css = useStore((s) => s.css);
  const js = useStore((s) => s.js);
  const setHtml = useStore((s) => s.setHtml);
  const setCss = useStore((s) => s.setCss);
  const setJs = useStore((s) => s.setJs);

  const codeMap = { html, css, js };
  const setterMap = { html: setHtml, css: setCss, js: setJs };

  const bg = theme === "dark" ? "bg-[#1e1e2e]" : "bg-white";
  const tabBg = theme === "dark" ? "bg-[#181825]" : "bg-gray-100";
  const tabText = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`flex flex-col h-full ${bg}`}>
      {/* ── Tab bar ────────────────────────────────────────── */}
      <div className={`flex items-center gap-0 ${tabBg} border-b border-gray-700/30`}>
        {Object.entries(TAB_CONFIG).map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`
              px-4 py-2 text-sm font-medium transition-colors cursor-pointer
              ${activeTab === key ? `tab-active ${color}` : `${tabText} hover:text-gray-200`}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Editor area ────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        {/* We render all three editors but only show the active one.
            This preserves undo history & cursor position per tab. */}
        {Object.keys(TAB_CONFIG).map((lang) => (
          <div
            key={lang}
            className={`h-full ${activeTab === lang ? "block" : "hidden"}`}
          >
            <CodeEditor
              value={codeMap[lang]}
              onChange={setterMap[lang]}
              language={lang}
              editorThemeName={editorTheme}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
