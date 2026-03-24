import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IMC 模拟器",
  description: "整合营销传播（IMC）决策模拟器（本地离线版）",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,255,170,0.16) 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="relative min-h-screen">{children}</div>
      </body>
    </html>
  );
}

