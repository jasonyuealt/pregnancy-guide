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
 * 首页 - PC 宽屏紧凑布局
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
    <div className="animate-fade-in">
      {/* 未设置预产期提示 */}
      {!hasSettings && (
        <Link
          href="/settings"
          className="block mb-4 p-3 bg-gradient-to-r from-sunny-100 to-coral-100 rounded-xl border border-sunny-200"
        >
          <div className="flex items-center gap-3">
            <Settings className="text-sunny-500" size={18} />
            <span className="text-sm text-warm-700 font-medium">设置预产期以精确计算孕周</span>
            <ChevronRight className="text-warm-500 ml-auto" size={16} />
          </div>
        </Link>
      )}

      {/* 顶部状态栏 - 横向紧凑 */}
      <div className="flex items-center gap-4 mb-4 p-4 card-soft border border-coral-100">
        <div className="w-14 h-14 rounded-xl gradient-coral flex items-center justify-center shadow-lg flex-shrink-0">
          <Baby className="text-white" size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl text-warm-800">第 {week} 周</span>
            <span className="text-sm text-coral-400 font-medium">第 {day} 天</span>
            <span className="text-xs text-warm-500 bg-cream-200 px-2 py-0.5 rounded-full ml-2">{stage}</span>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-sm text-warm-600">距预产期 {daysUntilDue} 天</span>
            <div className="flex-1 h-1.5 bg-cream-200 rounded-full overflow-hidden max-w-xs">
              <div className="h-full progress-warm rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-warm-500">{progress}%</span>
          </div>
        </div>
        <Link
          href="/timeline"
          className="px-4 py-2 bg-coral-50 text-coral-500 rounded-lg font-medium hover:bg-coral-100 transition-colors duration-200 cursor-pointer flex items-center gap-1 flex-shrink-0"
        >
          详情 <ChevronRight size={14} />
        </Link>
      </div>

      {/* 三栏布局 - 充分利用宽屏 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 左栏：本周待办 */}
        <div className="card-soft p-4 border border-mint-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-mint-500" size={16} />
              <span className="font-semibold text-warm-800">本周待办</span>
            </div>
            <span className="text-xs text-white font-bold bg-mint-400 px-2 py-0.5 rounded-full">
              {completedCount}/{todos.length}
            </span>
          </div>
          <div className="space-y-1">
            {pendingTodos.slice(0, 5).map((todo) => (
              <label
                key={todo.id}
                className="flex items-center gap-2 p-2 bg-cream-50 hover:bg-cream-100 rounded-lg cursor-pointer transition-colors duration-150"
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
              <p className="text-sm text-warm-500 text-center py-3">全部完成 ✓</p>
            )}
          </div>
        </div>

        {/* 中栏：本周重点 */}
        <div className="card-soft p-4 border border-coral-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-coral-400" size={16} />
              <span className="font-semibold text-warm-800">本周重点</span>
            </div>
            <Link href={`/timeline?week=${week}`} className="text-xs text-coral-400 hover:text-coral-500 cursor-pointer">
              更多
            </Link>
          </div>
          <div className="space-y-2">
            <div className="p-2.5 bg-gradient-to-r from-coral-50 to-transparent rounded-lg border-l-2 border-coral-300">
              <p className="text-xs text-coral-400 font-medium">胎儿发育</p>
              <p className="text-sm text-warm-700">宝宝约 30cm，能听到声音了</p>
            </div>
            <div className="p-2.5 bg-gradient-to-r from-sunny-50 to-transparent rounded-lg border-l-2 border-sunny-400">
              <p className="text-xs text-sunny-500 font-medium">重要产检</p>
              <p className="text-sm text-warm-700">糖耐量测试（24-28周）</p>
            </div>
            <div className="p-2.5 bg-gradient-to-r from-mint-50 to-transparent rounded-lg border-l-2 border-mint-400">
              <p className="text-xs text-mint-500 font-medium">注意事项</p>
              <p className="text-sm text-warm-700">记录胎动，每天 10 次以上</p>
            </div>
          </div>
        </div>

        {/* 右栏：本周购买 */}
        <div className="card-soft p-4 border border-sunny-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-sunny-500" size={16} />
              <span className="font-semibold text-warm-800">本周购买</span>
            </div>
            <Link href="/shopping" className="text-xs text-sunny-500 hover:text-sunny-600 cursor-pointer">
              全部
            </Link>
          </div>
          <div className="space-y-1">
            {pendingShopping.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-cream-50 rounded-lg"
              >
                <span className="text-sm text-warm-700">{item.name}</span>
                {item.source === 'xiaohongshu' && (
                  <span className="text-xs text-red-400">小红书</span>
                )}
              </div>
            ))}
            {pendingShopping.length === 0 && (
              <p className="text-sm text-warm-500 text-center py-3">暂无待购</p>
            )}
          </div>
        </div>
      </div>

      {/* 底部：小红书导入 + AI 生成入口 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* 最近导入 */}
        {importedItems.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-cream-100/60 rounded-xl border border-cream-200">
            <Bookmark className="text-warm-500 flex-shrink-0" size={16} />
            <span className="text-sm text-warm-600">最近导入:</span>
            <div className="flex gap-2 overflow-x-auto flex-1">
              {importedItems.slice(0, 2).map((item) => (
                <span key={item.id} className="text-xs bg-white px-2 py-1 rounded-md text-warm-600 whitespace-nowrap">
                  {item.sourceTitle.length > 10 ? `${item.sourceTitle.slice(0, 10)}...` : item.sourceTitle}
                </span>
              ))}
            </div>
            <Link href="/import" className="text-xs text-warm-500 hover:text-warm-600 flex-shrink-0 cursor-pointer">
              管理
            </Link>
          </div>
        )}

        {/* AI 生成提示 */}
        <Link
          href="/timeline"
          className="flex items-center gap-3 p-3 bg-gradient-to-r from-lavender-50 to-coral-50 rounded-xl border border-lavender-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
            <Sparkles className="text-lavender-400" size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-warm-700">AI 生成本周内容</p>
            <p className="text-xs text-warm-500">获取专业孕期指导</p>
          </div>
          <ChevronRight className="text-warm-400" size={16} />
        </Link>
      </div>
    </div>
  );
}
