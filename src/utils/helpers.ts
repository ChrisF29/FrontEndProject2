/**
 * Debounce utility – delays invoking `fn` until after `delay` ms have elapsed
 * since the last time it was invoked.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Merge HTML, CSS, and JS into a single HTML document string
 * suitable for rendering in an iframe.
 */
export function mergeCode(html: string, css: string, js: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>
    // Wrap in try/catch to prevent errors from breaking the preview
    try {
      ${js}
    } catch (err) {
      document.body.innerHTML += '<pre style="color:red;padding:1rem;font-size:13px;">' + err + '</pre>';
    }
  <\/script>
</body>
</html>`;
}

/**
 * Generate a downloadable single HTML file from the editor contents.
 */
export function downloadAsHTML(html: string, css: string, js: string): void {
  const content = mergeCode(html, css, js);
  const blob = new Blob([content], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "playground.html";
  a.click();
  URL.revokeObjectURL(url);
}

/** LocalStorage key for saved playground state */
const STORAGE_KEY = "code-playground-state";

export interface PlaygroundState {
  html: string;
  css: string;
  js: string;
}

/** Save playground state to LocalStorage */
export function saveToLocalStorage(state: PlaygroundState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable in some contexts
  }
}

/** Load playground state from LocalStorage */
export function loadFromLocalStorage(): PlaygroundState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PlaygroundState;
  } catch {
    // ignore parse errors
  }
  return null;
}
