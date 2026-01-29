'use client';

import { useState } from 'react';
import { useAppStore } from '@/bloc/app.bloc';
import {
  ChevronLeft,
  ChevronRight,
  Baby,
  AlertTriangle,
  Stethoscope,
  ShoppingBag,
  Sparkles,
  Check,
  Plus,
} from 'lucide-react';

/**
 * 模拟的孕周数据（后续由 AI 生成）
 */
const mockWeekData: Record<number, {
  fetalSize: string;
  fetalWeight: string;
  fetalLength: string;
  fetalDevelopment: string;
  keyPoints: string[];
  checkups: { name: string; important: boolean }[];
  shopping: { name: string; checked: boolean }[];
}> = {
  24: {
    fetalSize: '木瓜',
    fetalWeight: '600',
    fetalLength: '30',
    fetalDevelopment: '本周宝宝的听力发育完善，能听到妈妈的心跳和外界声音，可以开始音乐胎教了。',
    keyPoints: [
      '每天感受胎动 10 次以上',
      '补充钙和铁，预防贫血',
      '避免长时间站立或久坐',
      '开始音乐胎教',
    ],
    checkups: [
      { name: '糖耐量测试（OGTT）', important: true },
      { name: '常规检查：血压、体重、宫高', important: false },
    ],
    shopping: [
      { name: '孕妇枕', checked: false },
      { name: '托腹带', checked: false },
      { name: 'DHA', checked: true },
    ],
  },
};

/**
 * 孕期时间轴 - 周视图为核心
 */
export default function TimelinePage() {
  const { settings, getCurrentWeekInfo } = useAppStore();
  const { week: actualWeek, daysUntilDue } = getCurrentWeekInfo();
  
  const [currentWeek, setCurrentWeek] = useState(actualWeek);
  const isCurrentWeek = currentWeek === actualWeek;

  // 获取当前周数据（如果没有则用默认）
  const weekData = mockWeekData[currentWeek] || mockWeekData[24];

  // 周数导航
  const goToPrevWeek = () => setCurrentWeek((w) => Math.max(1, w - 1));
  const goToNextWeek = () => setCurrentWeek((w) => Math.min(40, w + 1));

  // 获取阶段
  const getStage = (w: number) => {
    if (w <= 12) return { name: '孕早期', color: 'coral' };
    if (w <= 28) return { name: '孕中期', color: 'sunny' };
    return { name: '孕晚期', color: 'mint' };
  };
  const stage = getStage(currentWeek);

  return (
    <div className="max-w-4xl mx-auto">
      {/* 周导航 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrevWeek}
          disabled={currentWeek <= 1}
          className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer disabled:opacity-30"
        >
          <ChevronLeft className="text-warm-600" size={24} />
        </button>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="font-display text-4xl text-warm-800">第 {currentWeek} 周</span>
            {isCurrentWeek && (
              <span className="px-3 py-1 bg-mint-400 text-white text-xs rounded-full font-bold">当前</span>
            )}
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className={`px-3 py-1 bg-${stage.color}-100 text-${stage.color}-500 text-sm rounded-full font-medium`}>
              {stage.name}
            </span>
            <span className="text-sm text-warm-500">
              距预产期 {daysUntilDue - (currentWeek - actualWeek) * 7} 天
            </span>
          </div>
        </div>

        <button
          onClick={goToNextWeek}
          disabled={currentWeek >= 40}
          className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer disabled:opacity-30"
        >
          <ChevronRight className="text-warm-600" size={24} />
        </button>
      </div>

      {/* 快速跳转 */}
      <div className="flex justify-center gap-1 mb-8 overflow-x-auto py-2">
        {Array.from({ length: 9 }, (_, i) => currentWeek - 4 + i)
          .filter((w) => w >= 1 && w <= 40)
          .map((w) => (
            <button
              key={w}
              onClick={() => setCurrentWeek(w)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                w === currentWeek
                  ? 'gradient-coral text-white shadow'
                  : w === actualWeek
                  ? 'bg-mint-100 text-mint-600'
                  : 'text-warm-500 hover:bg-cream-100'
              }`}
            >
              {w}
            </button>
          ))}
      </div>

      {/* 胎儿发育 */}
      <div className="card-soft p-6 mb-5 border border-coral-100">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-coral-100 to-coral-200 flex items-center justify-center flex-shrink-0">
            <Baby className="text-coral-500" size={40} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-display text-xl text-warm-800">胎儿发育</h3>
              <span className="text-sm text-warm-500">像{weekData.fetalSize}大小</span>
            </div>
            <div className="flex gap-4 mb-3">
              <span className="text-sm text-warm-600">
                身长 <strong className="text-coral-500">{weekData.fetalLength}cm</strong>
              </span>
              <span className="text-sm text-warm-600">
                体重 <strong className="text-coral-500">{weekData.fetalWeight}g</strong>
              </span>
            </div>
            <p className="text-sm text-warm-600 leading-relaxed">{weekData.fetalDevelopment}</p>
          </div>
        </div>
      </div>

      {/* 两栏：注意事项 + 产检 */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* 本周注意事项 */}
        <div className="card-soft p-5 border border-sunny-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-sunny-500" size={20} />
            <h3 className="font-display text-lg text-warm-800">注意事项</h3>
          </div>
          <ul className="space-y-2">
            {weekData.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="text-mint-400 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-sm text-warm-600">{point}</span>
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full py-2 text-sm text-sunny-500 bg-sunny-50 rounded-xl font-medium hover:bg-sunny-100 transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1">
            <Plus size={14} />
            添加注意事项
          </button>
        </div>

        {/* 产检提醒 */}
        <div className="card-soft p-5 border border-mint-100">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="text-mint-500" size={20} />
            <h3 className="font-display text-lg text-warm-800">产检项目</h3>
          </div>
          <div className="space-y-2">
            {weekData.checkups.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl ${
                  item.important
                    ? 'bg-gradient-to-r from-sunny-50 to-sunny-100 border border-sunny-200'
                    : 'bg-cream-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.important && <AlertTriangle size={14} className="text-sunny-500" />}
                  <span className="text-sm text-warm-700 font-medium">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 本周建议购买 */}
      <div className="card-soft p-5 border border-lavender-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-lavender-400" size={20} />
            <h3 className="font-display text-lg text-warm-800">本周建议购买</h3>
          </div>
          <a
            href="/shopping"
            className="text-xs text-lavender-400 hover:text-lavender-500 font-medium cursor-pointer"
          >
            查看完整清单
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {weekData.shopping.map((item, idx) => (
            <label
              key={idx}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 ${
                item.checked
                  ? 'bg-mint-50 text-mint-600 border border-mint-200'
                  : 'bg-cream-100 text-warm-700 hover:bg-cream-200'
              }`}
            >
              <input type="checkbox" checked={item.checked} readOnly className="w-4 h-4 rounded" />
              <span className={`text-sm font-medium ${item.checked ? 'line-through' : ''}`}>
                {item.name}
              </span>
            </label>
          ))}
          <button className="px-4 py-2 border-2 border-dashed border-lavender-200 rounded-xl text-sm text-lavender-400 font-medium hover:border-lavender-400 transition-colors duration-200 cursor-pointer flex items-center gap-1">
            <Plus size={14} />
            添加
          </button>
        </div>
      </div>

      {/* AI 生成提示 */}
      <div className="mt-6 p-4 bg-gradient-to-r from-lavender-50 to-coral-50 rounded-2xl border border-lavender-100 text-center">
        <button className="inline-flex items-center gap-2 px-6 py-3 gradient-coral text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
          <Sparkles size={18} />
          AI 生成本周内容
        </button>
        <p className="text-xs text-warm-500 mt-2">根据孕周自动生成专业的孕期指导内容</p>
      </div>
    </div>
  );
}
