'use client';

import { useState } from 'react';
import { useAppStore } from '@/bloc/app.bloc';
import Header from '@/components/layout/Header';
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Plus,
  Sparkles,
  AlertTriangle,
  Stethoscope,
  Baby,
  Scale,
  Footprints,
  Droplets,
  Moon,
  Check,
  Utensils,
  Apple,
  Cookie,
  UtensilsCrossed,
  ShoppingCart,
  Bookmark,
  Heart,
  Activity,
} from 'lucide-react';

/**
 * 模拟的孕周数据（后续由 AI 生成）
 */
const mockWeekData = {
  week: 24,
  fetalSize: '木瓜',
  fetalWeight: '600',
  fetalLength: '30',
  fetalDevelopment:
    '本周宝宝的听力已经发育完善，能够听到妈妈的心跳和外界的声音，可以开始进行音乐胎教了。皮肤开始变得不那么透明，皮下脂肪正在慢慢积累。宝宝的肺部正在发育，开始产生表面活性物质。',
  bodyChanges: [
    { icon: Scale, title: '体重增加', desc: '建议已增重 5.5-6.5 kg', color: 'coral' },
    { icon: Footprints, title: '胎动明显', desc: '每天应感受 10 次以上', color: 'mint' },
    { icon: Droplets, title: '可能水肿', desc: '避免长时间站立或久坐', color: 'sunny' },
    { icon: Moon, title: '睡眠困难', desc: '建议左侧卧，用孕妇枕', color: 'lavender' },
  ],
  tips: [
    '本周进行糖耐量测试（OGTT）',
    '每天补充钙和铁，预防贫血',
    '开始进行音乐胎教',
    '避免长时间站立或久坐',
  ],
  nutrition: [
    { icon: Utensils, text: '增加蛋白质摄入（鱼、蛋、奶）' },
    { icon: Apple, text: '多吃富含铁的食物' },
    { icon: Cookie, text: '控制糖分，预防妊娠糖尿病' },
    { icon: UtensilsCrossed, text: '少食多餐，避免暴饮暴食' },
  ],
  checkups: [
    { name: '糖耐量测试', desc: '24-28周必做，筛查妊娠糖尿病', important: true },
    { name: '常规检查', desc: '血压、体重、宫高、腹围', important: false },
  ],
  shopping: [
    { name: '胎心仪（可选）', checked: false },
    { name: '孕妇枕', checked: false },
    { name: '钙片', checked: true },
    { name: 'DHA', checked: true },
  ],
};

/**
 * 孕期时间轴页面
 * UI/UX Pro Max 优化：SVG 图标替代 emoji，cursor-pointer，过渡动画
 */
export default function TimelinePage() {
  const { settings } = useAppStore();
  const [currentWeek, setCurrentWeek] = useState(24);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  const { week: actualWeek } = settings.calculateCurrentWeek();
  const daysUntilDue = settings.getDaysUntilDue();
  const isCurrentWeek = currentWeek === actualWeek;

  // 周数导航
  const weeks = Array.from({ length: 9 }, (_, i) => currentWeek - 4 + i).filter(
    (w) => w >= 1 && w <= 40
  );

  // 颜色映射
  const colorMap = {
    coral: 'from-coral-50 to-coral-100 border-coral-200',
    mint: 'from-mint-50 to-mint-100 border-mint-200',
    sunny: 'from-sunny-50 to-sunny-100 border-sunny-200',
    lavender: 'from-lavender-50 to-lavender-100 border-lavender-200',
  };

  const iconColorMap = {
    coral: 'text-coral-500',
    mint: 'text-mint-500',
    sunny: 'text-sunny-500',
    lavender: 'text-lavender-400',
  };

  return (
    <div>
      <Header
        title="孕期时间轴"
        subtitle="查看每日、每周、每月的孕期安排和注意事项"
      />

      {/* 视图切换 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex bg-cream-200 rounded-2xl p-1.5">
          {(['day', 'week', 'month'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`view-tab ${viewMode === mode ? 'active' : 'text-warm-600 hover:text-warm-800'}`}
            >
              {mode === 'day' ? '日' : mode === 'week' ? '周' : '月'}
            </button>
          ))}
        </div>
        <button className="px-6 py-3 gradient-coral text-white rounded-2xl hover:opacity-90 transition-all duration-200 shadow-lg flex items-center gap-2 font-semibold cursor-pointer">
          <Sparkles size={18} />
          <span>AI 生成</span>
        </button>
      </div>

      {/* 周数导航 */}
      <div className="card-soft p-4 mb-6 border border-coral-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentWeek((w) => Math.max(1, w - 1))}
            className="p-3 hover:bg-coral-50 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            <ChevronLeft className="text-coral-400" size={20} />
          </button>
          <div className="flex-1 flex gap-2 overflow-x-auto py-2 px-2">
            {weeks.map((w) => (
              <button
                key={w}
                onClick={() => setCurrentWeek(w)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  w === currentWeek
                    ? 'gradient-coral text-white shadow-lg'
                    : 'text-warm-600 hover:bg-cream-100'
                }`}
              >
                {w}周 {w === actualWeek && '✦'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentWeek((w) => Math.min(40, w + 1))}
            className="p-3 hover:bg-coral-50 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            <ChevronRight className="text-coral-400" size={20} />
          </button>
        </div>
      </div>

      {/* 周详情内容 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 左侧：主要信息 */}
        <div className="col-span-2 space-y-6">
          {/* 周标题 */}
          <div className="gradient-warm rounded-3xl p-6 border border-coral-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-display text-4xl text-warm-800">
                    第 {currentWeek} 周
                  </span>
                  <span className="px-4 py-1.5 bg-coral-400 text-white text-sm rounded-full font-bold">
                    {currentWeek <= 12 ? '孕早期' : currentWeek <= 28 ? '孕中期' : '孕晚期'}
                  </span>
                  {isCurrentWeek && (
                    <span className="px-4 py-1.5 bg-mint-400 text-white text-sm rounded-full font-bold">
                      当前周
                    </span>
                  )}
                </div>
                <p className="text-warm-600 font-medium">
                  预产期: {settings.dueDate} | 还剩 {daysUntilDue} 天
                </p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 rounded-3xl bg-white shadow-lg flex items-center justify-center mb-2">
                  <Baby className="text-coral-400" size={48} />
                </div>
                <p className="text-sm text-warm-600 font-bold">
                  宝宝像{mockWeekData.fetalSize}
                </p>
              </div>
            </div>
          </div>

          {/* 胎儿发育 */}
          <div className="card-soft p-6 border border-coral-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Baby className="text-coral-400" size={22} />
                <h3 className="font-display text-xl text-warm-800">胎儿发育</h3>
              </div>
              <button className="text-sm text-warm-600 hover:text-coral-400 transition-colors duration-200 font-semibold cursor-pointer">
                <Edit3 size={14} className="inline mr-1" />
                编辑
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="text-center p-4 bg-gradient-to-br from-coral-50 to-coral-100 rounded-2xl border border-coral-200">
                <p className="text-3xl font-bold text-coral-500">{mockWeekData.fetalLength}</p>
                <p className="text-xs text-warm-600 mt-1 font-semibold">身长 (cm)</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-sunny-50 to-sunny-100 rounded-2xl border border-sunny-200">
                <p className="text-3xl font-bold text-sunny-500">{mockWeekData.fetalWeight}</p>
                <p className="text-xs text-warm-600 mt-1 font-semibold">体重 (g)</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-mint-50 to-mint-100 rounded-2xl border border-mint-200">
                <p className="text-3xl font-bold text-mint-500">{currentWeek}</p>
                <p className="text-xs text-warm-600 mt-1 font-semibold">胎龄 (周)</p>
              </div>
            </div>
            <p className="text-warm-600 leading-relaxed font-medium">
              {mockWeekData.fetalDevelopment}
            </p>
          </div>

          {/* 身体变化 */}
          <div className="card-soft p-6 border border-sunny-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Activity className="text-sunny-500" size={22} />
                <h3 className="font-display text-xl text-warm-800">身体变化</h3>
              </div>
              <button className="text-sm text-warm-600 hover:text-coral-400 transition-colors duration-200 font-semibold cursor-pointer">
                <Edit3 size={14} className="inline mr-1" />
                编辑
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {mockWeekData.bodyChanges.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 p-4 bg-gradient-to-br ${colorMap[item.color as keyof typeof colorMap]} rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Icon className={iconColorMap[item.color as keyof typeof iconColorMap]} size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-warm-800">{item.title}</h4>
                      <p className="text-sm text-warm-600 mt-1 font-medium">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 注意事项 & 饮食建议 */}
          <div className="grid grid-cols-2 gap-6">
            <div className="card-soft p-6 border border-sunny-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-sunny-500" size={20} />
                  <h3 className="font-display text-lg text-warm-800">注意事项</h3>
                </div>
                <button className="w-8 h-8 rounded-xl bg-sunny-100 text-sunny-500 hover:bg-sunny-200 transition-colors duration-200 cursor-pointer flex items-center justify-center">
                  <Plus size={16} />
                </button>
              </div>
              <ul className="space-y-3">
                {mockWeekData.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="text-mint-400 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-sm text-warm-600 font-medium">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-soft p-6 border border-coral-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Utensils className="text-coral-400" size={20} />
                  <h3 className="font-display text-lg text-warm-800">饮食建议</h3>
                </div>
                <button className="w-8 h-8 rounded-xl bg-coral-100 text-coral-400 hover:bg-coral-200 transition-colors duration-200 cursor-pointer flex items-center justify-center">
                  <Plus size={16} />
                </button>
              </div>
              <ul className="space-y-3">
                {mockWeekData.nutrition.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <li key={idx} className="flex items-start gap-3">
                      <Icon className="text-coral-400 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-sm text-warm-600 font-medium">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* 右侧：产检 & 购物 */}
        <div className="space-y-6">
          {/* 产检项目 */}
          <div className="card-soft p-6 border border-sunny-100">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="text-sunny-500" size={22} />
              <h3 className="font-display text-lg text-warm-800">产检项目</h3>
            </div>
            <div className="space-y-3">
              {mockWeekData.checkups.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
                    item.important
                      ? 'bg-gradient-to-r from-sunny-50 to-sunny-100 border-sunny-200'
                      : 'bg-cream-100 border-cream-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {item.important ? (
                      <AlertTriangle size={16} className="text-sunny-500" />
                    ) : (
                      <Stethoscope size={16} className="text-warm-600" />
                    )}
                    <span className="font-bold text-warm-800 text-sm">{item.name}</span>
                  </div>
                  <p className="text-xs text-warm-600 font-medium">{item.desc}</p>
                  {item.important && (
                    <button className="mt-3 text-xs text-sunny-500 hover:text-sunny-600 font-bold bg-white px-3 py-1 rounded-full shadow-sm cursor-pointer transition-colors duration-200">
                      预约提醒 →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 本周购物 */}
          <div className="card-soft p-6 border border-mint-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-mint-500" size={22} />
                <h3 className="font-display text-lg text-warm-800">建议购买</h3>
              </div>
              <a
                href="/shopping"
                className="text-sm text-mint-500 hover:text-mint-600 transition-colors duration-200 font-bold cursor-pointer"
              >
                查看全部
              </a>
            </div>
            <div className="space-y-2">
              {mockWeekData.shopping.map((item, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    item.checked
                      ? 'bg-mint-50 border border-mint-100'
                      : 'hover:bg-mint-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                    className="w-5 h-5 rounded-lg"
                  />
                  <span
                    className={`text-sm font-medium ${
                      item.checked ? 'text-warm-600 line-through' : 'text-warm-700'
                    }`}
                  >
                    {item.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 小红书内容 */}
          <div className="card-soft p-6 border border-coral-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="text-coral-400" size={22} />
                <h3 className="font-display text-lg text-warm-800">相关笔记</h3>
              </div>
              <button className="text-sm text-coral-400 hover:text-coral-500 transition-colors duration-200 font-bold cursor-pointer">
                <Plus size={14} className="inline mr-1" />
                导入
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-red-50 to-coral-50 rounded-2xl hover:shadow-md transition-all duration-200 cursor-pointer border border-red-100">
                <p className="text-sm text-warm-700 mb-2 font-bold">
                  24周糖耐亲测攻略，一次过！
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-warm-600 font-medium">来自小红书</span>
                  <span className="text-xs text-mint-500 bg-mint-100 px-2 py-0.5 rounded-full font-bold">
                    经验
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-red-50 to-coral-50 rounded-2xl hover:shadow-md transition-all duration-200 cursor-pointer border border-red-100">
                <p className="text-sm text-warm-700 mb-2 font-bold">
                  孕中期必买好物推荐清单
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-warm-600 font-medium">来自小红书</span>
                  <span className="text-xs text-coral-500 bg-coral-100 px-2 py-0.5 rounded-full font-bold">
                    好物
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
