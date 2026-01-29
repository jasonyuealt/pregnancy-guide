'use client';

import { useAppStore } from '@/bloc/app.bloc';
import {
  Baby,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  AlertCircle,
  Settings,
  Sparkles,
  Heart,
  Apple,
  Footprints,
  Stethoscope,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

/**
 * 首页 - 充实内容 + 紧凑布局
 */
export default function HomePage() {
  const { settings, todos, shoppingList, toggleTodo, getCurrentWeekInfo } = useAppStore();

  const { week, day, totalDays, stage, daysUntilDue } = getCurrentWeekInfo();
  const progress = Math.round((totalDays / 280) * 100);

  const pendingTodos = todos.filter((t) => !t.completed);
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingShopping = shoppingList.filter((i) => !i.checked);
  const hasSettings = !!settings.dueDate;

  return (
    <div className="animate-fade-in min-h-[calc(100vh-4rem)]">
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

      {/* 顶部状态栏 - 中国标准格式 孕X+Y */}
      <div className="flex items-center gap-5 mb-5 p-5 card-soft border border-coral-100">
        <div className="w-16 h-16 rounded-2xl gradient-coral flex items-center justify-center shadow-lg flex-shrink-0">
          <Baby className="text-white" size={32} />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-display text-3xl text-warm-800">孕{week}</span>
            <span className="text-xl text-coral-400 font-bold">+{day}</span>
            <span className="text-xs text-warm-500 bg-cream-200 px-2 py-0.5 rounded-full ml-2">{stage}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-warm-600">距预产期 <strong className="text-coral-500">{daysUntilDue}</strong> 天</span>
            <div className="flex-1 h-2 bg-cream-200 rounded-full overflow-hidden max-w-md">
              <div className="h-full progress-warm rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm text-warm-600 font-medium">{progress}%</span>
          </div>
        </div>
        <Link
          href="/timeline"
          className="px-5 py-2.5 gradient-coral text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-1 flex-shrink-0"
        >
          查看详情 <ChevronRight size={16} />
        </Link>
      </div>

      {/* 主内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 左栏：本周待办 */}
        <div className="card-soft p-5 border border-mint-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-mint-500" size={18} />
              <span className="font-display text-lg text-warm-800">本周待办</span>
            </div>
            <span className="text-xs text-white font-bold bg-mint-400 px-2.5 py-1 rounded-full">
              {completedCount}/{todos.length}
            </span>
          </div>
          <div className="space-y-2 flex-1">
            {todos.map((todo) => (
              <label
                key={todo.id}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                  todo.completed ? 'bg-mint-50 border border-mint-100' : 'bg-cream-50 hover:bg-cream-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-5 h-5 rounded-lg"
                />
                <span className={`text-sm ${todo.completed ? 'text-warm-500 line-through' : 'text-warm-700'}`}>
                  {todo.title}
                </span>
                {todo.completed && <CheckCircle2 size={14} className="text-mint-400 ml-auto" />}
              </label>
            ))}
          </div>
          <button className="mt-4 w-full py-2.5 border-2 border-dashed border-mint-200 rounded-xl text-sm text-mint-500 font-medium hover:border-mint-400 hover:bg-mint-50 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1">
            <Plus size={16} />
            添加待办
          </button>
        </div>

        {/* 中栏：本周重点 */}
        <div className="card-soft p-5 border border-coral-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-coral-400" size={18} />
              <span className="font-display text-lg text-warm-800">本周重点</span>
            </div>
            <Link href={`/timeline?week=${week}`} className="text-xs text-coral-400 hover:text-coral-500 font-medium cursor-pointer">
              了解更多
            </Link>
          </div>
          <div className="space-y-3 flex-1">
            <div className="p-4 bg-gradient-to-r from-coral-50 to-coral-100/30 rounded-xl border border-coral-200">
              <div className="flex items-center gap-2 mb-2">
                <Baby className="text-coral-400" size={16} />
                <span className="text-xs text-coral-500 font-bold">胎儿发育</span>
              </div>
              <p className="text-sm text-warm-700 leading-relaxed">宝宝约 30cm，600g，像木瓜大小。听力发育完善，可以听到外界声音了！</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-sunny-50 to-sunny-100/30 rounded-xl border border-sunny-200">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="text-sunny-500" size={16} />
                <span className="text-xs text-sunny-600 font-bold">重要产检</span>
              </div>
              <p className="text-sm text-warm-700 leading-relaxed">糖耐量测试（OGTT），24-28周必做，筛查妊娠糖尿病。</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-mint-50 to-mint-100/30 rounded-xl border border-mint-200">
              <div className="flex items-center gap-2 mb-2">
                <Footprints className="text-mint-500" size={16} />
                <span className="text-xs text-mint-600 font-bold">注意事项</span>
              </div>
              <p className="text-sm text-warm-700 leading-relaxed">记录胎动，每天应感受 10 次以上，注意宝宝的活动规律。</p>
            </div>
          </div>
        </div>

        {/* 右栏：本周购买 + 饮食建议 */}
        <div className="space-y-5">
          {/* 本周购买 */}
          <div className="card-soft p-5 border border-sunny-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-sunny-500" size={18} />
                <span className="font-display text-lg text-warm-800">本周购买</span>
              </div>
              <Link href="/shopping" className="text-xs text-sunny-500 hover:text-sunny-600 font-medium cursor-pointer">
                查看全部
              </Link>
            </div>
            <div className="space-y-2">
              {shoppingList.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    item.checked ? 'bg-mint-50 border border-mint-100' : 'bg-cream-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={item.checked} readOnly className="w-4 h-4 rounded" />
                    <span className={`text-sm ${item.checked ? 'text-warm-500 line-through' : 'text-warm-700'}`}>
                      {item.name}
                    </span>
                  </div>
                  {item.source === 'xiaohongshu' && (
                    <span className="text-xs text-red-400 bg-red-50 px-2 py-0.5 rounded-full">小红书</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 饮食建议 */}
          <div className="card-soft p-5 border border-lavender-100">
            <div className="flex items-center gap-2 mb-4">
              <Apple className="text-lavender-400" size={18} />
              <span className="font-display text-lg text-warm-800">饮食建议</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-2">
                <Heart className="text-coral-400 mt-0.5 flex-shrink-0" size={14} />
                <span className="text-sm text-warm-600">增加蛋白质摄入（鱼、蛋、奶）</span>
              </div>
              <div className="flex items-start gap-2 p-2">
                <Heart className="text-coral-400 mt-0.5 flex-shrink-0" size={14} />
                <span className="text-sm text-warm-600">多吃富含铁的食物，预防贫血</span>
              </div>
              <div className="flex items-start gap-2 p-2">
                <Heart className="text-coral-400 mt-0.5 flex-shrink-0" size={14} />
                <span className="text-sm text-warm-600">控制糖分摄入，预防妊娠糖尿病</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部：AI 入口 */}
      <Link
        href="/timeline"
        className="block mt-5 card-soft p-5 border border-lavender-100 bg-gradient-to-r from-lavender-50 to-coral-50 hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow">
            <Sparkles className="text-lavender-400" size={28} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-warm-800 text-lg">AI 生成本周完整内容</p>
            <p className="text-sm text-warm-500">胎儿发育、注意事项、产检提醒、购物建议</p>
          </div>
          <ChevronRight className="text-warm-400" size={24} />
        </div>
      </Link>
    </div>
  );
}
