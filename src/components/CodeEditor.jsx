import { useRef, useEffect, useCallback } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, indentOnInput } from "@codemirror/language";
import { closeBrackets, closeBracketsKeymap, autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { oneDark } from "@codemirror/theme-one-dark";
import { html as htmlLang } from "@codemirror/lang-html";
import { css as cssLang } from "@codemirror/lang-css";
import { javascript as jsLang } from "@codemirror/lang-javascript";

/**
 * Returns the CodeMirror language extension for the given language name.
 */
const getLangExtension = (lang) => {
  switch (lang) {
    case "html":
      return htmlLang({ autoCloseTags: true });
    case "css":
      return cssLang();
    case "js":
      return jsLang();
    default:
      return [];
  }
};

/**
 * Light theme definition (used when editorTheme is not "oneDark").
 */
const lightTheme = EditorView.theme({
  "&": {
    backgroundColor: "#f8fafc",
    color: "#1e293b",
  },
  ".cm-gutters": {
    backgroundColor: "#f1f5f9",
    color: "#94a3b8",
    borderRight: "1px solid #e2e8f0",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#e2e8f0",
  },
  ".cm-activeLine": {
    backgroundColor: "#f1f5f9",
  },
  ".cm-cursor": {
    borderLeftColor: "#1e293b",
  },
});

/**
 * CodeEditor – a reusable CodeMirror 6 component.
 *
 * Props:
 *  - value: string – current editor content
 *  - onChange: (value: string) => void
 *  - language: "html" | "css" | "js"
 *  - editorThemeName: "oneDark" | "default"
 */
export default function CodeEditor({ value, onChange, language, editorThemeName }) {
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // Keep the callback ref in sync without recreating the editor
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Create / recreate editor when language or theme changes
  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy previous view if any
    if (viewRef.current) {
      viewRef.current.destroy();
    }

    const themeExtension =
      editorThemeName === "oneDark" ? oneDark : lightTheme;

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        bracketMatching(),
        closeBrackets(),
        indentOnInput(),
        autocompletion(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        getLangExtension(language),
        themeExtension,
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...closeBracketsKeymap,
          ...completionKeymap,
          indentWithTab,
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": { height: "100%" },
          ".cm-scroller": { overflow: "auto" },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
    // We intentionally exclude `value` – we don't want to rebuild the editor
    // every keystroke; the updateListener keeps state in sync outward.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, editorThemeName]);

  // Sync external value changes (e.g. loading a snippet/template) into the
  // existing editor view without full recreation.
  const prevValueRef = useRef(value);
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (value !== current && value !== prevValueRef.current) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
    prevValueRef.current = value;
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden"
    />
  );
}
