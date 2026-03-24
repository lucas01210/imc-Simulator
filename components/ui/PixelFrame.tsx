import type { ReactNode } from "react";

export default function PixelFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "border border-[#00ffaa]/30 bg-[#06080d]/70 shadow-pixel",
        className,
      ].join(" ")}
      style={{
        // Subtle pixel rounding keeps the "modern pixel" feel without childish curves.
        borderRadius: 0,
      }}
    >
      {children}
    </div>
  );
}

