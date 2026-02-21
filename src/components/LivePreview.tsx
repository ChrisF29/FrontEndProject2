"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { mergeCode, debounce } from "@/utils/helpers";

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
}

/**
 * LivePreview – Renders the combined HTML/CSS/JS output
 * inside a sandboxed iframe with debounced updates.
 */
export default function LivePreview({ html, css, js }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updatePreview = useCallback(
    debounce((h: string, c: string, j: string) => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const doc = mergeCode(h, c, j);
      // Use srcdoc for safe, sandboxed rendering
      iframe.srcdoc = doc;
      setIsLoading(false);
    }, 400),
    []
  );

  useEffect(() => {
    setIsLoading(true);
    updatePreview(html, css, js);
  }, [html, css, js, updatePreview]);

  return (
    <div className="relative w-full h-full" style={{ backgroundColor: "var(--preview-bg)" }}>
      {isLoading && (
        <div className="absolute top-2 right-2 z-10">
          <div
            className="w-4 h-4 border-2 rounded-full animate-spin"
            style={{
              borderColor: "var(--border-color)",
              borderTopColor: "var(--accent)",
            }}
          />
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="Live Preview"
        sandbox="allow-scripts allow-modals"
        className="w-full h-full border-0"
        style={{ backgroundColor: "#fff" }}
      />
    </div>
  );
}
