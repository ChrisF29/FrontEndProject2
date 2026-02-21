import { useRef, useCallback, useEffect, useState } from "react";

/**
 * SplitPane – a resizable split panel component.
 *
 * Props:
 *  - direction: "horizontal" | "vertical"
 *  - left / right (or top / bottom): React nodes for each pane
 *  - initialSplit: initial percentage for the first pane (default 50)
 *  - minPercent: minimum percentage for either pane (default 20)
 */
export default function SplitPane({
  direction = "horizontal",
  left,
  right,
  initialSplit = 50,
  minPercent = 20,
}) {
  const containerRef = useRef(null);
  const [split, setSplit] = useState(initialSplit);
  const [dragging, setDragging] = useState(false);

  const isHorizontal = direction === "horizontal";

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let pct;
      if (isHorizontal) {
        pct = ((e.clientX - rect.left) / rect.width) * 100;
      } else {
        pct = ((e.clientY - rect.top) / rect.height) * 100;
      }
      pct = Math.max(minPercent, Math.min(100 - minPercent, pct));
      setSplit(pct);
    };

    const handleMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, isHorizontal, minPercent]);

  // Touch support
  useEffect(() => {
    if (!dragging) return;

    const handleTouchMove = (e) => {
      if (!containerRef.current) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      let pct;
      if (isHorizontal) {
        pct = ((touch.clientX - rect.left) / rect.width) * 100;
      } else {
        pct = ((touch.clientY - rect.top) / rect.height) * 100;
      }
      pct = Math.max(minPercent, Math.min(100 - minPercent, pct));
      setSplit(pct);
    };

    const handleTouchEnd = () => setDragging(false);

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging, isHorizontal, minPercent]);

  return (
    <div
      ref={containerRef}
      className={`flex ${isHorizontal ? "flex-row" : "flex-col"} h-full w-full overflow-hidden`}
      style={{ userSelect: dragging ? "none" : "auto" }}
    >
      {/* First pane */}
      <div
        style={isHorizontal ? { width: `${split}%` } : { height: `${split}%` }}
        className="overflow-hidden"
      >
        {left}
      </div>

      {/* Resizer */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        className={`resizer ${isHorizontal ? "resizer-h" : "resizer-v"} ${dragging ? "active" : ""}`}
      />

      {/* Second pane */}
      <div
        style={isHorizontal ? { width: `${100 - split}%` } : { height: `${100 - split}%` }}
        className="overflow-hidden"
      >
        {right}
      </div>
    </div>
  );
}
