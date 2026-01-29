'use client';

import { Bell, Sparkles } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showAiButton?: boolean;
  onAiClick?: () => void;
}

/**
 * 页面头部组件
 */
export default function Header({
  title,
  subtitle,
  showAiButton = true,
  onAiClick,
}: HeaderProps) {
  // 获取今天的日期
  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h2 className="font-display text-3xl text-warm-800">{title}</h2>
        <p className="text-warm-600 mt-2 font-medium">
          {subtitle || `今天是 ${dateStr}`}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {showAiButton && (
          <button
            onClick={() => onAiClick?.()}
            className="px-6 py-3 gradient-coral text-white rounded-2xl hover:opacity-90 transition shadow-lg btn-bounce flex items-center gap-2 font-semibold"
          >
            <Sparkles size={18} />
            <span>AI 生成本周内容</span>
          </button>
        )}
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center hover:bg-sunny-50 transition cursor-pointer shadow-md border border-sunny-100">
          <Bell className="text-sunny-500" size={20} />
        </div>
      </div>
    </header>
  );
}
