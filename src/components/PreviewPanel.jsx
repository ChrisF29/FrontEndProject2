import { useRef, useEffect, useCallback, useState } from "react";
import useStore from "../store";

/**
 * Debounce helper – returns a debounced version of `fn`.
 */
function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/**
 * Builds the full HTML document string injected into the preview iframe.
 */
const buildSrcDoc = (html, css, js) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>
    // Capture console.log / error and relay to parent
    (function(){
      const _log = console.log;
      const _err = console.error;
      console.log = function(...args){
        _log.apply(console, args);
        window.parent.postMessage({ type:'console', level:'log', args: args.map(String) }, '*');
      };
      console.error = function(...args){
        _err.apply(console, args);
        window.parent.postMessage({ type:'console', level:'error', args: args.map(String) }, '*');
      };
      window.onerror = function(msg, src, line, col, err){
        window.parent.postMessage({ type:'console', level:'error', args: [msg + ' (line ' + line + ')'] }, '*');
      };
    })();
  <\/script>
  <script>${js}<\/script>
</body>
</html>`;

/**
 * PreviewPanel – renders user code inside a sandboxed iframe.
 * Updates are debounced to avoid excessive re-renders.
 */
export default function PreviewPanel() {
  const html = useStore((s) => s.html);
  const css = useStore((s) => s.css);
  const js = useStore((s) => s.js);
  const theme = useStore((s) => s.theme);

  // Debounce the combined code to avoid hammering the iframe
  const debouncedHtml = useDebouncedValue(html, 400);
  const debouncedCss = useDebouncedValue(css, 400);
  const debouncedJs = useDebouncedValue(js, 400);

  const srcDoc = buildSrcDoc(debouncedHtml, debouncedCss, debouncedJs);

  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const bg = theme === "dark" ? "bg-[#0f0f1a]" : "bg-white";

  return (
    <div className={`flex flex-col h-full ${bg}`}>
      {/* ── Preview label ──────────────────────────────────── */}
      <div
        className={`flex items-center px-4 py-2 text-xs font-semibold tracking-wider uppercase
          ${theme === "dark" ? "bg-[#181825] text-gray-400 border-b border-gray-700/30" : "bg-gray-100 text-gray-500 border-b border-gray-200"}`}
      >
        <svg className="w-4 h-4 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Live Preview
      </div>

      {/* ── iframe ─────────────────────────────────────────── */}
      <iframe
        title="preview"
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-modals"
        className={`flex-1 w-full border-0 ${bg}`}
      />
    </div>
  );
}
