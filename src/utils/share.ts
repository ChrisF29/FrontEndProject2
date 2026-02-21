import lzString from "lz-string";

/**
 * Encode playground state into a compressed URL-safe string
 * for sharing via URL search params.
 */
export function encodeShareState(html: string, css: string, js: string): string {
  const payload = JSON.stringify({ html, css, js });
  return lzString.compressToEncodedURIComponent(payload);
}

/**
 * Decode a compressed share string back into playground state.
 */
export function decodeShareState(
  encoded: string
): { html: string; css: string; js: string } | null {
  try {
    const json = lzString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json);
  } catch {
    return null;
  }
}
