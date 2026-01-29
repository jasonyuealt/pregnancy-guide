'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/bloc/app.bloc';
import { generateWeekContent, WeekContentData } from '@/lib/ai';
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
  Loader2,
  AlertCircle,
  Utensils,
} from 'lucide-react';

/**
 * 孕期时间轴 - 周视图为核心
 * AI 实时生成每周内容
 */
export default function TimelinePage() {
  const { settings, getCurrentWeekInfo, weekDataCache, setWeekData } = useAppStore();
  const { week: actualWeek, daysUntilDue } = getCurrentWeekInfo();
  
  const [currentWeek, setCurrentWeek] = useState(actualWeek);
  const [isGenerating, setIsGenerating] = useState(false);
  const [weekContent, setWeekContent] = useState<WeekContentData | null>(null);
  
  const isCurrentWeek = currentWeek === actualWeek;

  // 检查缓存或加载内容
  useEffect(() => {
    const cached = weekDataCache[currentWeek];
    if (cached) {
      setWeekContent(cached as unknown as WeekContentData);
    } else {
      setWeekContent(null);
    }
  }, [currentWeek, weekDataCache]);

  // AI 生成内容
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const content = await generateWeekContent(currentWeek);
      setWeekContent(content);
      // 保存到缓存
      setWeekData(currentWeek, content as unknown as typeof weekDataCache[number]);
    } catch (error) {
      console.error('生成失败:', error);
      alert('AI 生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

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
            {settings.dueDate && (
              <span className="text-sm text-warm-500">
                距预产期 {Math.max(0, daysUntilDue - (currentWeek - actualWeek) * 7)} 天
              </span>
            )}
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

      {/* 内容区域 */}
      {!weekContent ? (
        // 未生成内容时显示生成按钮
        <div className="card-soft p-12 border border-coral-100 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-coral-100 to-sunny-100 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="text-coral-400" size={36} />
          </div>
          <h3 className="font-display text-2xl text-warm-800 mb-3">
            第 {currentWeek} 周内容待生成
          </h3>
          <p className="text-warm-600 mb-6 max-w-md mx-auto">
            点击下方按钮，AI 将为你生成本周的胎儿发育、注意事项、产检提醒、购物建议等完整内容
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-8 py-4 gradient-coral text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                AI 生成中...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                AI 生成本周内容
              </>
            )}
          </button>
        </div>
      ) : (
        // 已生成内容
        <>
          {/* 胎儿发育 */}
          <div className="card-soft p-6 mb-5 border border-coral-100">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-coral-100 to-coral-200 flex items-center justify-center flex-shrink-0">
                <Baby className="text-coral-500" size={40} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl text-warm-800">胎儿发育</h3>
                    <span className="text-sm text-warm-500">像{weekContent.fetalSize}大小</span>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="text-xs text-coral-400 hover:text-coral-500 font-medium cursor-pointer flex items-center gap-1"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                    重新生成
                  </button>
                </div>
                <div className="flex gap-4 mb-3">
                  <span className="text-sm text-warm-600">
                    身长 <strong className="text-coral-500">{weekContent.fetalLength}cm</strong>
                  </span>
                  <span className="text-sm text-warm-600">
                    体重 <strong className="text-coral-500">{weekContent.fetalWeight}g</strong>
                  </span>
                </div>
                <p className="text-sm text-warm-600 leading-relaxed">{weekContent.fetalDevelopment}</p>
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
                {weekContent.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="text-mint-400 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-sm text-warm-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 产检提醒 */}
            <div className="card-soft p-5 border border-mint-100">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="text-mint-500" size={20} />
                <h3 className="font-display text-lg text-warm-800">产检项目</h3>
              </div>
              {weekContent.checkups.length > 0 ? (
                <div className="space-y-2">
                  {weekContent.checkups.map((item, idx) => (
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
              ) : (
                <p className="text-sm text-warm-500 text-center py-4">本周无特殊产检</p>
              )}
            </div>
          </div>

          {/* 饮食建议 + 警惕症状 */}
          <div className="grid grid-cols-2 gap-5 mb-5">
            {/* 饮食建议 */}
            <div className="card-soft p-5 border border-coral-100">
              <div className="flex items-center gap-2 mb-4">
                <Utensils className="text-coral-400" size={20} />
                <h3 className="font-display text-lg text-warm-800">饮食建议</h3>
              </div>
              <ul className="space-y-2">
                {weekContent.nutrition.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="text-coral-400 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-sm text-warm-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 警惕症状 */}
            {weekContent.warnings.length > 0 && (
              <div className="card-soft p-5 border border-red-100 bg-gradient-to-br from-red-50 to-white">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="text-red-400" size={20} />
                  <h3 className="font-display text-lg text-warm-800">需警惕症状</h3>
                </div>
                <ul className="space-y-2">
                  {weekContent.warnings.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={14} />
                      <span className="text-sm text-red-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
            {weekContent.shopping.length > 0 ? (
              <div className="space-y-2">
                {weekContent.shopping.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-cream-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                      <span className="text-sm text-warm-700 font-medium">{item.name}</span>
                    </div>
                    <span className="text-xs text-warm-500">{item.reason}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-warm-500 text-center py-4">本周无特殊购买建议</p>
            )}
            <button className="mt-3 w-full py-2 border-2 border-dashed border-lavender-200 rounded-xl text-sm text-lavender-400 font-medium hover:border-lavender-400 transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1">
              <Plus size={14} />
              添加购物项
            </button>
          </div>
        </>
      )}
    </div>
  );
}
