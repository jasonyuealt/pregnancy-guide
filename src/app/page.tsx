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
} from 'lucide-react';
import Link from 'next/link';

/**
 * 首页 - 简洁清爽版
 * 核心信息一目了然，不堆砌内容
 */
export default function HomePage() {
  const { settings, todos, shoppingList, importedItems, toggleTodo, getCurrentWeekInfo } = useAppStore();

  const { week, day, stage, daysUntilDue } = getCurrentWeekInfo();
  const progress = Math.round((week / 40) * 100);

  // 本周待办（未完成的前4个）
  const pendingTodos = todos.filter((t) => !t.completed).slice(0, 4);
  // 本周购物（未购买的前3个）
  const pendingShopping = shoppingList.filter((i) => !i.checked).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto">
      {/* 顶部：孕周进度 */}
      <div className="card-soft p-6 mb-6 border border-coral-100">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-coral flex items-center justify-center shadow-lg">
              <Baby className="text-white" size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-3xl text-warm-800">第 {week} 周</span>
                <span className="text-sm text-coral-400 font-medium">第 {day} 天</span>
              </div>
              <p className="text-warm-600 mt-1">{stage} · 距预产期 {daysUntilDue} 天</p>
            </div>
          </div>
          <Link
            href="/timeline"
            className="px-5 py-2.5 bg-coral-50 text-coral-500 rounded-xl font-semibold hover:bg-coral-100 transition-colors duration-200 cursor-pointer flex items-center gap-1"
          >
            查看详情 <ChevronRight size={16} />
          </Link>
        </div>
        
        {/* 进度条 */}
        <div className="h-3 bg-cream-200 rounded-full overflow-hidden">
          <div
            className="h-full progress-warm rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-warm-500 mt-2">
          <span>孕早期</span>
          <span>孕中期</span>
          <span>孕晚期</span>
        </div>
      </div>

      {/* 两栏布局 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* 本周待办 */}
        <div className="card-soft p-5 border border-mint-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-mint-500" size={20} />
              <h3 className="font-display text-lg text-warm-800">本周待办</h3>
            </div>
            <span className="text-xs text-mint-500 bg-mint-100 px-2 py-1 rounded-full font-medium">
              {todos.filter(t => t.completed).length}/{todos.length}
            </span>
          </div>
          
          {pendingTodos.length > 0 ? (
            <div className="space-y-2">
              {pendingTodos.map((todo) => (
                <label
                  key={todo.id}
                  className="flex items-center gap-3 p-3 bg-cream-50 hover:bg-cream-100 rounded-xl cursor-pointer transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 rounded-lg"
                  />
                  <span className="text-sm text-warm-700 font-medium">{todo.title}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-warm-500 text-center py-4">本周待办已全部完成</p>
          )}
        </div>

        {/* 本周购买 */}
        <div className="card-soft p-5 border border-sunny-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-sunny-500" size={20} />
              <h3 className="font-display text-lg text-warm-800">本周购买</h3>
            </div>
            <Link
              href="/shopping"
              className="text-xs text-sunny-500 hover:text-sunny-600 font-medium cursor-pointer"
            >
              查看全部
            </Link>
          </div>
          
          {pendingShopping.length > 0 ? (
            <div className="space-y-2">
              {pendingShopping.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-cream-50 rounded-xl"
                >
                  <span className="text-sm text-warm-700 font-medium">{item.name}</span>
                  {item.source === 'xiaohongshu' && (
                    <span className="text-xs text-red-400 bg-red-50 px-2 py-0.5 rounded-full">小红书</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-warm-500 text-center py-4">暂无待购物品</p>
          )}
        </div>
      </div>

      {/* 本周重点 - 简化版 */}
      <div className="card-soft p-5 mb-6 border border-coral-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-coral-400" size={20} />
            <h3 className="font-display text-lg text-warm-800">本周重点</h3>
          </div>
          <Link
            href={`/timeline?week=${week}`}
            className="text-xs text-coral-400 hover:text-coral-500 font-medium cursor-pointer"
          >
            了解更多
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-coral-50 to-coral-100 rounded-2xl">
            <p className="text-xs text-coral-400 mb-1 font-medium">胎儿发育</p>
            <p className="text-sm text-warm-700 font-medium">宝宝约 30cm，能听到声音了</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-sunny-50 to-sunny-100 rounded-2xl">
            <p className="text-xs text-sunny-500 mb-1 font-medium">重要检查</p>
            <p className="text-sm text-warm-700 font-medium">糖耐量测试（24-28周）</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-mint-50 to-mint-100 rounded-2xl">
            <p className="text-xs text-mint-500 mb-1 font-medium">注意事项</p>
            <p className="text-sm text-warm-700 font-medium">记录胎动，每天 10 次以上</p>
          </div>
        </div>
      </div>

      {/* 小红书最近导入 - 淡化处理 */}
      {importedItems.length > 0 && (
        <div className="p-4 bg-cream-100 rounded-2xl border border-cream-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bookmark className="text-warm-500" size={16} />
              <span className="text-sm text-warm-600 font-medium">最近导入</span>
            </div>
            <Link
              href="/import"
              className="text-xs text-warm-500 hover:text-warm-600 cursor-pointer"
            >
              管理
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {importedItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 px-3 py-2 bg-white rounded-xl text-xs text-warm-600 font-medium"
              >
                {item.sourceTitle.slice(0, 15)}...
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
