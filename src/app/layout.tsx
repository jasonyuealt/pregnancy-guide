import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import QuickImport from "@/components/common/QuickImport";

export const metadata: Metadata = {
  title: "孕期指南 - 小红书知识整理助手",
  description: "从小红书收集孕期知识，AI智能分析整理，按孕周归纳展示",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

/**
 * 根布局组件
 * PC: 侧边栏 + 主内容
 * 移动端: 底部导航 + 主内容
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <div className="flex min-h-screen">
          {/* PC 侧边栏 */}
          <Sidebar />
          
          {/* 主内容区域 */}
          <main className="flex-1 p-4 md:p-8 bg-gray-50 pb-20 md:pb-8">
            {children}
          </main>
        </div>
        
        {/* 移动端底部导航 */}
        <MobileNav />
        
        {/* 快速导入按钮（全局） */}
        <QuickImport />
      </body>
    </html>
  );
}
