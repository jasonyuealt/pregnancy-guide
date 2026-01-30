'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  ShoppingBag,
  Settings,
} from 'lucide-react';

/**
 * 移动端底部导航配置 - 简化版
 */
const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/content', label: '内容', icon: BookOpen },
  { href: '/shopping', label: '购物', icon: ShoppingBag },
  { href: '/settings', label: '设置', icon: Settings },
];

/**
 * 移动端底部导航组件 - 温馨母婴风格
 */
export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-soft md:hidden z-40 safe-area-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl transition-all ${
                isActive ? 'text-pink-500' : 'text-text-secondary'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${
                isActive ? 'bg-gradient-to-br from-pink-100 to-peach-100' : ''
              }`}>
                <Icon size={22} />
              </div>
              <span className={`text-xs transition-all ${
                isActive ? 'font-semibold' : 'font-medium'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
