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
 * inside a sandboxed iframe with debounced updates and
 * a smooth loading indicator.
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
      {/* Loading bar animation at top of preview */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            zIndex: 10,
            overflow: "hidden",
            backgroundColor: "var(--border-color)",
          }}
        >
          <div
            style={{
              width: "40%",
              height: "100%",
              backgroundColor: "var(--accent)",
              borderRadius: 2,
              animation: "loading-bar 1.2s ease-in-out infinite",
            }}
          />
          <style>{`
            @keyframes loading-bar {
              0%   { transform: translateX(-100%); }
              50%  { transform: translateX(200%); }
              100% { transform: translateX(-100%); }
            }
          `}</style>
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
