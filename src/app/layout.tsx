import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import QuickImport from "@/components/common/QuickImport";

export const metadata: Metadata = {
  title: "孕期指南 - 温馨陪伴每一天",
  description: "帮助准妈妈全面了解孕期知识、合理安排孕期生活的网站应用",
  icons: {
    icon: "/favicon.svg",
  },
};

/**
 * 根布局组件
 * 包含侧边栏、主内容区域、全局快速导入悬浮按钮
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
          {/* 侧边栏 */}
          <Sidebar />
          
          {/* 主内容区域 */}
          <main className="flex-1 p-8 bg-cream-100">
            {children}
          </main>
        </div>
        
        {/* 全局悬浮：快速导入小红书 */}
        <QuickImport />
      </body>
    </html>
  );
}
