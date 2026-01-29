'use client';

import { useAppStore } from '@/bloc/app.bloc';
import Header from '@/components/layout/Header';
import {
  Baby,
  Calendar,
  ShoppingCart,
  Package,
  CheckCircle2,
  ChevronRight,
  Plus,
  Bookmark,
  Users,
  AlertCircle,
  Scale,
  Stethoscope,
  ShoppingBag,
  Heart,
  Activity,
} from 'lucide-react';

/**
 * 首页仪表盘
 * UI/UX Pro Max 优化：SVG 图标替代 emoji，cursor-pointer，过渡动画
 */
export default function HomePage() {
  const { settings, todos, shoppingList, importedItems, toggleTodo } = useAppStore();

  // 获取当前孕周信息
  const { week, day } = settings.calculateCurrentWeek();
  const stage = settings.getStageName();
  const daysUntilDue = settings.getDaysUntilDue();
  const progress = Math.round((week / 40) * 100);

  // 统计数据
  const completedTodos = todos.filter((t) => t.completed).length;
  const hospitalItems = shoppingList.filter((i) => i.stage === 'hospital');
  const checkedHospitalItems = hospitalItems.filter((i) => i.checked).length;

  return (
    <div>
      <Header
        title="欢迎回来，准妈妈"
        subtitle={`孕期第 ${(week - 1) * 7 + day} 天`}
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {/* 当前孕周 */}
        <div className="card-soft card-hover p-6 border border-coral-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral-100 to-coral-200 flex items-center justify-center">
              <Baby className="text-coral-500" size={28} />
            </div>
            <span className="text-xs text-white font-bold bg-coral-400 px-3 py-1 rounded-full">
              {stage}
            </span>
          </div>
          <div className="text-4xl font-bold text-warm-800 mb-1">
            {week}
            <span className="text-lg font-semibold text-warm-600 ml-1">周</span>
          </div>
          <p className="text-sm text-warm-600 font-medium">第 {day} 天</p>
        </div>

        {/* 距离预产期 */}
        <div className="card-soft card-hover p-6 border border-sunny-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sunny-100 to-sunny-200 flex items-center justify-center">
              <Calendar className="text-sunny-500" size={28} />
            </div>
            <span className="text-xs text-white font-bold bg-sunny-400 px-3 py-1 rounded-full">
              倒计时
            </span>
          </div>
          <div className="text-4xl font-bold text-warm-800 mb-1">
            {daysUntilDue}
            <span className="text-lg font-semibold text-warm-600 ml-1">天</span>
          </div>
          <p className="text-sm text-warm-600 font-medium">
            预产期 {settings.dueDate?.slice(5).replace('-', '月')}日
          </p>
        </div>

        {/* 本周待办 */}
        <div className="card-soft card-hover p-6 border border-mint-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-mint-100 to-mint-200 flex items-center justify-center">
              <CheckCircle2 className="text-mint-500" size={28} />
            </div>
            <span className="text-xs text-warm-600 font-bold bg-mint-100 px-3 py-1 rounded-full">
              本周
            </span>
          </div>
          <div className="text-4xl font-bold text-warm-800 mb-1">
            {completedTodos}
            <span className="text-lg font-semibold text-warm-600">/{todos.length}</span>
          </div>
          <p className="text-sm text-warm-600 font-medium">待办已完成</p>
        </div>

        {/* 待产包 */}
        <div className="card-soft card-hover p-6 border border-lavender-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lavender-100 to-lavender-200 flex items-center justify-center">
              <Package className="text-lavender-400" size={28} />
            </div>
            <span className="text-xs text-warm-600 font-bold bg-lavender-100 px-3 py-1 rounded-full">
              待产包
            </span>
          </div>
          <div className="text-4xl font-bold text-warm-800 mb-1">
            {checkedHospitalItems}
            <span className="text-lg font-semibold text-warm-600">/{hospitalItems.length}</span>
          </div>
          <p className="text-sm text-warm-600 font-medium">物品已准备</p>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 左侧：本周概览 */}
        <div className="col-span-2 space-y-6">
          {/* 孕期进度 */}
          <div className="card-soft p-6 border border-coral-50">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="text-coral-400" size={20} />
              <h3 className="font-display text-xl text-warm-800">孕期进度</h3>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-3 font-semibold">
                  <span className="text-coral-400">孕早期</span>
                  <span className="text-sunny-500">孕中期</span>
                  <span className="text-mint-400">孕晚期</span>
                </div>
                <div className="h-5 bg-cream-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full progress-warm rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-warm-600 mt-2 font-medium">
                  <span>1周</span>
                  <span>12周</span>
                  <span>28周</span>
                  <span>40周</span>
                </div>
              </div>
              <div className="text-center px-8 border-l-2 border-cream-200">
                <div className="text-5xl font-bold bg-gradient-to-r from-coral-400 to-sunny-400 bg-clip-text text-transparent">
                  {progress}%
                </div>
                <p className="text-sm text-warm-600 mt-1 font-semibold">已完成</p>
              </div>
            </div>
          </div>

          {/* 本周重点 */}
          <div className="card-soft p-6 border border-coral-50">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Heart className="text-coral-400" size={20} />
                <h3 className="font-display text-xl text-warm-800">第 {week} 周重点</h3>
              </div>
              <a
                href={`/timeline?week=${week}`}
                className="text-sm text-coral-400 hover:text-coral-500 transition-colors duration-200 flex items-center gap-1 font-semibold cursor-pointer"
              >
                查看详情 <ChevronRight size={16} />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* 胎儿发育 */}
              <div className="p-5 bg-gradient-to-br from-coral-50 to-coral-100 rounded-2xl border border-coral-200 transition-all duration-200 hover:shadow-lg cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Baby className="text-coral-400" size={20} />
                  </div>
                  <h4 className="font-bold text-warm-800">胎儿发育</h4>
                </div>
                <p className="text-sm text-warm-600 leading-relaxed font-medium">
                  宝宝约 30cm，600g，像木瓜大小。听力发育完善，可以听到外界声音了！
                </p>
              </div>

              {/* 身体变化 */}
              <div className="p-5 bg-gradient-to-br from-sunny-50 to-sunny-100 rounded-2xl border border-sunny-200 transition-all duration-200 hover:shadow-lg cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Scale className="text-sunny-500" size={20} />
                  </div>
                  <h4 className="font-bold text-warm-800">身体变化</h4>
                </div>
                <p className="text-sm text-warm-600 leading-relaxed font-medium">
                  子宫增大，可能出现腰酸背痛。胎动明显，每天应感受 10 次以上~
                </p>
              </div>

              {/* 产检项目 */}
              <div className="p-5 bg-gradient-to-br from-mint-50 to-mint-100 rounded-2xl border border-mint-200 transition-all duration-200 hover:shadow-lg cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Stethoscope className="text-mint-500" size={20} />
                  </div>
                  <h4 className="font-bold text-warm-800">产检项目</h4>
                </div>
                <p className="text-sm text-warm-600 leading-relaxed font-medium">
                  糖耐量测试（24-28周必做），常规血压、体重、宫高检查。
                </p>
              </div>

              {/* 购物建议 */}
              <div className="p-5 bg-gradient-to-br from-lavender-50 to-lavender-100 rounded-2xl border border-lavender-200 transition-all duration-200 hover:shadow-lg cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <ShoppingBag className="text-lavender-400" size={20} />
                  </div>
                  <h4 className="font-bold text-warm-800">购物建议</h4>
                </div>
                <p className="text-sm text-warm-600 leading-relaxed font-medium">
                  开始准备待产包，购买婴儿基础用品，预约月嫂或月子中心。
                </p>
              </div>
            </div>
          </div>

          {/* 需要关注的事项 */}
          <div className="card-soft p-6 border border-sunny-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-sunny-500" size={20} />
                <h3 className="font-display text-xl text-warm-800">需要关注的事项</h3>
              </div>
              <span className="text-xs text-white font-bold bg-sunny-400 px-3 py-1.5 rounded-full">
                3 项待处理
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sunny-50 to-sunny-100 rounded-2xl border border-sunny-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-sunny-400 animate-pulse" />
                  <span className="text-sm text-warm-700 font-semibold">
                    糖耐量测试还未预约
                  </span>
                </div>
                <button className="text-xs text-sunny-500 hover:text-sunny-600 font-bold px-3 py-1 bg-white rounded-full shadow cursor-pointer transition-colors duration-200">
                  去处理 →
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-coral-50 to-coral-100 rounded-2xl border border-coral-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-coral-400 animate-pulse" />
                  <span className="text-sm text-warm-700 font-semibold">
                    待产包还有 {hospitalItems.length - checkedHospitalItems} 件物品未购买
                  </span>
                </div>
                <button className="text-xs text-coral-500 hover:text-coral-600 font-bold px-3 py-1 bg-white rounded-full shadow cursor-pointer transition-colors duration-200">
                  去处理 →
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-mint-50 to-mint-100 rounded-2xl border border-mint-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-mint-400 animate-pulse" />
                  <span className="text-sm text-warm-700 font-semibold">
                    本周体重记录还未填写
                  </span>
                </div>
                <button className="text-xs text-mint-500 hover:text-mint-600 font-bold px-3 py-1 bg-white rounded-full shadow cursor-pointer transition-colors duration-200">
                  去处理 →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：待办 & 小红书 */}
        <div className="space-y-6">
          {/* 今日待办 */}
          <div className="card-soft p-6 border border-mint-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-mint-400" size={20} />
                <h3 className="font-display text-xl text-warm-800">今日待办</h3>
              </div>
              <button className="text-sm text-coral-400 hover:text-coral-500 transition-colors duration-200 font-bold cursor-pointer">
                <Plus size={16} className="inline mr-1" />
                添加
              </button>
            </div>
            <div className="space-y-3">
              {todos.map((todo) => (
                <label
                  key={todo.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 border ${
                    todo.completed
                      ? 'bg-mint-50 border-mint-100'
                      : 'bg-cream-100 border-cream-200 hover:bg-cream-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 rounded-lg"
                  />
                  <span
                    className={`text-sm font-medium ${
                      todo.completed ? 'text-warm-600 line-through' : 'text-warm-700'
                    }`}
                  >
                    {todo.title}
                  </span>
                  {todo.completed && (
                    <CheckCircle2 size={16} className="text-mint-400 ml-auto" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* 小红书内容 */}
          <div className="card-soft p-6 border border-coral-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="text-coral-400" size={20} />
                <h3 className="font-display text-xl text-warm-800">小红书内容</h3>
              </div>
              <a
                href="/import"
                className="text-sm text-coral-400 hover:text-coral-500 transition-colors duration-200 font-bold cursor-pointer"
              >
                查看全部
              </a>
            </div>
            <div className="space-y-3">
              {importedItems.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-gradient-to-r from-red-50 to-coral-50 rounded-2xl hover:shadow-md transition-all duration-200 cursor-pointer border border-red-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                      <Bookmark className="text-red-400" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-warm-700 truncate font-bold">
                        {item.sourceTitle}
                      </p>
                      <p className="text-xs text-warm-600 mt-1 font-medium">
                        {item.isIntegrated ? '已整合' : '待整合'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="/import"
              className="block w-full mt-4 py-3 border-2 border-dashed border-coral-200 rounded-2xl text-sm text-coral-400 hover:border-coral-400 hover:bg-coral-50 transition-all duration-200 font-bold text-center cursor-pointer"
            >
              <Plus size={16} className="inline mr-2" />
              导入新文章
            </a>
          </div>

          {/* 家人共享 */}
          <div className="bg-gradient-to-br from-lavender-100 via-coral-50 to-sunny-100 rounded-3xl p-5 border border-lavender-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Users className="text-lavender-400" size={20} />
              <span className="font-bold text-warm-800">家人共享</span>
            </div>
            <p className="text-xs text-warm-600 leading-relaxed mb-4 font-medium">
              邀请准爸爸和家人一起查看孕期安排，共同参与准备工作~
            </p>
            <button className="w-full py-2.5 bg-white text-coral-500 rounded-xl hover:bg-coral-50 transition-all duration-200 font-bold shadow-sm cursor-pointer">
              生成分享链接
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
