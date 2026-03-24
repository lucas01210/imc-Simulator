import type { ReactNode } from "react";

export default function MetricTile({
  label,
  value,
  sublabel,
  rightHint,
}: {
  label: string;
  value: ReactNode;
  sublabel?: string;
  rightHint?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border border-[#00ffaa]/20 bg-[#06080d]/55 px-3 py-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-[#a8b3c7]">{label}</div>
          {sublabel ? (
            <div className="text-[11px] text-[#7f8aa3]">{sublabel}</div>
          ) : null}
        </div>
        {rightHint ? <div className="text-xs text-[#00ffaa]">{rightHint}</div> : null}
      </div>
      <div className="text-xl font-bold tracking-wide text-[#e8eef6]">{value}</div>
    </div>
  );
}

