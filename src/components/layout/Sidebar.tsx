'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Baby, Home, Settings } from 'lucide-react';

/**
 * 侧边栏导航 - 精简版
 */
const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/settings', label: '设置', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r border-cream-200 p-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-3 py-4 mb-4">
        <div className="w-10 h-10 rounded-xl gradient-coral flex items-center justify-center shadow-md">
          <Baby className="text-white" size={22} />
        </div>
        <span className="font-display text-xl text-warm-800">孕期指南</span>
      </Link>

      {/* 导航 */}
      <nav className="flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${
                isActive
                  ? 'bg-coral-50 text-coral-500 font-medium'
                  : 'text-warm-600 hover:bg-cream-100'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 底部信息 */}
      <div className="px-4 py-3 text-xs text-warm-400">
        温馨陪伴每一天
      </div>
    </aside>
  );
}
