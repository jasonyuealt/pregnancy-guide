'use client';

import { useAppStore } from '@/bloc/app.bloc';
import {
  Baby,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  Bookmark,
  AlertCircle,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

/**
 * 首页 - 紧凑布局，减少空白
 */
export default function HomePage() {
  const { settings, todos, shoppingList, importedItems, toggleTodo, getCurrentWeekInfo } = useAppStore();

  const { week, day, stage, daysUntilDue } = getCurrentWeekInfo();
  const progress = Math.round((week / 40) * 100);

  const pendingTodos = todos.filter((t) => !t.completed).slice(0, 5);
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingShopping = shoppingList.filter((i) => !i.checked).slice(0, 4);
  const hasSettings = !!settings.dueDate;

  return (
    <div className="max-w-5xl mx-auto">
      {/* 未设置预产期提示 */}
      {!hasSettings && (
        <Link
          href="/settings"
          className="block mb-3 p-3 bg-gradient-to-r from-sunny-100 to-coral-100 rounded-xl border border-sunny-200 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="text-sunny-500" size={18} />
              <span className="font-medium text-warm-700">设置预产期，精确计算孕周</span>
            </div>
            <ChevronRight className="text-warm-500" size={18} />
          </div>
        </Link>
      )}

      {/* 顶部状态栏 - 横向紧凑 */}
      <div className="card-soft p-4 mb-3 border border-coral-100 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-coral flex items-center justify-center shadow">
              <Baby className="text-white" size={24} />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl text-warm-800">第 {week} 周</span>
                <span className="text-sm text-coral-400 font-medium">第 {day} 天</span>
                <span className="text-xs text-warm-500 bg-cream-200 px-2 py-0.5 rounded-full">{stage}</span>
              </div>
              <p className="text-sm text-warm-500">距预产期 {daysUntilDue} 天</p>
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="flex-1 max-w-xs mx-6 hidden md:block">
            <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
              <div className="h-full progress-warm rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-warm-400 mt-1">
              <span>0周</span>
              <span>{progress}%</span>
              <span>40周</span>
            </div>
          </div>

          <Link
            href="/timeline"
            className="px-4 py-2 bg-coral-50 text-coral-500 rounded-lg font-medium hover:bg-coral-100 transition-colors cursor-pointer flex items-center gap-1 text-sm"
          >
            详情 <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* 三栏布局 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* 左栏：待办 */}
        <div className="md:col-span-5 card-soft p-4 border border-mint-100 animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-mint-500" size={18} />
              <h3 className="font-display text-base text-warm-800">本周待办</h3>
            </div>
            <span className="text-xs text-white font-bold bg-mint-400 px-2 py-0.5 rounded-full">
              {completedCount}/{todos.length}
            </span>
          </div>
          <div className="space-y-1">
            {pendingTodos.map((todo) => (
              <label
                key={todo.id}
                className="flex items-center gap-2 p-2 hover:bg-cream-50 rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-warm-700">{todo.title}</span>
              </label>
            ))}
            {pendingTodos.length === 0 && (
              <p className="text-sm text-warm-400 text-center py-3">全部完成 ✓</p>
            )}
          </div>
        </div>

        {/* 中栏：本周重点 + 购物 */}
        <div className="md:col-span-4 space-y-3">
          {/* 本周重点 */}
          <div className="card-soft p-4 border border-coral-100 animate-fade-in-up stagger-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-coral-400" size={18} />
                <h3 className="font-display text-base text-warm-800">本周重点</h3>
              </div>
              <Link href={`/timeline?week=${week}`} className="text-xs text-coral-400 cursor-pointer">
                更多
              </Link>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-coral-50 rounded-lg">
                <Baby className="text-coral-400 flex-shrink-0" size={14} />
                <span className="text-xs text-warm-700">宝宝约 30cm，能听到声音</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-sunny-50 rounded-lg">
                <Calendar className="text-sunny-500 flex-shrink-0" size={14} />
                <span className="text-xs text-warm-700">糖耐量测试（24-28周）</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-mint-50 rounded-lg">
                <AlertCircle className="text-mint-500 flex-shrink-0" size={14} />
                <span className="text-xs text-warm-700">记录胎动，每天 10 次以上</span>
              </div>
            </div>
          </div>

          {/* 购物 */}
          <div className="card-soft p-4 border border-sunny-100 animate-fade-in-up stagger-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-sunny-500" size={18} />
                <h3 className="font-display text-base text-warm-800">本周购买</h3>
              </div>
              <Link href="/shopping" className="text-xs text-sunny-500 cursor-pointer">
                全部
              </Link>
            </div>
            <div className="space-y-1.5">
              {pendingShopping.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-cream-100 last:border-0">
                  <span className="text-sm text-warm-700">{item.name}</span>
                  {item.source === 'xiaohongshu' && (
                    <span className="text-xs text-red-400">小红书</span>
                  )}
                </div>
              ))}
              {pendingShopping.length === 0 && (
                <p className="text-sm text-warm-400 text-center py-2">暂无待购</p>
              )}
            </div>
          </div>
        </div>

        {/* 右栏：小红书导入 */}
        <div className="md:col-span-3 card-soft p-4 border border-cream-200 animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bookmark className="text-warm-500" size={18} />
              <h3 className="font-display text-base text-warm-800">小红书</h3>
            </div>
            <Link href="/import" className="text-xs text-warm-500 cursor-pointer">
              管理
            </Link>
          </div>
          <div className="space-y-2">
            {importedItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-2 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
              >
                <p className="text-xs text-warm-700 line-clamp-2">{item.sourceTitle}</p>
              </div>
            ))}
            {importedItems.length === 0 && (
              <p className="text-xs text-warm-400 text-center py-4">点击右下角按钮导入</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
