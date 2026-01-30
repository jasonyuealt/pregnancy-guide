'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  ShoppingBag,
  Settings,
  Baby,
  Sparkles,
} from 'lucide-react';

/**
 * 导航项配置 - 简化版（4个主页面）
 */
const navItems = [
  { href: '/', label: '首页', icon: Home, description: '孕周概览' },
  { href: '/content', label: '我的内容', icon: BookOpen, description: '笔记管理' },
  { href: '/shopping', label: '购物清单', icon: ShoppingBag, description: '待购物品' },
];

/**
 * 侧边栏组件 - 温馨母婴风格
 */
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-neutral-soft flex-shrink-0 flex-col h-screen sticky top-0">
      {/* Logo 区域 */}
      <div className="p-6 border-b border-neutral-soft">
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-peach-400 flex items-center justify-center shadow-gentle group-hover:shadow-soft transition-shadow">
            <Baby className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <span className="font-display text-xl text-text-primary block">孕期时光</span>
            <span className="text-xs text-text-secondary flex items-center gap-1">
              <Sparkles size={10} />
              AI 智能助手
            </span>
          </div>
        </Link>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 py-6 px-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="sidebar-item group"
              >
                <div className={`flex items-center gap-3 w-full ${
                  isActive ? 'sidebar-item active' : ''
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-gradient-to-br from-pink-400 to-peach-400 text-white shadow-gentle'
                      : 'bg-cream-100 text-text-secondary group-hover:bg-pink-50'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium transition-colors ${
                      isActive ? 'text-pink-600' : 'text-text-primary'
                    }`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-text-soft">{item.description}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 底部设置 */}
      <div className="p-4 border-t border-neutral-soft">
        <Link
          href="/settings"
          className="sidebar-item"
        >
          <div className={`flex items-center gap-3 w-full ${
            pathname === '/settings' ? 'sidebar-item active' : ''
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              pathname === '/settings'
                ? 'bg-gradient-to-br from-pink-400 to-peach-400 text-white shadow-gentle'
                : 'bg-cream-100 text-text-secondary'
            }`}>
              <Settings size={20} />
            </div>
            <div className="flex-1">
              <div className={`font-medium transition-colors ${
                pathname === '/settings' ? 'text-pink-600' : 'text-text-primary'
              }`}>
                设置
              </div>
              <div className="text-xs text-text-soft">孕期配置</div>
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
