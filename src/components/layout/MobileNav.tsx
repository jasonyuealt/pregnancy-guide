'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, ShoppingBag, Settings } from 'lucide-react';

/**
 * 移动端底部导航
 */
const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/timeline', label: '时间轴', icon: Calendar },
  { href: '/shopping', label: '购物', icon: ShoppingBag },
  { href: '/settings', label: '设置', icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-coral-100 md:hidden z-40 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-coral-500'
                  : 'text-warm-500'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-coral-100' : ''}`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
