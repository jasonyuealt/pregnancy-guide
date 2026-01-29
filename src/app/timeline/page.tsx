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
 * 优化布局 + 移动端适配 + 动画效果
 */
export default function TimelinePage() {
  const { settings, getCurrentWeekInfo, weekDataCache, setWeekData } = useAppStore();
  const { week: actualWeek, day: actualDay, daysUntilDue } = getCurrentWeekInfo();
  
  // 中国标准：孕0周到孕39周
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
      setWeekData(currentWeek, content as unknown as typeof weekDataCache[number]);
    } catch (error) {
      console.error('生成失败:', error);
      alert('AI 生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 周数导航（0-39周）
  const goToPrevWeek = () => setCurrentWeek((w) => Math.max(0, w - 1));
  const goToNextWeek = () => setCurrentWeek((w) => Math.min(39, w + 1));

  // 获取阶段（中国标准）
  const getStage = (w: number) => {
    if (w < 13) return { name: '孕早期', color: 'coral' };
    if (w < 28) return { name: '孕中期', color: 'sunny' };
    return { name: '孕晚期', color: 'mint' };
  };
  const stage = getStage(currentWeek);

  return (
    <div className="max-w-4xl mx-auto">
      {/* 周导航 - 移动端优化 */}
      <div className="flex items-center justify-between mb-4 md:mb-6 animate-fade-in">
        <button
          onClick={goToPrevWeek}
          disabled={currentWeek <= 0}
          className="p-2 md:p-3 bg-white rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-30"
        >
          <ChevronLeft className="text-warm-600" size={20} />
        </button>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-1">
            <span className="font-display text-2xl md:text-4xl text-warm-800">孕{currentWeek}周</span>
            {isCurrentWeek && (
              <span className="px-2 md:px-3 py-0.5 md:py-1 gradient-coral text-white text-xs rounded-full font-bold">
                +{actualDay}
              </span>
            )}
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className={`px-2 md:px-3 py-0.5 md:py-1 bg-${stage.color}-100 text-${stage.color}-500 text-xs md:text-sm rounded-full font-medium`}>
              {stage.name}
            </span>
            {settings.dueDate && (
              <span className="text-xs md:text-sm text-warm-500">
                距预产期 {Math.max(0, daysUntilDue - (currentWeek - actualWeek) * 7)} 天
              </span>
            )}
          </div>
        </div>

        <button
          onClick={goToNextWeek}
          disabled={currentWeek >= 39}
          className="p-2 md:p-3 bg-white rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-30"
        >
          <ChevronRight className="text-warm-600" size={20} />
        </button>
      </div>

      {/* 快速跳转 - 横向滚动 */}
      <div className="flex justify-start md:justify-center gap-1 mb-6 md:mb-8 overflow-x-auto py-2 px-1 scrollbar-hide animate-fade-in">
        {Array.from({ length: 9 }, (_, i) => currentWeek - 4 + i)
          .filter((w) => w >= 0 && w <= 39)
          .map((w) => (
            <button
              key={w}
              onClick={() => setCurrentWeek(w)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                w === currentWeek
                  ? 'gradient-coral text-white shadow'
                  : w === actualWeek
                  ? 'bg-mint-100 text-mint-600'
                  : 'text-warm-500 hover:bg-cream-100'
              }`}
            >
              {w}周
            </button>
          ))}
      </div>

      {/* 内容区域 */}
      {!weekContent ? (
        // 未生成内容
        <div className="card-soft p-8 md:p-12 border border-coral-100 text-center animate-fade-in-scale">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-coral-100 to-sunny-100 flex items-center justify-center mx-auto mb-4 md:mb-6">
            <Sparkles className="text-coral-400" size={32} />
          </div>
          <h3 className="font-display text-xl md:text-2xl text-warm-800 mb-2 md:mb-3">
            第 {currentWeek} 周内容待生成
          </h3>
          <p className="text-sm md:text-base text-warm-600 mb-4 md:mb-6 max-w-md mx-auto">
            AI 将生成本周的胎儿发育、注意事项、产检提醒、购物建议等
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 gradient-coral text-white rounded-xl md:rounded-2xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                AI 生成中...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                AI 生成本周内容
              </>
            )}
          </button>
        </div>
      ) : (
        // 已生成内容
        <div className="space-y-4 md:space-y-5">
          {/* 胎儿发育 */}
          <div className="card-soft p-4 md:p-6 border border-coral-100 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-5">
              <div className="flex items-center gap-4 md:block">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br from-coral-100 to-coral-200 flex items-center justify-center flex-shrink-0">
                  <Baby className="text-coral-500" size={32} />
                </div>
                <div className="md:hidden">
                  <h3 className="font-display text-lg text-warm-800">胎儿发育</h3>
                  <p className="text-sm text-warm-500">像{weekContent.fetalSize}大小</p>
                </div>
              </div>
              <div className="flex-1">
                <div className="hidden md:flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl text-warm-800">胎儿发育</h3>
                    <span className="text-sm text-warm-500">像{weekContent.fetalSize}大小</span>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="text-xs text-coral-400 hover:text-coral-500 font-medium cursor-pointer flex items-center gap-1 transition-colors duration-200"
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

          {/* 注意事项 + 产检 - 响应式布局 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* 本周注意事项 */}
            <div className="card-soft p-4 md:p-5 border border-sunny-100 animate-fade-in-up stagger-1">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <AlertTriangle className="text-sunny-500" size={18} />
                <h3 className="font-display text-base md:text-lg text-warm-800">注意事项</h3>
              </div>
              <ul className="space-y-2">
                {weekContent.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                    <Check className="text-mint-400 mt-0.5 flex-shrink-0" size={14} />
                    <span className="text-sm text-warm-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 产检提醒 */}
            <div className="card-soft p-4 md:p-5 border border-mint-100 animate-fade-in-up stagger-2">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Stethoscope className="text-mint-500" size={18} />
                <h3 className="font-display text-base md:text-lg text-warm-800">产检项目</h3>
              </div>
              {weekContent.checkups.length > 0 ? (
                <div className="space-y-2">
                  {weekContent.checkups.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 md:p-3 rounded-xl transition-all duration-200 ${
                        item.important
                          ? 'bg-gradient-to-r from-sunny-50 to-sunny-100 border border-sunny-200'
                          : 'bg-cream-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {item.important && <AlertTriangle size={12} className="text-sunny-500" />}
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

          {/* 饮食 + 警惕 - 紧凑横向布局 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* 饮食建议 */}
            <div className="card-soft p-4 md:p-5 border border-coral-100 animate-fade-in-up stagger-3">
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="text-coral-400" size={18} />
                <h3 className="font-display text-base md:text-lg text-warm-800">饮食建议</h3>
              </div>
              <ul className="space-y-1.5">
                {weekContent.nutrition.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="text-coral-400 mt-0.5 flex-shrink-0" size={14} />
                    <span className="text-sm text-warm-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 警惕症状 */}
            {weekContent.warnings.length > 0 && (
              <div className="card-soft p-4 md:p-5 border border-red-100 bg-gradient-to-br from-red-50/50 to-white animate-fade-in-up stagger-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="text-red-400" size={18} />
                  <h3 className="font-display text-base md:text-lg text-warm-800">需警惕症状</h3>
                </div>
                <ul className="space-y-1.5">
                  {weekContent.warnings.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={12} />
                      <span className="text-sm text-red-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 本周建议购买 */}
          <div className="card-soft p-4 md:p-5 border border-lavender-100 animate-fade-in-up stagger-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-lavender-400" size={18} />
                <h3 className="font-display text-base md:text-lg text-warm-800">本周建议购买</h3>
              </div>
              <a
                href="/shopping"
                className="text-xs text-lavender-400 hover:text-lavender-500 font-medium cursor-pointer transition-colors duration-200"
              >
                完整清单
              </a>
            </div>
            {weekContent.shopping.length > 0 ? (
              <div className="space-y-2">
                {weekContent.shopping.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-cream-50 rounded-xl transition-all duration-200 hover:bg-cream-100"
                  >
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                      <span className="text-sm text-warm-700 font-medium">{item.name}</span>
                    </div>
                    <span className="text-xs text-warm-500 hidden md:inline">{item.reason}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-warm-500 text-center py-4">本周无特殊购买建议</p>
            )}
            <button className="mt-3 w-full py-2 border-2 border-dashed border-lavender-200 rounded-xl text-sm text-lavender-400 font-medium hover:border-lavender-400 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1">
              <Plus size={14} />
              添加购物项
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
