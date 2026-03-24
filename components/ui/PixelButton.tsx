import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

export default function PixelButton({
  children,
  className = "",
  href,
  ...props
}: {
  children: ReactNode;
  className?: string;
  href?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const classNames = [
    "relative inline-flex items-center justify-center gap-2",
    "border border-[#00ffaa]/35 bg-[#070a0f]/80",
    "px-4 py-2 text-sm font-semibold text-[#e8eef6]",
    "shadow-pixel",
    "transition-transform duration-150 active:translate-y-[1px] active:shadow-none",
    "hover:brightness-110",
    className,
  ].join(" ");

  const inner = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150 hover:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,255,170,0.18), transparent 35%, rgba(0,255,170,0.12))",
        }}
      />
      <span className="relative">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classNames}>
        {inner}
      </Link>
    );
  }

  return (
    <button {...props} className={classNames}>
      {inner}
    </button>
  );
}

