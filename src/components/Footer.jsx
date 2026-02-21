import useStore from "../store";

/**
 * Footer – optional credits / keyboard shortcut hints.
 */
export default function Footer() {
  const theme = useStore((s) => s.theme);

  const bg = theme === "dark"
    ? "bg-[#11111b] border-t border-gray-700/40 text-gray-500"
    : "bg-white border-t border-gray-200 text-gray-400";

  return (
    <footer className={`${bg} px-4 py-1.5 flex items-center justify-between text-[11px]`}>
      <span>
        <kbd className="px-1 py-0.5 rounded bg-gray-700/40 text-gray-400 text-[10px] mr-1">Ctrl+Enter</kbd>
        Run &nbsp;|&nbsp;
        <kbd className="px-1 py-0.5 rounded bg-gray-700/40 text-gray-400 text-[10px] mr-1">Ctrl+S</kbd>
        Save &nbsp;|&nbsp;
        <kbd className="px-1 py-0.5 rounded bg-gray-700/40 text-gray-400 text-[10px] mr-1">1</kbd>
        <kbd className="px-1 py-0.5 rounded bg-gray-700/40 text-gray-400 text-[10px] mr-1">2</kbd>
        <kbd className="px-1 py-0.5 rounded bg-gray-700/40 text-gray-400 text-[10px]">3</kbd>
        &nbsp;Switch tabs (with Ctrl)
      </span>
      <span>Code Playground &copy; {new Date().getFullYear()}</span>
    </footer>
  );
}
