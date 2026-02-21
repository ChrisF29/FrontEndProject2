"use client";

import { useEffect, useRef, useCallback } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState, Extension } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, indentOnInput } from "@codemirror/language";
import { autocompletion, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

type Language = "html" | "css" | "js";

interface CodeEditorProps {
  /** Current value of the editor */
  value: string;
  /** Called when the editor content changes */
  onChange: (value: string) => void;
  /** Language mode for syntax highlighting */
  language: Language;
  /** Theme: 'dark' or 'light' */
  theme?: "dark" | "light";
}

/** Map language prop to CodeMirror language extension */
function getLanguageExtension(lang: Language): Extension {
  switch (lang) {
    case "html":
      return html();
    case "css":
      return css();
    case "js":
      return javascript();
  }
}

/**
 * CodeEditor – A CodeMirror 6 based editor component.
 * Dynamically imported to avoid SSR issues on Vercel/Next.js.
 */
export default function CodeEditor({ value, onChange, language, theme = "dark" }: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref up to date without recreating the editor
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const createExtensions = useCallback((): Extension[] => {
    const extensions: Extension[] = [
      lineNumbers(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      history(),
      foldGutter(),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      keymap.of([...defaultKeymap, ...historyKeymap, ...closeBracketsKeymap, indentWithTab]),
      getLanguageExtension(language),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChangeRef.current(update.state.doc.toString());
        }
      }),
      EditorView.theme({
        "&": { height: "100%" },
        ".cm-scroller": { overflow: "auto" },
      }),
    ];

    if (theme === "dark") {
      extensions.push(oneDark);
    }

    return extensions;
  }, [language, theme]);

  // Create editor on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: createExtensions(),
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Recreate when language or theme changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, theme]);

  // Sync external value changes into the editor (e.g., reset, load from storage)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (currentDoc !== value) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden"
      style={{ backgroundColor: "var(--bg-editor)" }}
    />
  );
}
