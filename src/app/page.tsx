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
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

/**
 * 首页 - 紧凑列表式布局
 * 不使用块状卡片，更高效利用空间
 */
export default function HomePage() {
  const { settings, todos, shoppingList, importedItems, toggleTodo, getCurrentWeekInfo } = useAppStore();

  const { week, day, stage, daysUntilDue } = getCurrentWeekInfo();
  const progress = Math.round((week / 40) * 100);

  const pendingTodos = todos.filter((t) => !t.completed);
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingShopping = shoppingList.filter((i) => !i.checked);

  const hasSettings = !!settings.dueDate;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* 未设置预产期提示 */}
      {!hasSettings && (
        <Link
          href="/settings"
          className="flex items-center justify-between p-3 mb-4 bg-gradient-to-r from-sunny-100 to-coral-50 rounded-xl border border-sunny-200 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <Settings className="text-sunny-500" size={18} />
            <span className="text-sm text-warm-700 font-medium">设置预产期，精确计算孕周</span>
          </div>
          <ChevronRight className="text-warm-400" size={18} />
        </Link>
      )}

      {/* 顶部状态栏 - 紧凑横向 */}
      <div className="flex items-center justify-between p-4 mb-4 bg-white rounded-xl border border-coral-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-coral flex items-center justify-center shadow">
            <Baby className="text-white" size={24} />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl text-warm-800">第 {week} 周</span>
              <span className="text-sm text-coral-400">第 {day} 天</span>
              <span className="text-xs text-white bg-coral-400 px-2 py-0.5 rounded-full ml-2">{stage}</span>
            </div>
            <p className="text-sm text-warm-500">距预产期 {daysUntilDue} 天</p>
          </div>
        </div>
        
        {/* 进度 */}
        <div className="hidden md:flex items-center gap-4">
          <div className="w-32">
            <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
              <div className="h-full progress-warm rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-warm-500 mt-1 text-right">{progress}% 完成</p>
          </div>
          <Link
            href="/timeline"
            className="px-4 py-2 bg-coral-50 text-coral-500 rounded-lg text-sm font-medium hover:bg-coral-100 transition-colors duration-200 cursor-pointer"
          >
            详情 →
          </Link>
        </div>
      </div>

      {/* 主内容区 - 三栏紧凑布局 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 左栏：本周待办 */}
        <div className="md:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-warm-700">
              <CheckCircle2 className="text-mint-500" size={16} />
              本周待办
            </h2>
            <span className="text-xs text-mint-500 font-medium">{completedCount}/{todos.length}</span>
          </div>
          <div className="space-y-1">
            {pendingTodos.slice(0, 5).map((todo) => (
              <label
                key={todo.id}
                className="flex items-center gap-2 p-2 hover:bg-cream-50 rounded-lg cursor-pointer transition-colors duration-150 group"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-warm-700 group-hover:text-warm-800">{todo.title}</span>
              </label>
            ))}
            {pendingTodos.length === 0 && (
              <p className="text-sm text-warm-400 py-2">全部完成 ✓</p>
            )}
          </div>
        </div>

        {/* 中栏：本周重点 + 产检 */}
        <div className="md:col-span-1">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-warm-700 mb-2">
            <AlertCircle className="text-sunny-500" size={16} />
            本周重点
          </h2>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 bg-coral-50 rounded-lg">
              <Baby className="text-coral-400 mt-0.5 flex-shrink-0" size={14} />
              <div>
                <p className="text-xs text-coral-400 font-medium">胎儿发育</p>
                <p className="text-sm text-warm-700">宝宝约 30cm，能听到声音了</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-sunny-50 rounded-lg">
              <Calendar className="text-sunny-500 mt-0.5 flex-shrink-0" size={14} />
              <div>
                <p className="text-xs text-sunny-500 font-medium">产检提醒</p>
                <p className="text-sm text-warm-700">糖耐量测试（24-28周）</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-mint-50 rounded-lg">
              <Sparkles className="text-mint-500 mt-0.5 flex-shrink-0" size={14} />
              <div>
                <p className="text-xs text-mint-500 font-medium">注意事项</p>
                <p className="text-sm text-warm-700">记录胎动，每天 10 次以上</p>
              </div>
            </div>
          </div>
          <Link
            href={`/timeline?week=${week}`}
            className="block mt-2 text-xs text-coral-400 hover:text-coral-500 font-medium cursor-pointer"
          >
            查看更多 →
          </Link>
        </div>

        {/* 右栏：本周购买 */}
        <div className="md:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-warm-700">
              <ShoppingBag className="text-lavender-400" size={16} />
              本周购买
            </h2>
            <Link href="/shopping" className="text-xs text-lavender-400 hover:text-lavender-500 font-medium cursor-pointer">
              全部
            </Link>
          </div>
          <div className="space-y-1">
            {pendingShopping.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 hover:bg-cream-50 rounded-lg transition-colors duration-150"
              >
                <span className="text-sm text-warm-700">{item.name}</span>
                {item.source === 'xiaohongshu' && (
                  <span className="text-xs text-red-400">小红书</span>
                )}
              </div>
            ))}
            {pendingShopping.length === 0 && (
              <p className="text-sm text-warm-400 py-2">暂无待购</p>
            )}
          </div>
        </div>
      </div>

      {/* 底部：小红书导入 - 单行紧凑 */}
      {importedItems.length > 0 && (
        <div className="flex items-center gap-3 mt-4 py-2 border-t border-cream-200">
          <Bookmark className="text-warm-400 flex-shrink-0" size={14} />
          <span className="text-xs text-warm-500">最近导入：</span>
          <div className="flex gap-2 overflow-x-auto flex-1">
            {importedItems.slice(0, 4).map((item) => (
              <span
                key={item.id}
                className="flex-shrink-0 text-xs text-warm-600 bg-cream-100 px-2 py-1 rounded hover:bg-cream-200 cursor-pointer transition-colors duration-150"
              >
                {item.sourceTitle.length > 10 ? `${item.sourceTitle.slice(0, 10)}...` : item.sourceTitle}
              </span>
            ))}
          </div>
          <Link href="/import" className="text-xs text-warm-500 hover:text-warm-600 cursor-pointer flex-shrink-0">
            管理
          </Link>
        </div>
      )}
    </div>
  );
}
