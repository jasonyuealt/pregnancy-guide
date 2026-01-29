'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  ShoppingBag,
  FileInput,
  Settings,
  Baby,
} from 'lucide-react';

/**
 * 导航项配置 - 精简版
 */
const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/timeline', label: '孕期时间轴', icon: Calendar },
  { href: '/shopping', label: '购物清单', icon: ShoppingBag },
  { href: '/import', label: '导入管理', icon: FileInput },
];

/**
 * 侧边栏组件 - 简洁版
 */
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white border-r border-coral-100 flex-shrink-0 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-coral-50">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-xl gradient-coral flex items-center justify-center shadow">
            <Baby className="text-white" size={22} />
          </div>
          <span className="font-display text-lg text-warm-800">孕期指南</span>
        </Link>
      </div>

      {/* 导航 */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive ? 'active text-coral-500' : 'text-warm-600 hover:text-coral-500'}`}
            >
              <Icon size={18} />
              <span className={isActive ? 'font-semibold' : 'font-medium'}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* 底部设置 */}
      <div className="p-3 border-t border-coral-50">
        <Link
          href="/settings"
          className={`sidebar-item ${pathname === '/settings' ? 'active text-coral-500' : 'text-warm-500 hover:text-coral-500'}`}
        >
          <Settings size={18} />
          <span className="font-medium">设置</span>
        </Link>
      </div>
    </aside>
  );
}
