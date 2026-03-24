import type { ReactNode } from "react";

export default function PixelPanel({
  title,
  hint,
  right,
  children,
  className = "",
}: {
  title?: string;
  hint?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "border border-[#00ffaa]/16 bg-[#06080d]/35 shadow-pixel",
        "px-4 py-3 sm:px-5 sm:py-4",
        className,
      ].join(" ")}
    >
      {title ? (
        <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="flex items-baseline gap-3">
            <div className="text-sm font-bold text-[#e8eef6]">{title}</div>
            {hint ? <div className="text-xs text-[#7f8aa3]">{hint}</div> : null}
          </div>
          {right ? (
            <div className="text-xs text-[#7f8aa3] sm:text-right">{right}</div>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

