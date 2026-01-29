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
 * 首页 - 简洁清爽版
 * 优化空间利用 + 移动端适配 + 动画效果
 */
export default function HomePage() {
  const { settings, todos, shoppingList, importedItems, toggleTodo, getCurrentWeekInfo } = useAppStore();

  const { week, day, stage, daysUntilDue } = getCurrentWeekInfo();
  const progress = Math.round((week / 40) * 100);

  // 本周待办（未完成的前4个）
  const pendingTodos = todos.filter((t) => !t.completed).slice(0, 4);
  const completedCount = todos.filter((t) => t.completed).length;
  // 本周购物（未购买的前3个）
  const pendingShopping = shoppingList.filter((i) => !i.checked).slice(0, 3);

  // 检查是否已设置预产期
  const hasSettings = !!settings.dueDate;

  return (
    <div className="max-w-4xl mx-auto">
      {/* 未设置预产期提示 */}
      {!hasSettings && (
        <Link
          href="/settings"
          className="block mb-4 p-4 bg-gradient-to-r from-sunny-100 to-coral-100 rounded-2xl border border-sunny-200 animate-fade-in-up"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Settings className="text-sunny-500" size={20} />
              </div>
              <div>
                <p className="font-semibold text-warm-800">设置预产期</p>
                <p className="text-sm text-warm-600">填写后可精确计算孕周</p>
              </div>
            </div>
            <ChevronRight className="text-warm-500" size={20} />
          </div>
        </Link>
      )}

      {/* 顶部：孕周进度 */}
      <div className="card-soft p-4 md:p-6 mb-4 md:mb-6 border border-coral-100 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl gradient-coral flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105">
              <Baby className="text-white" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl md:text-3xl text-warm-800">第 {week} 周</span>
                <span className="text-xs md:text-sm text-coral-400 font-medium">第 {day} 天</span>
              </div>
              <p className="text-sm text-warm-600">{stage} · 距预产期 {daysUntilDue} 天</p>
            </div>
          </div>
          <Link
            href="/timeline"
            className="hidden md:flex px-5 py-2.5 bg-coral-50 text-coral-500 rounded-xl font-semibold hover:bg-coral-100 transition-all duration-200 cursor-pointer items-center gap-1"
          >
            查看详情 <ChevronRight size={16} />
          </Link>
        </div>
        
        {/* 进度条 */}
        <div className="h-2.5 md:h-3 bg-cream-200 rounded-full overflow-hidden">
          <div
            className="h-full progress-warm rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-warm-500 mt-2">
          <span>孕早期</span>
          <span>孕中期</span>
          <span>孕晚期</span>
        </div>
      </div>

      {/* 本周重点 - 横向紧凑布局 */}
      <div className="card-soft p-4 md:p-5 mb-4 md:mb-6 border border-coral-100 animate-fade-in-up stagger-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-coral-400" size={18} />
            <h3 className="font-display text-base md:text-lg text-warm-800">本周重点</h3>
          </div>
          <Link
            href={`/timeline?week=${week}`}
            className="text-xs text-coral-400 hover:text-coral-500 font-medium cursor-pointer transition-colors duration-200"
          >
            了解更多
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-coral-50 to-coral-100/50 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              <Baby className="text-coral-400" size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-coral-400 font-medium">胎儿</p>
              <p className="text-sm text-warm-700 truncate">宝宝约 30cm，能听到声音</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-sunny-50 to-sunny-100/50 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              <Calendar className="text-sunny-500" size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-sunny-500 font-medium">产检</p>
              <p className="text-sm text-warm-700 truncate">糖耐量测试（24-28周）</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-mint-50 to-mint-100/50 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              <AlertCircle className="text-mint-500" size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-mint-500 font-medium">注意</p>
              <p className="text-sm text-warm-700 truncate">记录胎动，每天 10 次以上</p>
            </div>
          </div>
        </div>
      </div>

      {/* 两栏/单栏：待办 + 购物 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4">
        {/* 本周待办 */}
        <div className="card-soft p-4 md:p-5 border border-mint-100 animate-fade-in-up stagger-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-mint-500" size={18} />
              <h3 className="font-display text-base md:text-lg text-warm-800">本周待办</h3>
            </div>
            <span className="text-xs text-white font-bold bg-mint-400 px-2 py-0.5 rounded-full">
              {completedCount}/{todos.length}
            </span>
          </div>
          
          {pendingTodos.length > 0 ? (
            <div className="space-y-1.5">
              {pendingTodos.map((todo, idx) => (
                <label
                  key={todo.id}
                  className={`flex items-center gap-3 p-2.5 bg-cream-50 hover:bg-cream-100 rounded-xl cursor-pointer transition-all duration-200 animate-fade-in stagger-${idx + 1}`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-4 h-4 rounded-lg transition-transform duration-200 hover:scale-110"
                  />
                  <span className="text-sm text-warm-700 font-medium">{todo.title}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <CheckCircle2 className="text-mint-300 mx-auto mb-2" size={32} />
              <p className="text-sm text-warm-500">本周待办已全部完成</p>
            </div>
          )}
        </div>

        {/* 本周购买 */}
        <div className="card-soft p-4 md:p-5 border border-sunny-100 animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-sunny-500" size={18} />
              <h3 className="font-display text-base md:text-lg text-warm-800">本周购买</h3>
            </div>
            <Link
              href="/shopping"
              className="text-xs text-sunny-500 hover:text-sunny-600 font-medium cursor-pointer transition-colors duration-200"
            >
              查看全部
            </Link>
          </div>
          
          {pendingShopping.length > 0 ? (
            <div className="space-y-1.5">
              {pendingShopping.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2.5 bg-cream-50 rounded-xl transition-all duration-200 hover:bg-cream-100 animate-fade-in stagger-${idx + 1}`}
                >
                  <span className="text-sm text-warm-700 font-medium">{item.name}</span>
                  {item.source === 'xiaohongshu' && (
                    <span className="text-xs text-red-400 bg-red-50 px-2 py-0.5 rounded-full">小红书</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <ShoppingBag className="text-sunny-300 mx-auto mb-2" size={32} />
              <p className="text-sm text-warm-500">暂无待购物品</p>
            </div>
          )}
        </div>
      </div>

      {/* 小红书最近导入 - 更紧凑 */}
      {importedItems.length > 0 && (
        <div className="p-3 md:p-4 bg-cream-100/80 rounded-xl md:rounded-2xl border border-cream-200 animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bookmark className="text-warm-500" size={14} />
              <span className="text-xs md:text-sm text-warm-600 font-medium">最近导入</span>
            </div>
            <Link
              href="/import"
              className="text-xs text-warm-500 hover:text-warm-600 cursor-pointer transition-colors duration-200"
            >
              管理
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {importedItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 px-3 py-1.5 bg-white rounded-lg text-xs text-warm-600 font-medium shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
              >
                {item.sourceTitle.length > 12 ? `${item.sourceTitle.slice(0, 12)}...` : item.sourceTitle}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
