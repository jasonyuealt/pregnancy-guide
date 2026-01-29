'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  ShoppingBag,
  Sparkles,
  FileInput,
  Settings,
  Baby,
  Lightbulb,
} from 'lucide-react';

/**
 * 导航项配置 - 使用 Lucide 图标替代 emoji
 */
const navItems = [
  {
    group: '主要功能',
    items: [
      { href: '/', label: '首页概览', icon: Home, color: 'bg-coral-100 text-coral-400' },
      { href: '/timeline', label: '孕期时间轴', icon: Calendar, color: 'bg-sunny-100 text-sunny-500' },
      { href: '/shopping', label: '购物清单', icon: ShoppingBag, color: 'bg-mint-100 text-mint-400' },
    ],
  },
  {
    group: '智能助手',
    items: [
      { href: '/ai-generate', label: 'AI 生成内容', icon: Sparkles, color: 'bg-lavender-100 text-lavender-400' },
      { href: '/import', label: '小红书导入', icon: FileInput, color: 'bg-coral-100 text-coral-400' },
    ],
  },
  {
    group: '其他',
    items: [
      { href: '/settings', label: '设置', icon: Settings, color: 'bg-cream-200 text-warm-600' },
    ],
  },
];

/**
 * 侧边栏组件
 * UI/UX Pro Max 优化：使用 SVG 图标替代 emoji
 */
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-coral-100 flex-shrink-0 flex flex-col h-screen sticky top-0">
      {/* Logo - 使用 Heart 图标替代 emoji */}
      <div className="p-6 border-b border-coral-50">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-12 h-12 rounded-2xl gradient-coral flex items-center justify-center shadow-lg">
            <Baby className="text-white" size={26} />
          </div>
          <div>
            <h1 className="font-display text-xl text-warm-800">孕期指南</h1>
            <p className="text-xs text-coral-400 font-medium">温馨陪伴每一天</p>
          </div>
        </Link>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 py-5 overflow-y-auto">
        {navItems.map((group) => (
          <div key={group.group} className="mb-6">
            <div className="px-5 mb-3">
              <span className="text-xs text-warm-600 font-bold tracking-wider uppercase">
                {group.group}
              </span>
            </div>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'active text-coral-500' : 'text-warm-700 hover:text-coral-500'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon size={16} />
                  </div>
                  <span className={isActive ? 'font-semibold' : 'font-medium'}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* 底部提示卡片 - 使用 Lightbulb 图标 */}
      <div className="p-4 border-t border-coral-50">
        <div className="p-4 bg-gradient-to-br from-mint-100 to-sunny-100 rounded-2xl border border-mint-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-sunny-200 flex items-center justify-center">
              <Lightbulb size={14} className="text-sunny-600" />
            </div>
            <span className="text-sm font-bold text-warm-700">今日小贴士</span>
          </div>
          <p className="text-xs text-warm-600 leading-relaxed font-medium">
            记得多喝水，保持心情愉悦，宝宝能感受到你的情绪哦~
          </p>
        </div>
      </div>
    </aside>
  );
}
